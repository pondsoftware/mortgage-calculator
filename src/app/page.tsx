import MortgageCalculator from "@/components/MortgageCalculator";

export default function Home() {
  const faqs = [
    {
      question: "How is a monthly mortgage payment calculated?",
      answer: "Your monthly payment is calculated using the loan amount, interest rate, and loan term. The formula factors in compound interest so each payment covers both interest and principal. Use our calculator above to see the exact breakdown."
    },
    {
      question: "What is included in a mortgage payment?",
      answer: "A full mortgage payment includes principal, interest, property taxes, and homeowners insurance (known as PITI). If your down payment is less than 20%, you'll also pay private mortgage insurance (PMI). This calculator shows all components so you can see your true monthly cost."
    },
    {
      question: "Is a 15-year or 30-year mortgage better?",
      answer: "A 15-year mortgage has higher monthly payments but saves significantly on total interest. A 30-year mortgage has lower payments but costs more overall. For example, a $300,000 loan at 7% costs $359,264 in interest over 30 years vs $185,682 over 15 years. Use our comparison section above to see the difference with your numbers."
    },
    {
      question: "How much does an extra mortgage payment save?",
      answer: "Even small extra payments can save tens of thousands in interest. An extra $200/month on a $300,000 30-year mortgage at 7% saves over $100,000 in interest and pays off the loan 8 years early."
    },
    {
      question: "What is PMI and when does it go away?",
      answer: "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. It typically costs 0.5% to 1% of the loan amount per year. PMI automatically drops off once you reach 20% equity in your home through payments or appreciation."
    },
    {
      question: "How much house can I afford?",
      answer: "A common guideline is that your monthly mortgage payment should not exceed 28% of your gross monthly income. With a $75,000 salary, that means a maximum payment of about $1,750/month. Remember to include taxes, insurance, and PMI in that number."
    },
    {
      question: "What is a good mortgage interest rate?",
      answer: "Rates vary with market conditions and your credit score. As of 2024, rates for 30-year fixed mortgages have been in the 6-7% range. A credit score above 740 typically gets the best rates."
    }
  ];

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Payment Calculator",
    description: "Free mortgage calculator with monthly payment breakdown, full amortization schedule, and extra payment analysis. See exactly how much interest you'll pay over the life of your loan.",
    url: "https://lendingcalculator.net",
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
            Mortgage Payment Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Calculate your full monthly mortgage payment including principal, interest,
            property taxes, insurance, and PMI. Compare 15-year vs 30-year terms and
            see how extra payments can save you thousands.
          </p>
        </div>

        <MortgageCalculator />
      </div>

      {/* Related Calculators Navigation */}
      <section className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">More Mortgage Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/amortization-schedule"
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-sky-600 transition mb-2">
              Amortization Schedule
            </h3>
            <p className="text-sm text-gray-600">
              Generate a full month-by-month breakdown of principal, interest, and remaining balance.
            </p>
          </a>
          <a
            href="/refinance"
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-sky-600 transition mb-2">
              Refinance Calculator
            </h3>
            <p className="text-sm text-gray-600">
              Compare current vs refinance terms. See monthly savings and break-even point.
            </p>
          </a>
          <a
            href="/affordability"
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-sky-600 transition mb-2">
              Home Affordability
            </h3>
            <p className="text-sm text-gray-600">
              Find out how much house you can afford based on income, debts, and the 28/36 DTI rules.
            </p>
          </a>
          <a
            href="/rent-vs-buy"
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-sky-600 transition mb-2">
              Rent vs Buy
            </h3>
            <p className="text-sm text-gray-600">
              Compare total cost of renting vs buying over time with appreciation and equity.
            </p>
          </a>
          <a
            href="/extra-payments"
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-sky-600 transition mb-2">
              Extra Payments
            </h3>
            <p className="text-sm text-gray-600">
              See how additional monthly or annual payments reduce your loan term and total interest.
            </p>
          </a>
        </div>
      </section>

      {/* Related Financial Tools */}
      <section className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Financial Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="https://compoundinterestcalc.app" className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900 group-hover:text-sky-600 transition mb-2">Compound Interest Calculator</h3>
            <p className="text-sm text-gray-600">See how your savings or investments grow over time with compound interest.</p>
          </a>
          <a href="https://salaryconverter.net" className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900 group-hover:text-sky-600 transition mb-2">Salary Converter</h3>
            <p className="text-sm text-gray-600">Convert annual salary to hourly, monthly, or weekly pay. Compare across 180+ countries.</p>
          </a>
        </div>
      </section>

      {/* Educational Content */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How Is a Mortgage Payment Calculated?</h2>
        <p className="text-gray-600 mb-4">
          A mortgage payment is calculated using a process called amortization. Your lender takes
          the total loan amount, applies the interest rate, and spreads payments evenly over the
          loan term (typically 15 or 30 years). Each monthly payment is the same dollar amount,
          but how that payment is split between principal and interest changes over time.
        </p>
        <p className="text-gray-600 mb-4">
          In the early years of your mortgage, the majority of each payment goes toward interest
          because the outstanding balance is still large. As you pay down the principal, more of
          each payment goes toward reducing the balance. By the final years of the loan, nearly
          all of your payment goes toward principal.
        </p>
        <p className="text-gray-600 mb-8">
          The standard mortgage formula calculates your monthly principal and interest payment as:
          M = P[r(1+r)^n] / [(1+r)^n - 1], where P is the loan amount, r is the monthly interest
          rate, and n is the total number of payments. This ensures the loan is fully paid off by
          the end of the term.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included in Your Monthly Payment (PITI)</h2>
        <p className="text-gray-600 mb-4">
          Your true monthly housing cost is more than just principal and interest. Lenders and
          financial advisors use the acronym PITI to describe the full payment:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li><strong>Principal</strong> — The portion of your payment that reduces your loan balance. This builds your home equity over time.</li>
          <li><strong>Interest</strong> — The cost of borrowing money. This is how the lender makes a profit on the loan.</li>
          <li><strong>Taxes</strong> — Property taxes assessed by your local government, typically 0.5% to 2.5% of the home&apos;s value per year depending on location.</li>
          <li><strong>Insurance</strong> — Homeowners insurance protects against damage and liability. Lenders require it as long as you have a mortgage.</li>
        </ul>
        <p className="text-gray-600 mb-4">
          If your down payment is less than 20%, you will also pay <strong>Private Mortgage Insurance (PMI)</strong>.
          PMI protects the lender (not you) in case of default. It typically costs 0.5% to 1% of the
          loan amount per year and is added to your monthly payment. The good news: PMI automatically
          drops off once you reach 20% equity in your home.
        </p>
        <p className="text-gray-600 mb-8">
          This calculator includes all PITI components plus PMI so you can see your true monthly
          housing cost — not just the principal and interest that basic calculators show.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">How Extra Payments Save You Money</h2>
        <p className="text-gray-600 mb-4">
          Making extra payments toward your mortgage principal is one of the most powerful ways to
          save money on your home loan. Because mortgage interest is calculated on the remaining
          balance, every extra dollar you pay reduces the amount of interest charged in all future months.
        </p>
        <p className="text-gray-600 mb-4">
          Consider a $300,000 mortgage at 7% for 30 years. The monthly payment is about $1,996
          and you will pay $418,527 in total interest over the life of the loan. Now add just $200
          per month in extra payments:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>You save over $100,000 in interest payments</li>
          <li>You pay off the loan approximately 8 years early</li>
          <li>Your total cost drops by more than the extra payments themselves because of the compounding effect</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Even $100 extra per month makes a meaningful difference — saving roughly $60,000 in
          interest and cutting about 5 years off a 30-year mortgage. The key is that extra payments
          go entirely toward principal, which reduces your balance faster and means less interest
          accrues each month going forward.
        </p>
        <p className="text-gray-600 mb-8">
          Use the &quot;Extra Monthly Payment&quot; field in the calculator above to see exactly how much
          you could save with your specific loan amount and rate.
        </p>
      </section>

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lendingcalculator.net" }
            ]
          })
        }}
      />
    </>
  );
}
