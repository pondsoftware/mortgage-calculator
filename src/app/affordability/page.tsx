import { Metadata } from "next";
import AffordabilityCalculator from "@/components/AffordabilityCalculator";

export const metadata: Metadata = {
  title: "Home Affordability Calculator — How Much House Can I Afford?",
  description:
    "Calculate the maximum home price you can afford based on your income, debts, and down payment. Uses the 28/36 DTI rules with full PITI breakdown including taxes and insurance.",
  alternates: {
    canonical: "https://lendingcalculator.net/affordability",
  },
  openGraph: {
    title: "Home Affordability Calculator",
    description:
      "Calculate the maximum home price you can afford based on your income, debts, and down payment using standard DTI rules.",
    type: "website",
    url: "https://lendingcalculator.net/affordability",
    siteName: "Lending Calculator",
  },
};

export default function AffordabilityPage() {
  const faqs = [
    {
      question: "What is the 28/36 rule for mortgage affordability?",
      answer:
        "The 28/36 rule is a lending guideline that says your housing costs should not exceed 28% of your gross monthly income (front-end ratio), and your total debt payments should not exceed 36% of gross monthly income (back-end ratio). Lenders use these ratios to determine how much you can safely borrow.",
    },
    {
      question: "What counts as monthly debt in the DTI calculation?",
      answer:
        "Monthly debts include car payments, student loan payments, minimum credit card payments, personal loans, child support, and any other recurring debt obligations. It does not include utilities, groceries, subscriptions, or other living expenses.",
    },
    {
      question: "How much should I put down on a house?",
      answer:
        "While 20% down avoids PMI and gets better rates, many buyers put down 3-10%. FHA loans require as little as 3.5% down. A larger down payment means a smaller loan, lower monthly payments, and less total interest. However, putting too much down can leave you without emergency savings.",
    },
    {
      question: "Can I afford more house than the calculator shows?",
      answer:
        "Some lenders will approve loans with DTI ratios up to 43% or even 50% for qualified borrowers. However, the 28/36 guideline represents a comfortable level of debt that leaves room for savings, emergencies, and quality of life. Stretching beyond these limits increases financial stress and foreclosure risk.",
    },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Home Affordability Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Find out how much house you can afford based on your income, debts, and
            down payment. This calculator uses the standard 28/36 DTI rules and includes
            property taxes and insurance in the calculation.
          </p>
        </div>

        <AffordabilityCalculator />
      </div>

      {/* Educational Content */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How Home Affordability Is Calculated</h2>
        <p className="text-gray-600 mb-4">
          Lenders determine how much you can borrow using debt-to-income (DTI) ratios. The two
          most common guidelines are the 28% rule and the 36% rule, collectively known as the
          28/36 rule.
        </p>
        <p className="text-gray-600 mb-4">
          The <strong>front-end ratio (28%)</strong> looks at housing costs only: your mortgage
          payment including principal, interest, property taxes, and insurance (PITI). This
          should not exceed 28% of your gross monthly income.
        </p>
        <p className="text-gray-600 mb-4">
          The <strong>back-end ratio (36%)</strong> adds all other monthly debt obligations
          to your housing costs. The total should not exceed 36% of gross monthly income.
          If you have significant other debts, the 36% rule may be more restrictive than
          the 28% rule.
        </p>
        <p className="text-gray-600 mb-8">
          This calculator uses the more restrictive of the two rules to determine your
          maximum affordable home price. It then shows you the estimated monthly payment
          breakdown so you can see exactly where your money goes.
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
              { "@type": "ListItem", position: 2, name: "Home Affordability Calculator", item: "https://lendingcalculator.net/affordability" },
            ],
          }),
        }}
      />
    </>
  );
}
