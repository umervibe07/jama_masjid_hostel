import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {api} from '@/lib/api';
import {MapPin,Phone,Mail,Moon} from 'lucide-react';

export default function Footer(){
  const[pt,setPt]=useState(),[ci,setCi]=useState();

  useEffect(()=>{
    api.get('/prayer-timings').then(r=>setPt(r.data));
    api.get('/contact-info').then(r=>setCi(r.data));
  },[]);

  return <footer className="bg-[#0D3B2E] text-white/85 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-3">

      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center">
            <Moon className="text-[#0D3B2E]"/>
          </div>
          <div className="font-heading text-xl">Jama Masjid</div>
        </div>
        <p className="text-sm text-white/65 leading-relaxed mt-4">
          A place of worship, learning, community and dignified student accommodation.
        </p>
      </div>

      <div>
        <h4 className="font-heading text-lg text-[#D4AF37] mb-4">Quick Links</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['/about','About'],
            ['/prayer-timings','Prayer Timings'],
            ['/hostel','Hostel'],
            ['/admission','Admission'],
            ['/rules','Rules'],
            ['/facilities','Facilities'],
            ['/gallery','Gallery'],
            ['/events','Events'],
            ['/contact','Contact']
          ].map(x=>
            <Link key={x[0]} to={x[0]} className="hover:text-[#D4AF37]">
              {x[1]}
            </Link>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-heading text-lg text-[#D4AF37] mb-4">
          Contact & Prayer
        </h4>

        {ci&&
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <MapPin className="w-4 shrink-0 text-[#C5A059]"/>
              {ci.mosque_address}
            </div>

            <div className="flex gap-2">
              <Phone className="w-4 text-[#C5A059]"/>
              {ci.phone}
            </div>

            <div className="flex gap-2">
              <Mail className="w-4 text-[#C5A059]"/>
              {ci.email}
            </div>
          </div>
        }

        {pt&&
          <div className="mt-4 text-xs grid grid-cols-3 gap-2">
            {[
              ['fajr','Fajr'],
              ['dhuhr','Dhuhr'],
              ['asr','Asr'],
              ['maghrib','Maghrib'],
              ['isha','Isha'],
              ['jumuah','Jumuah']
            ].map(x=>
              <div key={x[0]} className="border border-white/10 rounded p-2">
                <div className="text-[#C5A059]">{x[1]}</div>
                <div>{pt[x[0]]}</div>
              </div>
            )}
          </div>
        }
      </div>

    </div>

    <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
      <div>
        © {new Date().getFullYear()} Jama Masjid & Boys' Hostel. All Rights Reserved.
      </div>
      <div className="mt-1">
        Designed & Developed by Umer Shaikh
      </div>
    </div>

  </footer>
}