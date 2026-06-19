import { Mail, Phone, ExternalLink } from "lucide-react";

export default function AboutOwners() {
  return (
    <section id="about" className="py-24 bg-[#FCFAF2] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold-dark block mb-3">
            The Faces Behind Haven
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-gray-950 mb-4 tracking-tight leading-tight">
            Meet the Owners
          </h2>
          <div className="w-16 h-1.5 bg-[#D5AF33] rounded-full mx-auto mb-6" />
          <p className="text-gray-600 font-medium">
            At Haven Services, we believe that great service is personal. Co-owners Perseus Tecson and Shepherd Burke are committed to providing top-quality property care, right here in Toronto.
          </p>
        </div>

        {/* Owners Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* OWNER 1: PERSEUS */}
          <div className="bg-white p-8 rounded-3xl border-2 border-[#196BAB]/40 hover:border-[#196BAB]/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Photo Placeholder - Centered Circular Avatar with White Bold Initials */}
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full border-2 border-[#196BAB]/30 bg-[#1B75BB] flex items-center justify-center shadow-inner hover:scale-105 transition-all duration-300">
                <span className="font-display text-4xl font-extrabold text-white tracking-widest select-none">
                  PT
                </span>
                {/* Initials Badge */}
                <div className="absolute bottom-2 right-2 bg-white text-[#196BAB] text-xs font-black px-2.5 py-1 rounded-full shadow-sm border border-[#196BAB]/20">
                  PT
                </div>
              </div>

              {/* Title & Name */}
              <div className="text-center mb-6">
                <h3 className="font-display text-lg text-gray-950 mb-1">
                  Perseus Tecson
                </h3>
                <span className="inline-block px-3 py-1 bg-brand-blue/5 text-[#1a6bab] text-xs font-bold rounded-full">
                  Co-Owner
                </span>
              </div>

              {/* Bio block */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center mb-8">
                Perseus manages our field operations, quality standards, and technical care systems. Obsessed with streak-free clarity and immaculate panel prep, he personally leads our window washing and solar panel teams. Perseus ensures every home receives premium, detail-oriented results we can stand behind.
              </p>
            </div>

            {/* Individual Contact Details */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <a
                href="tel:+16474911624"
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-brand-blue/5 text-gray-700 hover:text-brand-blue rounded-xl transition-all duration-200 text-sm font-semibold group border border-slate-100/50"
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-100 flex items-center justify-center text-brand-blue">
                  <Phone className="w-4 h-4" />
                </div>
                <span>647-491-1624</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue" />
              </a>

              <a
                href="mailto:perseus@havenservices.ca"
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-brand-blue/5 text-gray-700 hover:text-brand-blue rounded-xl transition-all duration-200 text-sm font-semibold group border border-slate-100/50"
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-100 flex items-center justify-center text-brand-blue">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate">perseus@havenservices.ca</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue" />
              </a>
            </div>
          </div>

          {/* OWNER 2: SHEPHERD */}
          <div className="bg-white p-8 rounded-3xl border-2 border-[#D4A433]/45 hover:border-[#D4A433]/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Photo Placeholder - Centered Circular Avatar with White Bold Initials */}
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full border-2 border-[#D4A433]/30 bg-[#D4A433] flex items-center justify-center shadow-inner hover:scale-105 transition-all duration-300">
                <span className="font-display text-4xl font-extrabold text-white tracking-widest select-none">
                  SB
                </span>
                {/* Initials Badge */}
                <div className="absolute bottom-2 right-2 bg-white text-[#D4A433] text-xs font-black px-2.5 py-1 rounded-full shadow-sm border border-[#D4A433]/20">
                  SB
                </div>
              </div>

              {/* Title & Name */}
              <div className="text-center mb-6">
                <h3 className="font-display text-lg text-gray-950 mb-1">
                  Shepherd Burke
                </h3>
                <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold-dark text-xs font-bold rounded-full">
                  Co-Owner
                </span>
              </div>

              {/* Bio block */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center mb-8">
                Shepherd coordinates customer care, residential schedules, and turf manicures. Dedicated to precision clipping, lush green yards, and impeccable cleanup, he hand-styles our lawn and gutter service lines. Shepherd's proactive follow-up policy is the backbone of our commitment to trust and transparency.
              </p>
            </div>

            {/* Individual Contact Details */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <a
                href="tel:+16476165707"
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-[#D5AF33]/5 text-gray-700 hover:text-[#D4A433] rounded-xl transition-all duration-200 text-sm font-semibold group border border-slate-100/50"
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-100 flex items-center justify-center text-[#D4A433]">
                  <Phone className="w-4 h-4" />
                </div>
                <span>647-616-5707</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#D4A433]" />
              </a>

              <a
                href="mailto:shepherd@havenservices.ca"
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-[#D5AF33]/5 text-gray-700 hover:text-brand-gold-dark rounded-xl transition-all duration-200 text-sm font-semibold group border border-slate-100/50"
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-100 flex items-center justify-center text-[#D4A433]">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate">shepherd@havenservices.ca</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#D4A433]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
