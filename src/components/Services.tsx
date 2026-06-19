import { Sun, Sparkles, Droplets, Leaf, ArrowRight, CheckCircle } from "lucide-react";

const SERVICES_DATA = [
  {
    id: "window",
    title: "Window Washing",
    description: "Premium, streak-free window cleaning for interior and exterior glass. We focus on detail—wiping screens, tracks, and frames for a immaculate crystal-clear view that brightens your entire property.",
    pricingResidential: "$149 - $299+ (Residential)",
    pricingCommercial: "Custom Commercial Rates",
    icon: Sun,
    colorClass: "text-brand-blue bg-brand-blue/5 border-brand-blue/10",
  },
  {
    id: "solar",
    title: "Solar Panel Cleaning",
    description: "Boost your green energy efficiency. Over time, dust, pollen, and grime diminish panel performance by up to 25%. Our gentle, professional cleaning technique safely restores peak power output.",
    pricingResidential: "$199 - $399+ (Residential)",
    pricingCommercial: "Custom Commercial Rates",
    icon: Sparkles,
    colorClass: "text-[#D5AF33] bg-[#D5AF33]/10 border-[#D5AF33]/20",
  },
  {
    id: "gutter",
    title: "Gutter Cleaning",
    description: "Defend your foundation and roof from water damage. We remove all leaves, dirt, and clogs, and flush downspouts to guarantee seamless water flow. Safe, fully hand-cleaned, and debris-free.",
    pricingResidential: "$99 - $299+ (Residential)",
    pricingCommercial: "Custom Commercial Rates",
    icon: Droplets,
    colorClass: "text-brand-blue bg-brand-blue/5 border-brand-blue/10",
  },
  {
    id: "lawn",
    title: "Lawn Care",
    description: "From precise mowing and professional edgings to cleanup services. We keep your grass healthy, neat, and beautifully shaped to maximize curb appeal throughout the growing seasons.",
    pricingResidential: "$29 - $129+ / Visit (Residential)",
    pricingCommercial: "Custom Commercial Rates",
    icon: Leaf,
    colorClass: "text-[#D5AF33] bg-[#D5AF33]/10 border-[#D5AF33]/20",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#E8F1F9] scroll-mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#196BAB]/10 border border-[#196BAB]/20 text-[#196BAB] font-display text-[10px] uppercase tracking-widest rounded-full mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#196BAB] rounded-full animate-pulse" />
            <span>Serving Residential & Commercial</span>
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-[#D4A433] block mb-3">
            What We Do Best
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-gray-950 mb-4 tracking-tight leading-tight">
            Professional Services
          </h2>
          <div className="w-16 h-1.5 bg-[#196BAB] rounded-full mx-auto mb-6" />
          <p className="text-gray-600 font-medium text-sm sm:text-base leading-relaxed">
            We deliver pristine property cleaning and care for both residential and commercial structures in Toronto and neighboring suburbs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {SERVICES_DATA.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`group relative bg-white p-8 rounded-3xl border-2 ${
                  service.id === "window" || service.id === "gutter"
                    ? "border-[#196BAB]/40 hover:border-[#196BAB]/75"
                    : "border-[#D4A433]/40 hover:border-[#D4A433]/75"
                } shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
              >
                {/* Commercial Badge floating on top right */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-gray-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                  <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Res & Comm</span>
                </div>

                <div>
                  {/* Icon Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-105 ${service.colorClass}`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-lg text-gray-950 group-hover:text-brand-blue transition-colors duration-200 pr-16 leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                    {service.description}
                  </p>
                </div>

                {/* Pricing Block */}
                <div className="pt-6 border-t border-slate-100/80 flex flex-col gap-2 mt-auto">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    ESTIMATED PRICING
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-brand-blue">
                        {service.pricingResidential}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md mt-1 self-start">
                        {service.pricingCommercial}
                      </span>
                    </div>
                    <a
                      href="#quote"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-brand-blue transition-colors mt-2 sm:mt-0"
                    >
                      <span>Book Online</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
