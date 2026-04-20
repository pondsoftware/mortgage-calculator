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
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  if (monthlyRate <= 0) return loanAmount / totalPayments;
  return (
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  );
}

export default function AffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [annualInsurance, setAnnualInsurance] = useState(1500);

  const results = useMemo(() => {
    const monthlyIncome = annualIncome / 12;

    // 28% rule: housing payment should not exceed 28% of gross monthly income
    const maxHousingPayment28 = monthlyIncome * 0.28;

    // 36% rule: total debt should not exceed 36% of gross monthly income
    const maxTotalDebt36 = monthlyIncome * 0.36;
    const maxHousingPayment36 = maxTotalDebt36 - monthlyDebts;

    // Use the lower of the two limits
    const maxHousingPayment = Math.min(maxHousingPayment28, maxHousingPayment36);

    // Back out taxes and insurance to find max P&I
    const monthlyPropertyTax = (propertyTaxRate / 100) / 12; // as a fraction of home price per month
    const monthlyInsurance = annualInsurance / 12;

    // We need to solve for home price where:
    // P&I + (homePrice * monthlyTaxRate) + monthlyInsurance <= maxHousingPayment
    // P&I = calculateMonthlyPayment(homePrice - downPayment, rate, termYears)
    // This requires iteration since P&I depends on loan amount which depends on home price

    let maxHomePrice = 0;
    let low = 0;
    let high = 5000000;

    for (let i = 0; i < 50; i++) {
      const mid = (low + high) / 2;
      const loanAmount = Math.max(0, mid - downPayment);
      const pi = calculateMonthlyPayment(loanAmount, rate, termYears);
      const tax = (mid * propertyTaxRate / 100) / 12;
      const totalPayment = pi + tax + monthlyInsurance;

      if (totalPayment <= maxHousingPayment) {
        low = mid;
      } else {
        high = mid;
      }
    }
    maxHomePrice = Math.floor(low / 1000) * 1000; // Round down to nearest $1000

    const loanAmount = Math.max(0, maxHomePrice - downPayment);
    const monthlyPI = calculateMonthlyPayment(loanAmount, rate, termYears);
    const monthlyTax = (maxHomePrice * propertyTaxRate / 100) / 12;
    const monthlyIns = annualInsurance / 12;
    const totalMonthly = monthlyPI + monthlyTax + monthlyIns;

    // DTI ratios
    const frontEndDTI = (totalMonthly / monthlyIncome) * 100;
    const backEndDTI = ((totalMonthly + monthlyDebts) / monthlyIncome) * 100;

    return {
      maxHomePrice,
      loanAmount,
      monthlyPI,
      monthlyTax,
      monthlyIns,
      totalMonthly,
      maxHousingPayment,
      maxHousingPayment28,
      maxHousingPayment36,
      frontEndDTI,
      backEndDTI,
      monthlyIncome,
      bindingRule: maxHousingPayment28 <= maxHousingPayment36 ? "28%" : "36%",
    };
  }, [annualIncome, monthlyDebts, downPayment, rate, termYears, propertyTaxRate, annualInsurance]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Your Financial Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Gross Income
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={5000}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Debt Payments
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={50}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Car payments, student loans, credit cards, etc.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={5000}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
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
              Loan Term
            </label>
            <select
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none bg-white"
            >
              <option value={30}>30 years</option>
              <option value={20}>20 years</option>
              <option value={15}>15 years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Tax Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={propertyTaxRate}
                onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                max={5}
                step={0.1}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Annual rate as % of home value</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Insurance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={annualInsurance}
                onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={100}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Result */}
      <div className="bg-sky-600 rounded-xl p-6 text-white text-center">
        <p className="text-sky-100 text-sm mb-1">Maximum Home Price You Can Afford</p>
        <p className="text-5xl font-bold">{fmtCurrency(results.maxHomePrice)}</p>
        <p className="text-sky-200 text-sm mt-2">
          Based on the {results.bindingRule} DTI rule
        </p>
      </div>

      {/* Payment Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Estimated Monthly Payment (PITI)</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Principal & Interest</span>
            <span className="font-semibold text-gray-900">{fmtCurrency(results.monthlyPI)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Property Tax</span>
            <span className="font-semibold text-gray-900">{fmtCurrency(results.monthlyTax)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Homeowners Insurance</span>
            <span className="font-semibold text-gray-900">{fmtCurrency(results.monthlyIns)}</span>
          </div>
          <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-gray-300">
            <span className="font-bold text-gray-900">Total Monthly Payment</span>
            <span className="font-bold text-gray-900 text-lg">{fmtCurrency(results.totalMonthly)}</span>
          </div>
        </div>
      </div>

      {/* DTI Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Debt-to-Income Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Front-End DTI (housing only)</span>
              <span className="text-sm font-semibold text-gray-900">{results.frontEndDTI.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${results.frontEndDTI <= 28 ? "bg-green-500" : "bg-yellow-500"}`}
                style={{ width: `${Math.min(results.frontEndDTI / 40 * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Guideline: 28% max</p>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Back-End DTI (all debt)</span>
              <span className="text-sm font-semibold text-gray-900">{results.backEndDTI.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${results.backEndDTI <= 36 ? "bg-green-500" : "bg-yellow-500"}`}
                style={{ width: `${Math.min(results.backEndDTI / 50 * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Guideline: 36% max</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Monthly Income:</strong> {fmtCurrency(results.monthlyIncome)} |{" "}
            <strong>Max Housing (28% rule):</strong> {fmtCurrency(results.maxHousingPayment28)} |{" "}
            <strong>Max Housing (36% rule):</strong> {fmtCurrency(results.maxHousingPayment36)}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Home Price</p>
          <p className="text-xl font-bold text-gray-900">{fmtCurrency(results.maxHomePrice)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Down Payment</p>
          <p className="text-xl font-bold text-gray-900">{fmtCurrency(downPayment)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
          <p className="text-xl font-bold text-gray-900">{fmtCurrency(results.loanAmount)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Down Payment %</p>
          <p className="text-xl font-bold text-gray-900">
            {results.maxHomePrice > 0 ? ((downPayment / results.maxHomePrice) * 100).toFixed(1) : "0"}%
          </p>
        </div>
      </div>

      {/* Internal Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/" className="text-sky-600 hover:underline text-sm">Mortgage Payment Calculator</a>
          <a href="/amortization-schedule" className="text-sky-600 hover:underline text-sm">Amortization Schedule</a>
          <a href="/refinance" className="text-sky-600 hover:underline text-sm">Refinance Calculator</a>
          <a href="/extra-payments" className="text-sky-600 hover:underline text-sm">Extra Payment Calculator</a>
          <a href="/rent-vs-buy" className="text-sky-600 hover:underline text-sm">Rent vs Buy Calculator</a>
        </div>
      </div>
    </div>
  );
}
