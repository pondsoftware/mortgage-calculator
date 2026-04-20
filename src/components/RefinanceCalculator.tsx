"use client";

import { useState, useMemo } from "react";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function fmtCurrency(n: number): string {
  return "$" + fmt(Math.round(n));
}

function calculateMonthlyPayment(
  loanAmount: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate <= 0) return loanAmount / termMonths;
  return (
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
}

function calculateTotalInterestRemaining(
  balance: number,
  annualRate: number,
  remainingMonths: number
): number {
  const monthlyPayment = calculateMonthlyPayment(balance, annualRate, remainingMonths);
  return monthlyPayment * remainingMonths - balance;
}

export default function RefinanceCalculator() {
  // Current loan
  const [currentBalance, setCurrentBalance] = useState(280000);
  const [currentRate, setCurrentRate] = useState(7.0);
  const [currentRemainingYears, setCurrentRemainingYears] = useState(27);

  // New loan
  const [newRate, setNewRate] = useState(6.0);
  const [newTermYears, setNewTermYears] = useState(30);
  const [closingCosts, setClosingCosts] = useState(6000);

  const currentRemainingMonths = currentRemainingYears * 12;
  const newTermMonths = newTermYears * 12;

  const results = useMemo(() => {
    const currentMonthly = calculateMonthlyPayment(currentBalance, currentRate, currentRemainingMonths);
    const newMonthly = calculateMonthlyPayment(currentBalance, newRate, newTermMonths);
    const monthlySavings = currentMonthly - newMonthly;

    const currentTotalInterest = calculateTotalInterestRemaining(currentBalance, currentRate, currentRemainingMonths);
    const newTotalInterest = calculateTotalInterestRemaining(currentBalance, newRate, newTermMonths);
    const interestSavings = currentTotalInterest - newTotalInterest - closingCosts;

    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;

    const currentTotalCost = currentMonthly * currentRemainingMonths;
    const newTotalCost = newMonthly * newTermMonths + closingCosts;
    const totalSavings = currentTotalCost - newTotalCost;

    return {
      currentMonthly,
      newMonthly,
      monthlySavings,
      currentTotalInterest,
      newTotalInterest,
      interestSavings,
      breakEvenMonths,
      currentTotalCost,
      newTotalCost,
      totalSavings,
    };
  }, [currentBalance, currentRate, currentRemainingMonths, newRate, newTermMonths, closingCosts]);

  const worthRefinancing = results.monthlySavings > 0 && results.breakEvenMonths < newTermYears * 12;

  return (
    <div className="space-y-8">
      {/* Current Loan Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Current Mortgage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={10000}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={currentRate}
                onChange={(e) => setCurrentRate(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                max={20}
                step={0.125}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years Remaining
            </label>
            <input
              type="number"
              value={currentRemainingYears}
              onChange={(e) => setCurrentRemainingYears(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
              min={1}
              max={40}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* New Loan Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Refinance Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                max={20}
                step={0.125}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Loan Term
            </label>
            <select
              value={newTermYears}
              onChange={(e) => setNewTermYears(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none bg-white"
            >
              <option value={30}>30 years</option>
              <option value={25}>25 years</option>
              <option value={20}>20 years</option>
              <option value={15}>15 years</option>
              <option value={10}>10 years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Closing Costs
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={closingCosts}
                onChange={(e) => setClosingCosts(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={500}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Result */}
      <div className={`rounded-xl p-6 text-white text-center ${worthRefinancing ? "bg-sky-600" : "bg-gray-600"}`}>
        <p className="text-sm opacity-80 mb-1">Monthly Savings</p>
        <p className="text-5xl font-bold">
          {results.monthlySavings > 0 ? fmtCurrency(results.monthlySavings) : "$0"}
        </p>
        {results.monthlySavings > 0 && (
          <p className="text-sm opacity-80 mt-2">per month</p>
        )}
      </div>

      {/* Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Side-by-Side Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
            <h4 className="font-semibold text-gray-700 text-lg mb-3">Current Mortgage</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Monthly Payment</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.currentMonthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Remaining Interest</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.currentTotalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Remaining Cost</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.currentTotalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Time Left</span>
                <span className="font-bold text-gray-900">{currentRemainingYears} years</span>
              </div>
            </div>
          </div>
          <div className="border border-sky-200 bg-sky-50 rounded-lg p-5">
            <h4 className="font-semibold text-sky-900 text-lg mb-3">Refinanced Mortgage</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Monthly Payment</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.newMonthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Interest</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.newTotalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Cost (incl. closing)</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.newTotalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">New Term</span>
                <span className="font-bold text-gray-900">{newTermYears} years</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Break-Even & Savings */}
      <div className={`rounded-xl p-6 border ${worthRefinancing ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
        <h3 className={`font-semibold mb-3 ${worthRefinancing ? "text-green-900" : "text-yellow-900"}`}>
          {worthRefinancing ? "Refinancing Makes Sense" : "Refinancing May Not Be Worth It"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className={`text-sm ${worthRefinancing ? "text-green-700" : "text-yellow-700"}`}>Break-Even Point</p>
            <p className={`text-2xl font-bold ${worthRefinancing ? "text-green-900" : "text-yellow-900"}`}>
              {results.breakEvenMonths === Infinity
                ? "Never"
                : `${Math.floor(results.breakEvenMonths / 12)}y ${results.breakEvenMonths % 12}m`}
            </p>
          </div>
          <div>
            <p className={`text-sm ${worthRefinancing ? "text-green-700" : "text-yellow-700"}`}>Interest Savings</p>
            <p className={`text-2xl font-bold ${worthRefinancing ? "text-green-900" : "text-yellow-900"}`}>
              {results.interestSavings > 0 ? fmtCurrency(results.interestSavings) : "-" + fmtCurrency(Math.abs(results.interestSavings))}
            </p>
          </div>
          <div>
            <p className={`text-sm ${worthRefinancing ? "text-green-700" : "text-yellow-700"}`}>Lifetime Savings</p>
            <p className={`text-2xl font-bold ${worthRefinancing ? "text-green-900" : "text-yellow-900"}`}>
              {results.totalSavings > 0 ? fmtCurrency(results.totalSavings) : "-" + fmtCurrency(Math.abs(results.totalSavings))}
            </p>
          </div>
        </div>
        <p className={`text-sm mt-3 ${worthRefinancing ? "text-green-700" : "text-yellow-700"}`}>
          {worthRefinancing
            ? `You'll recoup your ${fmtCurrency(closingCosts)} in closing costs after ${results.breakEvenMonths} months. After that, you save ${fmtCurrency(results.monthlySavings)} every month.`
            : results.monthlySavings <= 0
            ? "Your new payment would be higher than your current payment. Consider a lower rate or shorter term."
            : `It would take ${results.breakEvenMonths} months to recoup closing costs. Consider if you'll stay in the home long enough.`}
        </p>
      </div>

      {/* Internal Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/" className="text-sky-600 hover:underline text-sm">Mortgage Payment Calculator</a>
          <a href="/amortization-schedule" className="text-sky-600 hover:underline text-sm">Amortization Schedule</a>
          <a href="/extra-payments" className="text-sky-600 hover:underline text-sm">Extra Payment Calculator</a>
          <a href="/affordability" className="text-sky-600 hover:underline text-sm">Home Affordability Calculator</a>
          <a href="/rent-vs-buy" className="text-sky-600 hover:underline text-sm">Rent vs Buy Calculator</a>
        </div>
      </div>
    </div>
  );
}
