import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0F2E4A] text-white pt-16 pb-12 scroll-mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Logo brand section */}
          <div className="md:col-span-5 space-y-4">
            {/* LOGO PLACEHOLDER: Replace the div/svg below with your logo image/file path if desired.
                Example to swap: <img src="/src/assets/images/logo_light.png" alt="Haven Services" className="h-10 w-auto object-contain" />
            */}
            <a href="#" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-blue/20 rounded-full p-1 inline-flex">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <span className="font-display text-lg tracking-tight text-white block">
                  HAVEN
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-[#D4A433] -mt-1 block">
                  SERVICES
                </span>
              </div>
            </a>
            
            <p className="text-blue-100/70 text-sm max-w-sm leading-relaxed">
              Premium, client-first property care serving residential and commercial spaces across Toronto and neighboring locations.
            </p>

            {/* Slogan near logo placeholder to bookend the page */}
            <div className="pt-2">
              <p className="text-[#D4A433] italic text-xs border-l-2 border-[#D4A433]/70 pl-3 py-0.5">
                Your home is your haven — keep it that way.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4A433]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-blue-100/80">
              <li>
                <a href="#services" className="hover:text-[#D4A433] transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D4A433] transition-colors">
                  Meet the Owners
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#D4A433] transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#D4A433] transition-colors">
                  Portfolio Showcase
                </a>
              </li>
            </ul>
          </div>

          {/* Business contact info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4A433]">
              Direct Contact
            </h4>
            <div className="space-y-3.5 text-sm font-medium text-blue-100/80">
              {/* Phone info card */}
              <a
                href="tel:+14165550150"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <span>(416) 555-0150 (Main Office)</span>
              </a>

              {/* Email info card */}
              <a
                href="mailto:havenservicestoronto@gmail.com"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate">havenservicestoronto@gmail.com</span>
              </a>

              {/* Location info card */}
              <div className="flex items-center gap-3 text-blue-100/80">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Toronto, Ontario & GTA Areas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider and social/copyright strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-blue-100/45">
            &copy; {new Date().getFullYear()} Haven Services. All rights reserved. &bull; Proudly built in Toronto, ON.
          </p>

          <div className="flex items-center gap-4">
            {/* Custom social circles adapted to dark footer */}
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-100/70 hover:text-white hover:bg-brand-blue/30 transition-all text-xs font-semibold">
              In
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-100/70 hover:text-white hover:bg-[#D4A433]/30 transition-all text-xs font-semibold">
              Yp
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-100/70 hover:text-white hover:bg-brand-blue/30 transition-all text-xs font-semibold">
              Fb
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
