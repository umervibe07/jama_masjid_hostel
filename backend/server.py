from datetime import datetime, timezone, timedelta
from typing import Literal, Optional
import os
import uuid
import bcrypt
import jwt

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from pymongo import AsyncMongoClient
from pydantic import BaseModel, EmailStr, Field


# =========================
# CONFIG
# =========================

load_dotenv()

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://localhost:27017"
)

DB_NAME = os.getenv(
    "DB_NAME",
    "jama_masjid_hostel"
)

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "dev-only-change-me"
)

client = AsyncMongoClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(
    title="Jama Masjid & Boys' Hostel API"
)

api = APIRouter(prefix="/api")

security = HTTPBearer(auto_error=False)

origins = [
    x.strip()
    for x in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000"
    ).split(",")
    if x.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# HELPERS
# =========================

def uid():
    return str(uuid.uuid4())


def now():
    return datetime.now(timezone.utc).isoformat()


def hash_password(password):
    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()


def verify_password(password, hashed):
    try:
        return bcrypt.checkpw(
            password.encode(),
            hashed.encode()
        )
    except Exception:
        return False


def token(user):
    return jwt.encode(
        {
            "sub": user["id"],
            "exp": datetime.now(timezone.utc)
            + timedelta(days=7)
        },
        JWT_SECRET,
        algorithm="HS256"
    )


async def admin(
    creds: HTTPAuthorizationCredentials = Depends(security)
):
    if not creds:
        raise HTTPException(
            401,
            "Not authenticated"
        )

    try:
        payload = jwt.decode(
            creds.credentials,
            JWT_SECRET,
            algorithms=["HS256"]
        )
    except Exception:
        raise HTTPException(
            401,
            "Invalid or expired token"
        )

    u = await db.users.find_one(
        {"id": payload.get("sub")},
        {
            "_id": 0,
            "password_hash": 0
        }
    )

    if not u or u.get("role") != "admin":
        raise HTTPException(
            403,
            "Admin access required"
        )

    return u


# =========================
# MODELS
# =========================

class Login(BaseModel):
    email: EmailStr
    password: str


class Prayer(BaseModel):
    fajr: str = "05:15"
    sunrise: str = "06:30"
    dhuhr: str = "12:45"
    asr: str = "16:15"
    maghrib: str = "18:20"
    isha: str = "19:45"
    jumuah: str = "13:15"
    updated_at: Optional[str] = None

class Application(BaseModel):
    student_name: str = Field(
        min_length=2,
        max_length=100
    )

    father_name: str = Field(
        min_length=2,
        max_length=100
    )

    dob: str

    mobile: str = Field(
        min_length=7,
        max_length=20
    )

    email: EmailStr

    address: str = Field(
        min_length=5,
        max_length=500
    )

    institution: str = Field(
        min_length=2,
        max_length=200
    )

    course: str

    year: str

    emergency_contact: str = Field(
        min_length=7,
        max_length=20
    )

    room_type: Literal[
        "single",
        "shared_2",
        "shared_4"
    ] = "shared_2"

    room_no: Optional[str] = None


class Event(BaseModel):
    title: str
    description: str
    date: str
    time: Optional[str] = None
    category: str = "General"


class Announcement(BaseModel):
    title: str
    body: str
    pinned: bool = False


class Gallery(BaseModel):
    url: str
    caption: str = ""
    category: str = "Masjid"


class HostelRoom(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )
    price: str = Field(
        min_length=1,
        max_length=50
    )
    description: str = Field(
        min_length=2,
        max_length=500
    )
    image: str = ""
    features: list[str] = []


class Facility(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=100
    )
    description: str = Field(
        min_length=2,
        max_length=500
    )
    icon: str = "Building2"
    image: str = ""


# =========================
# MOSQUE STAFF
# =========================

class StaffMember(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )
    role: str = Field(
        min_length=2,
        max_length=100
    )
    introduction: str = Field(
        min_length=2,
        max_length=500
    )
    image: str = ""


@api.get("/staff")
async def staff_list():
    staff = await db.staff.find(
        {},
        {"_id": 0}
    ).sort(
        "created_at",
        1
    ).to_list(50)

    return staff


