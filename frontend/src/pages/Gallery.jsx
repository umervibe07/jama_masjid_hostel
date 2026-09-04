import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Hero } from "./About";

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const res = await api.get("/gallery");
      setGallery(res.data || []);
    } catch (error) {
      console.error("Gallery loading failed:", error);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(
      gallery
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  const filteredGallery =
    category === "All"
      ? gallery
      : gallery.filter(
          (item) => item.category === category
        );

  return (
    <div>
      <Hero
        title="Gallery"
        subtitle="A glimpse of Jama Masjid & Boys' Hostel"
      />

      <section className="py-16 bg-[#FAFAF9] islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">

          {/* CATEGORY FILTERS */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  category === item
                    ? "bg-[#0D3B2E] text-white"
                    : "bg-white border border-[#C5A059]/30 text-[#0D3B2E] hover:bg-[#C5A059]/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-16 text-slate-500">
              Loading gallery...
            </div>
          )}

          {/* PHOTOS */}
          {!loading && filteredGallery.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  className="card-elegant overflow-hidden bg-white"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.url}
                      alt={
                        item.caption ||
                        "Jama Masjid gallery"
                      }
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-heading text-lg text-[#0D3B2E]">
                      {item.caption || "Jama Masjid"}
                    </h3>

                    {item.category && (
                      <p className="text-xs text-[#C5A059] mt-1 uppercase">
                        {item.category}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredGallery.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon className="w-12 h-12 mx-auto text-[#C5A059] mb-4" />

              <h2 className="font-heading text-2xl text-[#0D3B2E]">
                No Photos Yet
              </h2>

              <p className="text-slate-500 mt-2">
                Gallery photos will appear here.
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}