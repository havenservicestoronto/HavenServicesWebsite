import { ShieldCheck, Award, Clock, Star } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      title: "Owner-Operated Care",
      desc: "Every project is directly managed and executed by Perseus and Shepherd, ensuring our meticulous standards are upheld on every corner.",
      icon: ShieldCheck,
      bg: "bg-brand-blue/5 text-brand-blue border-brand-blue/10",
    },
    {
      title: "Meticulous Attention to Detail",
      desc: "We don't rush. We take the time necessary to wash every pane, clear matching gutter lines, and groom lawn edges to perfection.",
      icon: Award,
      bg: "bg-[#D5AF33]/10 text-brand-gold-dark border-[#D5AF33]/20",
    },
    {
      title: "Meticulous & Reliable Scheduling",
      desc: "Your time is valuable. We arrive at your preferred appointments on time, keep you updated, and communicate clearly from beginning to end.",
      icon: Clock,
      bg: "bg-brand-blue/5 text-brand-blue border-brand-blue/10",
    },
    {
      title: "Satisfaction-Focused Service",
      desc: "If any aspect of our service does not meet your expectations, let us know and we will return immediately to make it right.",
      icon: Star,
      bg: "bg-[#D5AF33]/10 text-brand-gold-dark border-[#D5AF33]/20",
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-[#FAF6EC] scroll-mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#196BAB] block mb-3">
            Why Choose Haven
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-gray-950 mb-4 tracking-tight leading-tight">
            Our Quality Standards
          </h2>
          <div className="w-16 h-1.5 bg-[#196BAB] rounded-full mx-auto mb-6" />
          <p className="text-gray-600 font-medium">
            We are dedicated to building a reputation of trust, transparency, and outstanding property care in our local communities.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className={`flex flex-col sm:flex-row gap-5 p-7 bg-white border-2 ${
                  index % 2 === 0
                    ? "border-[#196BAB]/40 hover:border-[#196BAB]/75"
                    : "border-[#D4A433]/40 hover:border-[#D4A433]/75"
                } rounded-3xl hover:shadow-md transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${point.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base text-gray-950 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-sans">
                    {point.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust summary band */}
        <div className="mt-16 bg-white border-2 border-[#D4A433]/40 hover:border-[#D4A433]/65 p-8 rounded-3xl text-center max-w-3xl mx-auto shadow-xs transition-all duration-300">
          <p className="text-gray-700 italic text-sm sm:text-base font-normal leading-relaxed">
            "We treat your property with the same care and consideration we would give our own. As a local business launched by two long-time partners, our goals are simple: clear communication, impeccable craftsmanship, and guaranteed results."
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-gray-900 tracking-wider uppercase select-none">
            <span>Perseus Tecson</span>
            <span className="w-1.5 h-1.5 bg-[#D4A433] rounded-full" />
            <span>Shepherd Burke</span>
          </div>
        </div>
      </div>
    </section>
  );
}
