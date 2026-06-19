import { Eye } from "lucide-react";

export default function Portfolio() {
  const projects = [
    {
      title: "Crystal Clear Glass Care",
      service: "Window Washing",
      desc: "Double-story residential window wash utilizing fine-detail professional equipment.",
      image: "/src/assets/images/window_wash_ba_1781896578808.jpg",
      borderColor: "border-[#196BAB]/40 hover:border-[#196BAB]/75 font-sans"
    },
    {
      title: "Clean Solar Panel Array",
      service: "Solar Panel cleaning",
      desc: "High-power rooftop eco cleaning restoring raw energy efficiency.",
      image: "/src/assets/images/solar_clean_ba_1781896612698.jpg",
      borderColor: "border-[#D4A433]/45 hover:border-[#D4A433]/75 font-sans"
    },
    {
      title: "Gutter Clear Flush",
      service: "Gutter Cleaning",
      desc: "Comprehensive perimeter gutter clean with full downspout flow test.",
      image: "/src/assets/images/gutter_clean_ba_1781896602187.jpg",
      borderColor: "border-[#196BAB]/40 hover:border-[#196BAB]/75 font-sans"
    },
    {
      title: "Manicured Turf Striping",
      service: "Lawn Care",
      desc: "Symmetric green stripe trimming & neat hardscape border edgings.",
      image: "/src/assets/images/lawn_care_ba_1781896591369.jpg",
      borderColor: "border-[#D4A433]/45 hover:border-[#D4A433]/75 font-sans"
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-[#E8EFF5] scroll-mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4A433] block mb-3">
            Our Portfolio
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-gray-950 mb-4 tracking-tight leading-tight">
            Showcase Gallery
          </h2>
          <div className="w-16 h-1.5 bg-[#D4A433] rounded-full mx-auto mb-6" />
          <p className="text-gray-600 font-medium">
            Take a look at the types of projects we represent — showcasing genuine care, precision tools, and striking before & after transformations in Toronto.
          </p>
        </div>

        {/* Portfolio grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((p, index) => (
            <div
              key={index}
              className={`group bg-white p-4 rounded-3xl border-2 ${p.borderColor} shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between`}
            >
              {/* Image box placeholder */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 border-2 border-slate-100 flex items-center justify-center bg-slate-50">
                <img
                  src={p.image}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                {/* Floating zoom indicator */}
                <div className="absolute inset-0 bg-gray-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-brand-blue">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2">
                  {p.service}
                </span>
                <h3 className="font-display text-[13px] text-gray-950 mb-1 line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
