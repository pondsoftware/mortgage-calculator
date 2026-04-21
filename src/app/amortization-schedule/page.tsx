import { Metadata } from "next";
import AmortizationScheduleCalculator from "@/components/AmortizationScheduleCalculator";

export const metadata: Metadata = {
  title: "Amortization Schedule Calculator — Full Month-by-Month Breakdown",
  description:
    "Generate a complete amortization schedule showing monthly principal, interest, and remaining balance for any mortgage. See exactly how your loan is paid off over time.",
  alternates: {
    canonical: "https://lendingcalculator.net/amortization-schedule",
  },
  openGraph: {
    title: "Amortization Schedule Calculator",
    description:
      "Generate a complete amortization schedule showing monthly principal, interest, and remaining balance for any mortgage.",
    type: "website",
    url: "https://lendingcalculator.net/amortization-schedule",
    siteName: "Lending Calculator",
  },
};

export default function AmortizationSchedulePage() {
  const faqs = [
    {
      question: "What is an amortization schedule?",
      answer:
        "An amortization schedule is a complete table showing every payment over the life of a loan. Each row shows how much of that month's payment goes toward principal (reducing your balance) versus interest (the lender's profit). Early in the loan, most of your payment is interest. Over time, the split shifts and more goes toward principal.",
    },
    {
      question: "Why do I pay more interest at the beginning of my mortgage?",
      answer:
        "Interest is calculated on the outstanding balance. Since the balance is highest at the start, interest charges are largest in the early years. As you pay down the principal, less interest accrues each month and more of your fixed payment goes toward reducing the balance.",
    },
    {
      question: "How can I use an amortization schedule to save money?",
      answer:
        "By reviewing your schedule, you can see exactly how much interest you'll pay over the life of the loan. This helps you evaluate whether making extra payments, refinancing, or choosing a shorter term would save significant money. Even small extra payments early in the loan have an outsized impact because they reduce the balance that accrues interest for years to come.",
    },
    {
      question: "What is the difference between amortization and simple interest?",
      answer:
        "With amortization, your monthly payment stays the same but the split between principal and interest changes each month. Simple interest charges the same interest amount each period regardless of how much principal you've paid. Mortgages use amortization so the loan is guaranteed to be paid off by the end of the term.",
    },
  ];

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Amortization Schedule Calculator",
    description: "Generate a complete amortization schedule showing monthly principal, interest, and remaining balance for any mortgage. See exactly how your loan is paid off over time.",
    url: "https://lendingcalculator.net/amortization-schedule",
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
            Amortization Schedule Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Generate a complete month-by-month or year-by-year amortization schedule.
            See exactly how each payment is split between principal and interest, and
            track your remaining balance over the life of the loan.
          </p>
        </div>

        <AmortizationScheduleCalculator />
      </div>

      {/* Educational Content */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your Amortization Schedule</h2>
        <p className="text-gray-600 mb-4">
          An amortization schedule breaks down every payment you will make over the life of your
          mortgage. For a 30-year loan, that means 360 individual payments — each one allocated
          differently between principal and interest.
        </p>
        <p className="text-gray-600 mb-4">
          In the first year of a $300,000 mortgage at 6.5%, approximately 65% of each payment goes
          toward interest and only 35% toward reducing your balance. By year 20, the ratio flips
          and most of each payment goes toward building your equity.
        </p>
        <p className="text-gray-600 mb-8">
          Understanding this schedule helps you make informed decisions about extra payments,
          refinancing timing, and the true cost of your loan. Use the yearly view for a quick
          overview, or switch to monthly for the complete picture.
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
              { "@type": "ListItem", position: 2, name: "Amortization Schedule", item: "https://lendingcalculator.net/amortization-schedule" },
            ],
          }),
        }}
      />
    </>
  );
}
