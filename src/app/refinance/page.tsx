import { Metadata } from "next";
import RefinanceCalculator from "@/components/RefinanceCalculator";

export const metadata: Metadata = {
  title: "Refinance Calculator — Compare Savings, Break-Even Point & Monthly Payment",
  description:
    "Calculate your refinance savings including monthly payment reduction, break-even point, and total interest savings. Compare your current mortgage against new terms instantly.",
  alternates: {
    canonical: "https://lendingcalculator.net/refinance",
  },
  openGraph: {
    title: "Mortgage Refinance Calculator",
    description:
      "Calculate your refinance savings including monthly payment reduction, break-even point, and total interest savings.",
    type: "website",
    url: "https://lendingcalculator.net/refinance",
    siteName: "Lending Calculator",
  },
};

export default function RefinancePage() {
  const faqs = [
    {
      question: "When does it make sense to refinance a mortgage?",
      answer:
        "Refinancing typically makes sense when you can lower your interest rate by at least 0.5-1%, you plan to stay in the home long enough to pass the break-even point, and your credit score qualifies you for better terms. The break-even point is when your monthly savings exceed the closing costs you paid.",
    },
    {
      question: "What is the break-even point on a refinance?",
      answer:
        "The break-even point is the number of months it takes for your monthly savings to equal the closing costs of the refinance. For example, if closing costs are $6,000 and you save $200/month, your break-even is 30 months. If you plan to stay in the home past that point, refinancing saves you money.",
    },
    {
      question: "How much does it cost to refinance a mortgage?",
      answer:
        "Refinance closing costs typically range from 2% to 5% of the loan amount. On a $280,000 loan, that is $5,600 to $14,000. Costs include appraisal fees, title insurance, origination fees, and other lender charges. Some lenders offer no-closing-cost refinances but compensate with a slightly higher rate.",
    },
    {
      question: "Should I refinance into a shorter term or keep 30 years?",
      answer:
        "Refinancing into a shorter term (like 15 years) means higher monthly payments but dramatically less total interest. Keeping a 30-year term maximizes monthly cash flow but costs more over the life of the loan. The right choice depends on your budget and financial goals.",
    },
  ];

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Refinance Calculator",
    description: "Calculate your refinance savings including monthly payment reduction, break-even point, and total interest savings. Compare your current mortgage against new terms instantly.",
    url: "https://lendingcalculator.net/refinance",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Mortgage Refinance Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Compare your current mortgage against refinance terms. See your monthly
            savings, break-even point, and total interest savings to decide if
            refinancing is worth it.
          </p>
        </div>

        <RefinanceCalculator />
      </div>

      {/* Educational Content */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How Mortgage Refinancing Works</h2>
        <p className="text-gray-600 mb-4">
          Refinancing replaces your existing mortgage with a new loan, typically at a lower interest
          rate. You pay closing costs upfront, but the reduced monthly payment saves money over time.
          The key question is whether you will stay in the home long enough for those savings to
          exceed the upfront costs.
        </p>
        <p className="text-gray-600 mb-4">
          There are several reasons homeowners refinance: to get a lower interest rate, to switch from
          an adjustable-rate to a fixed-rate mortgage, to shorten the loan term, or to cash out equity
          for home improvements or debt consolidation.
        </p>
        <p className="text-gray-600 mb-8">
          The calculator above focuses on rate-and-term refinancing — the most common type. It compares
          your current remaining payments against the new loan terms, accounting for closing costs, to
          show you the true financial impact.
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
              { "@type": "ListItem", position: 2, name: "Refinance Calculator", item: "https://lendingcalculator.net/refinance" },
            ],
          }),
        }}
      />
    </>
  );
}