@api.post("/staff")
async def staff_add(
    x: StaffMember,
    u=Depends(admin)
):
    d = x.model_dump()

    d.update(
        id=uid(),
        created_at=now()
    )

    await db.staff.insert_one(d)

    return d


@api.put("/staff/{id}")
async def staff_update(
    id: str,
    x: StaffMember,
    u=Depends(admin)
):
    d = x.model_dump()

    result = await db.staff.update_one(
        {"id": id},
        {"$set": d}
    )

    if result.matched_count == 0:
        raise HTTPException(
            404,
            "Staff member not found"
        )

    return {
        "ok": True,
        "id": id
    }


@api.delete("/staff/{id}")
async def staff_delete(
    id: str,
    u=Depends(admin)
):
    result = await db.staff.delete_one(
        {"id": id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            404,
            "Staff member not found"
        )

    return {
        "ok": True
    }


# =========================
# FACILITIES
# =========================

@api.get("/facilities")
async def facilities_list():

    facilities = await db.facilities.find(
        {},
        {"_id": 0}
    ).sort(
        "created_at",
        1
    ).to_list(100)

    if not facilities:

        defaults = [
            {
                "id": uid(),
                "title": "Jama Masjid",
                "description":
                    "Elegant prayer hall, mihrab and serene courtyard.",
                "icon": "Building2",
                "image": ""
            },
            {
                "id": uid(),
                "title": "Hostel Rooms",
                "description":
                    "Furnished single, twin and quad-share rooms.",
                "icon": "Bed",
                "image": ""
            },
            {
                "id": uid(),
                "title": "Study Rooms",
                "description":
                    "Quiet study zones with individual desks.",
                "icon": "BookOpen",
                "image": ""
            },
            {
                "id": uid(),
                "title": "Mess & Dining",
                "description":
                    "Halal, home-style meals and a rotating menu.",
                "icon": "Utensils",
                "image": ""
            },
            {
                "id": uid(),
                "title": "Library & Quran Learning",
                "description":
                    "Islamic literature, academic texts and Quran circles.",
                "icon": "Library",
                "image": ""
            },
            {
                "id": uid(),
                "title": "High-speed Wi-Fi",
                "description":
                    "Reliable internet for study and communication.",
                "icon": "Wifi",
                "image": ""
            },
            {
                "id": uid(),
                "title": "Clean Drinking Water",
                "description":
                    "RO-purified water with regular maintenance.",
                "icon": "Droplet",
                "image": ""
            },
            {
                "id": uid(),
                "title": "24×7 Security",
                "description":
                    "Trained guards and CCTV coverage.",
                "icon": "Shield",
                "image": ""
            },
            {
                "id": uid(),
                "title": "Medical Assistance",
                "description":
                    "On-site first aid and on-call medical support.",
                "icon": "HeartPulse",
                "image": ""
            },
            {
                "id": uid(),
                "title": "Common Room",
                "description":
                    "Reading corners and indoor recreation.",
                "icon": "Users",
                "image": ""
            }
        ]

        for facility in defaults:
            facility["created_at"] = now()

        await db.facilities.insert_many(defaults)

        facilities = await db.facilities.find(
            {},
            {"_id": 0}
        ).sort(
            "created_at",
            1
        ).to_list(100)

    return facilities


@api.post("/facilities")
async def facility_add(
    x: Facility,
    u=Depends(admin)
):
    d = x.model_dump()

    d.update(
        id=uid(),
        created_at=now()
    )

    await db.facilities.insert_one(d)

    return d


@api.put("/facilities/{id}")
async def facility_update(
    id: str,
    x: Facility,
    u=Depends(admin)
):
    d = x.model_dump()

    result = await db.facilities.update_one(
        {"id": id},
        {"$set": d}
    )

    if result.matched_count == 0:
        raise HTTPException(
            404,
            "Facility not found"
        )

    return {
        "ok": True,
        "id": id
    }


@api.delete("/facilities/{id}")
async def facility_delete(
    id: str,
    u=Depends(admin)
):
    result = await db.facilities.delete_one(
        {"id": id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            404,
            "Facility not found"
        )

    return {
        "ok": True
    }


# =========================
# HOSTEL ROOMS
# =========================

@api.get("/hostel/rooms")
async def hostel_rooms():

    rooms = await db.hostel_rooms.find(
        {},
        {"_id": 0}
    ).sort(
        "created_at",
        1
    ).to_list(100)

    if not rooms:

        defaults = [
            {
                "id": uid(),
                "name": "Single Room",
                "price": "₹ 8,000 / mo",
                "description":
                    "Private furnished room with study table and storage.",
                "image": "",
                "features": [
                    "Private room",
                    "Study table",
                    "Storage"
                ]
            },
            {
                "id": uid(),
                "name": "Shared — 2 beds",
                "price": "₹ 5,500 / mo",
                "description":
                    "Twin-share room with two desks and wardrobe.",
                "image": "",
                "features": [
                    "2 beds",
                    "2 desks",
                    "Wardrobe"
                ]
            },
            {
                "id": uid(),
                "name": "Shared — 4 beds",
                "price": "₹ 3,800 / mo",
                "description":
                    "Economical quad-share with common study space.",
                "image": "",
                "features": [
                    "4 beds",
                    "Common study area",
                    "Wardrobe"
                ]
            }
        ]

        for room in defaults:
            room["created_at"] = now()

        await db.hostel_rooms.insert_many(defaults)

        rooms = await db.hostel_rooms.find(
            {},
            {"_id": 0}
        ).sort(
            "created_at",
            1
        ).to_list(100)

    return rooms


@api.post("/hostel/rooms")
async def hostel_room_add(
    x: HostelRoom,
    u=Depends(admin)
):
    d = x.model_dump()

    d.update(
        id=uid(),
        created_at=now()
    )

    await db.hostel_rooms.insert_one(d)

    return d


@api.put("/hostel/rooms/{id}")
async def hostel_room_update(
    id: str,
    x: HostelRoom,
    u=Depends(admin)
):
    d = x.model_dump()

    result = await db.hostel_rooms.update_one(
        {"id": id},
        {"$set": d}
    )

    if result.matched_count == 0:
        raise HTTPException(
            404,
            "Room not found"
        )

    return {
        "ok": True,
        "id": id
    }


@api.delete("/hostel/rooms/{id}")
async def hostel_room_delete(
    id: str,
    u=Depends(admin)
):
    result = await db.hostel_rooms.delete_one(
        {"id": id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            404,
            "Room not found"
        )

    return {
        "ok": True
    }


# =========================
# CONTACT MODEL
# =========================

class Contact(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    subject: str
    message: str


# =========================
# AUTH
# =========================

@api.post("/auth/login")
async def login(x: Login):

    u = await db.users.find_one(
        {"email": x.email.lower()}
    )

    if not u or not verify_password(
        x.password,
        u["password_hash"]
    ):
        raise HTTPException(
            401,
            "Invalid email or password"
        )

    return {
        "token": token(u),
        "user": {
            "id": u["id"],
            "email": u["email"],
            "name": u.get(
                "name",
                "Administrator"
            ),
            "role": u.get(
                "role",
                "admin"
            )
        }
    }


@api.get("/auth/me")
async def me(u=Depends(admin)):
    return u


# =========================
# PRAYER TIMINGS
# =========================

@api.get("/prayer-timings")
async def get_prayer():

    return await db.prayer.find_one(
        {},
        {"_id": 0}
    ) or Prayer().model_dump()


@api.put("/prayer-timings")
async def put_prayer(
    x: Prayer,
    u=Depends(admin)
):

    d = x.model_dump()
    d["updated_at"] = now()

    await db.prayer.delete_many({})
    await db.prayer.insert_one(d)

    d.pop("_id", None)

    return d


# =========================
# HOSTEL APPLICATIONS
# =========================
@api.post("/hostel/applications")
async def apply(x: Application):

    d = x.model_dump()

    d["room_no"] = None

    d.update(
        id=uid(),
        status="pending",
        created_at=now()
    )

    await db.applications.insert_one(d)

    return {
        "message": "Application submitted successfully",
        "application_id": d["id"]
    }


@api.get("/hostel/applications")
async def apps(u=Depends(admin)):

    return await db.applications.find(
        {},
        {"_id": 0}
    ).sort(
        "created_at",
        -1
    ).to_list(500)

@api.patch("/hostel/applications/{id}")
async def app_status(
    id: str,
    status: dict,
    u=Depends(admin)
):

    app_doc = await db.applications.find_one(
        {"id": id},
        {"_id": 0}
    )

    if not app_doc:
        raise HTTPException(
            404,
            "Application not found"
        )

    requested_status = status.get("status")

    if requested_status is not None and requested_status not in [
        "pending",
        "approved",
        "rejected"
    ]:
        raise HTTPException(
            400,
            "Invalid status"
        )

    room_no = status.get(
        "room_no",
        app_doc.get("room_no")
    )

    if room_no is not None:
        room_no = str(room_no).strip()

        if not room_no:
            room_no = None

    # Approved application ka room change nahi hoga
    if (
        "room_no" in status
        and room_no != app_doc.get("room_no")
    ):
        if app_doc.get("status") == "approved":
            raise HTTPException(
                400,
                "Approved application Room No. cannot be changed."
            )

        if app_doc.get("status") != "pending":
            raise HTTPException(
                400,
                "Room No. can only be assigned or changed while the application is Pending."
            )

    # Approval ke liye Room No. compulsory hai
    if requested_status == "approved" and not room_no:
        raise HTTPException(
            400,
            "Please assign a Room No. before approving this application."
        )

    update_data = {}

    if "room_no" in status:
        update_data["room_no"] = room_no

    if requested_status is not None:
        update_data["status"] = requested_status

    if not update_data:
        raise HTTPException(
            400,
            "No application changes supplied"
        )

    r = await db.applications.update_one(
        {"id": id},
        {
            "$set": update_data
        }
    )

    return {
        "updated": r.modified_count > 0,
        "room_no": room_no,
        "status": requested_status or app_doc.get("status")
    }

@api.delete("/hostel/applications/{id}")
async def app_delete(
    id: str,
    u=Depends(admin)
):

    await db.applications.delete_one(
        {"id": id}
    )

    return {
        "ok": True
    }


# =========================
# EVENTS
# =========================

@api.get("/events")
async def events():

    return await db.events.find(
        {},
        {"_id": 0}
    ).sort(
        "date",
        1
    ).to_list(200)


@api.post("/events")
async def event_add(
    x: Event,
    u=Depends(admin)
):

    d = x.model_dump()

    d.update(
        id=uid(),
        created_at=now()
    )

    await db.events.insert_one(d)

    return d


@api.delete("/events/{id}")
async def event_delete(
    id: str,
    u=Depends(admin)
):

    await db.events.delete_one(
        {"id": id}
    )

    return {
        "ok": True
    }


# =========================
# ANNOUNCEMENTS
# =========================

@api.get("/announcements")
async def announcements():

    return await db.announcements.find(
        {},
        {"_id": 0}
    ).sort(
        [
            ("pinned", -1),
            ("created_at", -1)
        ]
    ).to_list(200)


@api.post("/announcements")
async def ann_add(
    x: Announcement,
    u=Depends(admin)
):

    d = x.model_dump()

    d.update(
        id=uid(),
        created_at=now()
    )

    await db.announcements.insert_one(d)

    return d


@api.delete("/announcements/{id}")
async def ann_delete(
    id: str,
    u=Depends(admin)
):

    await db.announcements.delete_one(
        {"id": id}
    )

    return {
        "ok": True
    }


# =========================
# GALLERY
# =========================

@api.get("/gallery")
async def gallery():

    return await db.gallery.find(
        {},
        {"_id": 0}
    ).sort(
        "created_at",
        -1
    ).to_list(300)


@api.post("/gallery")
async def gallery_add(
    x: Gallery,
    u=Depends(admin)
):

    d = x.model_dump()

    d.update(
        id=uid(),
        created_at=now()
    )

    await db.gallery.insert_one(d)

    return d


@api.delete("/gallery/{id}")
async def gallery_delete(
    id: str,
    u=Depends(admin)
):

    await db.gallery.delete_one(
        {"id": id}
    )

    return {
        "ok": True
    }


# =========================
# CONTACT INFO
# =========================

@api.get("/contact-info")
async def contact_info():

    return await db.settings.find_one(
        {"key": "contact"},
        {
            "_id": 0,
            "key": 0
        }
    ) or {
        "mosque_address":
            "Jama Masjid, Central Avenue, New Delhi - 110006, India",

        "hostel_address":
            "Boys' Hostel, Beside Jama Masjid Complex, New Delhi - 110006",

        "phone":
            "+91 98765 43210",

        "email":
            "info@jamamasjid.org",

        "office_hours":
            "Mon – Sat: 9:00 AM – 6:00 PM",

        "maps_embed":
            "https://www.google.com/maps?q=Jama+Masjid+Delhi&output=embed",

        "facebook":
            "https://facebook.com",

        "instagram":
            "https://instagram.com",

        "twitter":
            "https://x.com",

        "youtube":
            "https://youtube.com"
    }


@api.put("/contact-info")
async def contact_save(
    data: dict,
    u=Depends(admin)
):

    await db.settings.update_one(
        {"key": "contact"},
        {
            "$set": {
                "key": "contact",
                **data
            }
        },
        upsert=True
    )

    data.pop("_id", None)

    return data


# =========================
# CONTACT MESSAGES
# =========================

@api.post("/contact-messages")
async def contact_message(x: Contact):

    d = x.model_dump()

    d.update(
        id=uid(),
        created_at=now()
    )

    await db.messages.insert_one(d)

    return {
        "ok": True
    }


@api.get("/contact-messages")
async def messages(u=Depends(admin)):

    return await db.messages.find(
        {},
        {"_id": 0}
    ).sort(
        "created_at",
        -1
    ).to_list(500)


@api.delete("/contact-messages/{id}")
async def message_delete(
    id: str,
    u=Depends(admin)
):

    await db.messages.delete_one(
        {"id": id}
    )

    return {
        "ok": True
    }


# =========================
# HEALTH CHECK
# =========================

@api.get("/")
async def health():

    return {
        "service":
            "Jama Masjid & Boys' Hostel",
        "status":
            "ok"
    }


# =========================
# REGISTER API
# =========================

app.include_router(api)


# =========================
# STARTUP / SEED
# =========================

@app.on_event("startup")
async def seed():

    # Admin user
    admin_email = os.getenv(
        "ADMIN_EMAIL",
        "admin@example.com"
    ).lower()

    if not await db.users.find_one(
        {"email": admin_email}
    ):
        await db.users.insert_one(
            {
                "id": uid(),
                "email": admin_email,
                "password_hash": hash_password(
                    os.getenv(
                        "ADMIN_PASSWORD",
                        "change-me"
                    )
                ),
                "name": "Administrator",
                "role": "admin"
            }
        )

    # Prayer timings
    if not await db.prayer.find_one({}):
        await db.prayer.insert_one(
            Prayer().model_dump()
        )

    # Gallery defaults
    if await db.gallery.count_documents({}) == 0:

        imgs = [
            (
                "https://images.unsplash.com/photo-1765146030719-2c719d563b61?w=1200",
                "Masjid exterior",
                "Masjid"
            ),
            (
                "https://images.unsplash.com/photo-1606672972031-79e99438f6d4?w=1000",
                "Mosque architecture",
                "Masjid"
            ),
            (
                "https://images.unsplash.com/photo-1776937629858-ce84563640b8?w=1000",
                "Prayer hall",
                "Masjid"
            ),
            (
                "https://images.unsplash.com/photo-1784886330082-a628b99fae8a?w=1000",
                "Hostel room",
                "Hostel"
            ),
            (
                "https://images.unsplash.com/photo-1772944780860-e99bd902d59a?w=1000",
                "Study area",
                "Hostel"
            )
        ]

        await db.gallery.insert_many(
            [
                {
                    "id": uid(),
                    "url": url,
                    "caption": caption,
                    "category": category,
                    "created_at": now()
                }
                for url, caption, category in imgs
            ]
        )