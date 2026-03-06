import { Globe, Zap, Users, Code } from "lucide-react";

export function FeatureCards() {
  const features = [
    {
      number: "01",
      title: "Forever Free",
      description: "Zero cost. Zero strings. Just claim your subdomain and it's yours. No subscriptions, no upsells.",
      icon: Globe,
      bg: "#FFD23F"
    },
    {
      number: "02",
      title: "Full DNS Control",
      description: "Point to anywhere. A records, CNAME records, TXT records. Your subdomain, your rules.",
      icon: Code,
      bg: "#FF6B35"
    },
    {
      number: "03",
      title: "Growing Community",
      description: "Join a community of builders, makers, and creators. The perfect home for your personal projects.",
      icon: Users,
      bg: "#2D5016"
    },
    {
      number: "04",
      title: "Instant Setup",
      description: "Login with GitHub. Pick a name. Done in 30 seconds. No verification emails. No waiting.",
      icon: Zap,
      bg: "#FFD23F"
    }
  ];

  return (
    <section className="w-full pt-8 md:pt-16 pb-12 md:pb-24 bg-[#FFF8F0] relative">
      <div className="w-full px-6 md:px-12 lg:px-16 mb-16">

        <div className="mb-16 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A]">
            The price of admission<br />
            <span className="text-[#FF6B35]">is zero.</span>
          </h2>

          <div className="max-w-3xl space-y-4 text-base md:text-lg text-[#6B6B6B] leading-relaxed">
            <p>
              For too long, gatekeepers have put a price tag on your identity. We believe your first
              idea, your tenth side project, and your portfolio deserve a home, not a monthly bill.
            </p>
            <p>
              <span className="font-bold text-[#1A1A1A]">Indevs</span> is our contribution to the chaotic, beautiful mess that is the open web.
              Claim your <span className="font-bold text-[#1A1A1A]">*.indevs.in</span> domain. Point it at Vercel, Netlify, or that
              Raspberry Pi in your closet. No strings attached. Just pure DNS freedom.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`
                bg-white border-4 border-[#1A1A1A] rounded-xl p-6 h-full
                hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                transition-all duration-150 flex flex-col justify-between
              `}
              style={{
                boxShadow: `8px 8px 0px 0px ${feature.bg}`
              }}
            >
              <div>
                <div className="flex items-start justify-between mb-8">
                  <span className="text-4xl lg:text-5xl font-bold text-[#E5E3DF]">
                    {feature.number}
                  </span>
                  <div
                    className="w-14 h-14 flex items-center justify-center border-2 border-[#1A1A1A] rounded-lg"
                    style={{ backgroundColor: feature.bg }}
                  >
                    <feature.icon className="w-7 h-7 text-[#1A1A1A]" />
                  </div>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#6B6B6B] text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
