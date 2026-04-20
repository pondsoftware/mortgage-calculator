import { Metadata } from "next";
import RentVsBuyCalculator from "@/components/RentVsBuyCalculator";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator — Compare the True Cost of Renting vs Buying",
  description:
    "Compare the total cost of renting versus buying a home over time. See the crossover point where buying becomes cheaper, including appreciation, taxes, maintenance, and equity.",
  alternates: {
    canonical: "https://lendingcalculator.net/rent-vs-buy",
  },
  openGraph: {
    title: "Rent vs Buy Calculator",
    description:
      "Compare the total cost of renting versus buying a home over time. See the crossover point where buying becomes cheaper.",
    type: "website",
    url: "https://lendingcalculator.net/rent-vs-buy",
    siteName: "Lending Calculator",
  },
};

export default function RentVsBuyPage() {
  const faqs = [
    {
      question: "Is it cheaper to rent or buy a home?",
      answer:
        "It depends on how long you stay, local market conditions, and your financial situation. In the short term (1-3 years), renting is almost always cheaper because buying has large upfront costs (down payment, closing costs). Over longer periods (7+ years), buying typically wins because you build equity and your mortgage payment stays fixed while rent increases annually.",
    },
    {
      question: "How long do I need to stay for buying to make sense?",
      answer:
        "The typical break-even point is 3-7 years, depending on your market. Factors that shorten this timeline include high rent growth, strong home appreciation, and low interest rates. Factors that extend it include high property taxes, expensive maintenance, and slow appreciation.",
    },
    {
      question: "What costs does this calculator include for buying?",
      answer:
        "The buy side includes: mortgage principal and interest, property taxes, homeowners insurance, and maintenance costs. It also accounts for home appreciation and equity buildup. The net cost of buying is calculated as total costs minus the equity you've built, giving a fair comparison against rent which builds no equity.",
    },
    {
      question: "What is the opportunity cost of a down payment?",
      answer:
        "Your down payment could be invested elsewhere (stocks, bonds) earning returns. If you put $70,000 down and the stock market returns 8% annually, that is $5,600/year in foregone returns. However, home appreciation and forced savings through mortgage payments often offset this opportunity cost over longer time horizons.",
    },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Rent vs Buy Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Compare the true cost of renting versus buying over time. This calculator
            accounts for rent increases, home appreciation, taxes, insurance, and
            maintenance to show you when buying becomes the better financial decision.
          </p>
        </div>

        <RentVsBuyCalculator />
      </div>

      {/* Educational Content */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rent vs Buy: A Complete Financial Comparison</h2>
        <p className="text-gray-600 mb-4">
          The rent vs buy decision is one of the biggest financial choices you will make. On the
          surface, comparing a monthly rent payment to a mortgage payment seems simple. But the
          true comparison involves many hidden costs and benefits on both sides.
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Renting</strong> has no maintenance costs, no property taxes, no down payment
          requirement, and maximum flexibility. However, rent typically increases 3-5% per year,
          you build no equity, and you are subject to landlord decisions.
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Buying</strong> involves large upfront costs, ongoing maintenance (typically 1%
          of home value per year), property taxes, and insurance. However, you build equity with
          every payment, your mortgage is fixed (while rent rises), and your home likely appreciates
          over time.
        </p>
        <p className="text-gray-600 mb-8">
          This calculator compares the net cost of each option year by year. For buying, it
          subtracts your accumulated equity from total costs to find your true net cost. The
          crossover point is when buying&apos;s net cost drops below cumulative rent payments.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://lendingcalculator.net" },
              { "@type": "ListItem", position: 2, name: "Rent vs Buy Calculator", item: "https://lendingcalculator.net/rent-vs-buy" },
            ],
          }),
        }}
      />
    </>
  );
}
