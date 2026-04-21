import { Metadata } from "next";
import ExtraPaymentsCalculator from "@/components/ExtraPaymentsCalculator";

export const metadata: Metadata = {
  title: "Extra Mortgage Payment Calculator — See How Much You Save",
  description:
    "Calculate how extra monthly or annual payments reduce your mortgage term and total interest. See exactly how much time and money you save with additional principal payments.",
  alternates: {
    canonical: "https://lendingcalculator.net/extra-payments",
  },
  openGraph: {
    title: "Extra Mortgage Payment Calculator",
    description:
      "Calculate how extra monthly or annual payments reduce your mortgage term and total interest paid.",
    type: "website",
    url: "https://lendingcalculator.net/extra-payments",
    siteName: "Lending Calculator",
  },
};

export default function ExtraPaymentsPage() {
  const faqs = [
    {
      question: "How do extra mortgage payments work?",
      answer:
        "Extra payments go directly toward reducing your loan principal. Since interest is calculated on the remaining balance, paying down principal faster means less interest accrues each month. This creates a compounding savings effect — every extra dollar you pay saves you multiple dollars in future interest.",
    },
    {
      question: "Is it better to make extra monthly payments or one annual lump sum?",
      answer:
        "Extra monthly payments are slightly more efficient because they reduce the balance sooner, meaning less interest accrues between payments. However, an annual lump sum (from a tax refund or bonus) is still highly effective. The best approach is whichever you can sustain consistently.",
    },
    {
      question: "Should I pay extra on my mortgage or invest the money?",
      answer:
        "If your mortgage rate is below the expected return on investments (historically 7-10% for stocks), investing may yield more over time. However, paying extra on your mortgage is a guaranteed, risk-free return equal to your interest rate. It also provides the psychological benefit of owning your home outright sooner.",
    },
    {
      question: "Are there penalties for paying extra on a mortgage?",
      answer:
        "Most conventional mortgages have no prepayment penalty. However, some loans (particularly certain FHA, VA, or subprime loans) may charge a fee for paying off early. Check your loan documents or ask your lender before making extra payments. If there is a penalty, it usually only applies in the first 3-5 years.",
    },
  ];

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Extra Mortgage Payment Calculator",
    description: "Calculate how extra monthly or annual payments reduce your mortgage term and total interest. See exactly how much time and money you save with additional principal payments.",
    url: "https://lendingcalculator.net/extra-payments",
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
            Extra Mortgage Payment Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            See how additional monthly or annual payments can dramatically reduce your
            mortgage term and total interest. Enter your loan details and extra payment
            amount to see the impact immediately.
          </p>
        </div>

        <ExtraPaymentsCalculator />
      </div>

      {/* Educational Content */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The Power of Extra Mortgage Payments</h2>
        <p className="text-gray-600 mb-4">
          Extra mortgage payments are one of the simplest and most powerful wealth-building strategies
          available to homeowners. Because mortgage interest is calculated on the outstanding balance,
          every extra dollar you pay creates a ripple effect of savings across all remaining months.
        </p>
        <p className="text-gray-600 mb-4">
          Consider a $300,000 mortgage at 6.5% for 30 years. Your monthly payment is $1,896 and
          you will pay $382,633 in total interest over the life of the loan. Adding just $200/month
          in extra payments saves over $100,000 in interest and pays off the loan more than 7 years early.
        </p>
        <p className="text-gray-600 mb-4">
          The earlier in your loan you start making extra payments, the more impactful they are.
          A $200 extra payment in year 1 saves far more interest than the same $200 in year 20
          because the balance it reduces would have accrued interest for decades.
        </p>
        <p className="text-gray-600 mb-8">
          Even irregular extra payments help. Using your annual tax refund, work bonus, or other
          windfalls to make a lump-sum payment once a year can shave years off your mortgage
          without changing your monthly budget.
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
              { "@type": "ListItem", position: 2, name: "Extra Payment Calculator", item: "https://lendingcalculator.net/extra-payments" },
            ],
          }),
        }}
      />
    </>
  );
}
