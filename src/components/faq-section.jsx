import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is this actually free?",
      answer: "Yes. Forever. No credit card, no trial period, no premium tier. We built this because we wanted it to exist, not to make money from it."
    },
    {
      question: "How long can I keep my subdomain?",
      answer: "Domains are valid for 1 year and can be renewed for free within 60 days of expiry (plus a 15-day grace period). We'll send reminder emails 60 and 10 days before it expires."
    },
    {
      question: "Can I use this for commercial projects?",
      answer: "Absolutely. Use it for your portfolio, startup, or side project. As long as it complies with our Acceptable Use Policy, it's yours."
    },
    {
      question: "What if my desired name is taken?",
      answer: "Try a variation. Add your last name, a number, or get creative. First-come, first-served – that's the rule."
    },
    {
      question: "Can I transfer my subdomain to someone else?",
      answer: "Not yet. Right now, once you claim it, it's tied to your Stackryze account. We might add transfers later if people want it."
    },
    {
      question: "Can I point my subdomain to a custom DNS provider?",
      answer: "Yes. Every domain supports custom NS delegation to Stackryze DNS (dns.stackryze.com) or external providers like Cloudflare and Route53, giving you full control over A, AAAA, CNAME, MX, and TXT records."
    }
  ];

  return (
    <section className="w-full py-10 md:py-16 bg-white relative">
      <div className="max-w-3xl mx-auto px-6 w-full">

        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border-b border-slate-200 dark:border-[#27272a]/80 last:border-b-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-signal transition-colors duration-300 pr-8">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === idx ? 'bg-signal/10 text-signal' : 'bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:bg-signal/10 group-hover:text-signal'}`}>
                   <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-500 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-500 ease-in-out opacity-0"
                style={{ maxHeight: openIndex === idx ? "200px" : "0px", opacity: openIndex === idx ? 1 : 0 }}
              >
                <div className="pb-6 pr-12">
                  <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA at bottom */}
        <div className="mt-20 text-center">
          <p className="text-base text-slate-500 dark:text-slate-400 mb-6 font-medium">
            Still have questions? We're on GitHub Discussions.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5"
          >
            Get Your Subdomain
          </a>
        </div>
      </div>
    </section>
  );
}
