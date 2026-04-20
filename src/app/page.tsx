import MortgageCalculator from "@/components/MortgageCalculator";

export default function Home() {
  const faqs = [
    {
      question: "How is a monthly mortgage payment calculated?",
      answer: "Your monthly payment is calculated using the loan amount, interest rate, and loan term. The formula factors in compound interest so each payment covers both interest and principal. Use our calculator above to see the exact breakdown."
    },
    {
      question: "What is included in a mortgage payment?",
      answer: "A basic mortgage payment (principal + interest) is what this calculator shows. Your actual monthly payment may also include property taxes, homeowners insurance (PITI), PMI if your down payment is under 20%, and HOA fees."
    },
    {
      question: "Is a 15-year or 30-year mortgage better?",
      answer: "A 15-year mortgage has higher monthly payments but saves significantly on total interest. A 30-year mortgage has lower payments but costs more overall. For example, a $300,000 loan at 7% costs $359,264 in interest over 30 years vs $185,682 over 15 years."
    },
    {
      question: "How much does an extra mortgage payment save?",
      answer: "Even small extra payments can save tens of thousands in interest. An extra $200/month on a $300,000 30-year mortgage at 7% saves over $100,000 in interest and pays off the loan 8 years early."
    },
    {
      question: "How much house can I afford?",
      answer: "A common guideline is that your monthly mortgage payment should not exceed 28% of your gross monthly income. With a $75,000 salary, that means a maximum payment of about $1,750/month."
    },
    {
      question: "What is a good mortgage interest rate?",
      answer: "Rates vary with market conditions and your credit score. As of 2024, rates for 30-year fixed mortgages have been in the 6-7% range. A credit score above 740 typically gets the best rates."
    }
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Mortgage Payment Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Calculate your monthly mortgage payment, see the full amortization
            schedule, and find out how much you can save with extra payments.
          </p>
        </div>

        <MortgageCalculator />
      </div>

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
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
          })
        }}
      />
    </>
  );
}
