import MortgageCalculator from "@/components/MortgageCalculator";

export default function Home() {
  return (
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
  );
}
