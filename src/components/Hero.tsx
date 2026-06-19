import { ArrowRight, Sparkles, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-radial from-slate-50 via-white to-slate-50/50">
      {/* Soft atmospheric background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/10 left-10 w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Hero text panel */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-gold/10 hover:bg-brand-gold/15 transition-colors duration-200 rounded-full text-brand-gold-dark font-medium text-xs mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Toronto & Greater Area Property Care</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-gray-950 tracking-tight leading-[1.1] mb-6">
              Pristine spaces, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-blue-dark to-brand-gold">
                expert care.
              </span>
            </h1>

            <p className="text-gray-600 text-lg sm:text-xl pl-0 font-normal leading-relaxed max-w-xl mb-4">
              At Haven Services, we elevate and protect your property with top-tier window washing, solar panel prep, gutter cleaning, and lawn maintenance throughout Toronto.
            </p>

            <div className="font-sans text-[#D4A433] font-medium text-base sm:text-lg mb-4 italic flex items-center gap-2">
              <span className="w-5 h-[2px] bg-[#D4A433]/50 rounded" />
              <span>Your home is your haven — keep it that way.</span>
            </div>

            {/* SERVICE AREA HIGHLIGHT: Highly visible badge emphasizing the serving areas */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-emerald-500/30 text-emerald-800 rounded-2xl shadow-xs font-bold text-xs sm:text-sm tracking-wide mb-8">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping" />
              <span>📍 Proudly Serving Toronto & Surrounding Areas</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href="#quote"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 text-gray-800 font-semibold rounded-full border border-slate-100 shadow-xs hover:shadow transition-all duration-300"
              >
                Our Services
              </a>
            </div>

            {/* Micro value badges */}
            <div className="mt-12 grid grid-cols-2 sm:flex sm:items-center gap-x-8 gap-y-3 pt-8 border-t border-slate-100 w-full">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-brand-blue/10 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-brand-blue" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Residential</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-brand-blue/10 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-brand-blue" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Commercial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-brand-blue/10 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-brand-blue" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Owner-Operated</span>
              </div>
            </div>
          </div>

          {/* Hero Visual side with soft rounded corners */}
          <div className="md:col-span-5 relative">
            <div className="relative mx-auto max-w-sm md:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-blue/5 to-brand-gold/10 rounded-3xl blur-xl" />
              
              {/* Main image card placeholder */}
              <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between overflow-hidden aspect-[4/5] sm:aspect-square md:aspect-[4/5]">
                <div className="absolute inset-0 bg-radial from-transparent to-slate-50/30" />
                
                {/* HERO IMAGE PLACEHOLDER: Replace the div below with your logo or hero image file path here.
                    Example of what to insert:
                    <img 
                      src="https://i.postimg.cc/7hQknkLv/havenb4dwbg.png" 
                      alt="Haven Services Logo"
                      className="w-full h-full object-contain rounded-2xl" 
                    />
                */}
                <img 
  src="https://i.postimg.cc/7hQknkLv/havenb4dwbg.png" 
  alt="Haven Services Logo"
  className="w-full h-full object-contain rounded-3xl" 
/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
