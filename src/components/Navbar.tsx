import { useState, useEffect } from "react";
import { Phone, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO PLACEHOLDER: Replace the div/svg below with your logo image/file path if desired. 
            Example to swap: <img src="https://i.postimg.cc/7hQknkLv/havenb4dwbg.png" className="h-10 w-auto object-contain" />
        */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-blue/20 rounded-full p-1">
          <img 
  src="https://i.postimg.cc/7hQknkLv/havenb4dwbg.png" 
  alt="Haven Services Logo"
  className="h-10 w-auto object-contain rounded 2x1" 
/>
          <div>
            <span className="font-display text-lg tracking-tight text-gray-950 block">
              HAVEN
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-[#D4A433] -mt-1 block">
              SERVICES
            </span>
          </div>
        </a>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className="text-gray-600 hover:text-brand-blue font-medium text-sm transition-colors duration-200"
          >
            Services
          </a>
          <a
            href="#about"
            className="text-gray-600 hover:text-brand-blue font-medium text-sm transition-colors duration-200"
          >
            About Owners
          </a>
          <a
            href="#why-us"
            className="text-gray-600 hover:text-brand-blue font-medium text-sm transition-colors duration-200"
          >
            Why Choose Us
          </a>
          <a
            href="#portfolio"
            className="text-gray-600 hover:text-brand-blue font-medium text-sm transition-colors duration-200"
          >
            Portfolio
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-brand-blue font-medium text-sm transition-colors duration-200"
          >
            Contact
          </a>
        </div>

        {/* STICKY/VISIBLE CLICK-TO-CALL & CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+14165550150"
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-brand-blue/5 text-brand-blue font-semibold text-sm transition-all duration-200 rounded-full border border-slate-100"
          >
            <Phone className="w-4 h-4 fill-brand-blue/10" />
            <span>(416) 555-0150</span>
          </a>
          <a
            href="#quote"
            className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm transition-all duration-300 rounded-full shadow-sm hover:shadow active:scale-98"
          >
            Get a Free Quote
          </a>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="flex md:hidden items-center gap-3">
          <a
            href="tel:+14165550150"
            className="flex items-center justify-center w-10 h-10 bg-brand-blue/5 text-brand-blue rounded-full border border-brand-blue/10"
            aria-label="Call Business"
          >
            <Phone className="w-4 h-4 text-brand-blue" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-700 hover:text-brand-blue focus:outline-none rounded-full"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-6 px-6 shadow-lg flex flex-col gap-4 animate-fadeIn">
          <a
            href="#services"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-brand-blue py-2 text-base font-semibold"
          >
            Services
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-brand-blue py-2 text-base font-semibold"
          >
            About Owners
          </a>
          <a
            href="#why-us"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-brand-blue py-2 text-base font-semibold"
          >
            Why Choose Us
          </a>
          <a
            href="#portfolio"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-brand-blue py-2 text-base font-semibold"
          >
            Portfolio
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-brand-blue py-2 text-base font-semibold"
          >
            Contact
          </a>

          <hr className="border-slate-100 my-2" />

          <a
            href="tel:+14165550150"
            className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-brand-blue rounded-full border border-slate-100 font-semibold"
          >
            <Phone className="w-4 h-4 fill-brand-blue/5" />
            <span>(416) 555-0150</span>
          </a>

          <a
            href="#quote"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center py-3 bg-brand-blue text-white rounded-full font-semibold shadow-md"
          >
            Get a Free Quote
          </a>
        </div>
      )}
    </nav>
  );
}
