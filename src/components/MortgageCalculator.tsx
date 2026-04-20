"use client";

import { useState, useMemo } from "react";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  balance: number;
  totalInterest: number;
}

function calculateAmortization(
  loanAmount: number,
  annualRate: number,
  termYears: number,
  extraMonthly: number
): AmortizationRow[] {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  const basePayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmount / totalPayments;

  const rows: AmortizationRow[] = [];
  let balance = loanAmount;
  let totalInterest = 0;

  for (let month = 1; month <= totalPayments && balance > 0; month++) {
    const interest = balance * monthlyRate;
    let principal = basePayment - interest;
    let extra = extraMonthly;

    // Last payment adjustment
    if (principal + extra > balance) {
      principal = balance;
      extra = 0;
    } else if (principal + extra > balance) {
      extra = balance - principal;
    }

    if (balance - principal - extra < 0) {
      extra = balance - principal;
    }

    balance -= principal + extra;
    totalInterest += interest;

    rows.push({
      month,
      payment: basePayment,
      principal,
      interest,
      extraPayment: extra,
      balance: Math.max(0, balance),
      totalInterest,
    });

    if (balance <= 0) break;
  }

  return rows;
}

function calculateMonthlyPI(
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

function calculateTotalInterest(
  loanAmount: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyPayment = calculateMonthlyPI(loanAmount, annualRate, termYears);
  const totalPayments = termYears * 12;
  return monthlyPayment * totalPayments - loanAmount;
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(3600);
  const [annualInsurance, setAnnualInsurance] = useState(1200);
  const [pmiRate, setPmiRate] = useState(0.75);
  const [showSchedule, setShowSchedule] = useState(false);

  const loanAmount = homePrice - downPayment;
  const downPaymentPercent =
    homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : "0";
  const downPaymentPercentNum = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;

  // PITI calculations
  const monthlyPropertyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const hasPMI = downPaymentPercentNum < 20;
  const monthlyPMI = hasPMI ? (loanAmount * (pmiRate / 100)) / 12 : 0;

  const schedule = useMemo(
    () => calculateAmortization(loanAmount, rate, termYears, extraMonthly),
    [loanAmount, rate, termYears, extraMonthly]
  );

  const scheduleNoExtra = useMemo(
    () => calculateAmortization(loanAmount, rate, termYears, 0),
    [loanAmount, rate, termYears]
  );

  const monthlyPayment = schedule[0]?.payment || 0;
  const totalMonthlyPITI = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI;
  const totalInterest = schedule[schedule.length - 1]?.totalInterest || 0;
  const totalInterestNoExtra =
    scheduleNoExtra[scheduleNoExtra.length - 1]?.totalInterest || 0;
  const totalPaid = schedule.reduce(
    (sum, r) => sum + r.payment + r.extraPayment,
    0
  );
  const payoffMonths = schedule.length;
  const originalMonths = termYears * 12;
  const monthsSaved = originalMonths - payoffMonths;
  const interestSaved = totalInterestNoExtra - totalInterest;

  // Payment breakdown for pie-like display
  const principalPercent =
    totalPaid > 0 ? ((loanAmount / totalPaid) * 100).toFixed(0) : "0";
  const interestPercent =
    totalPaid > 0 ? ((totalInterest / totalPaid) * 100).toFixed(0) : "0";

  // 15yr vs 30yr comparison
  const monthlyPI15 = calculateMonthlyPI(loanAmount, rate, 15);
  const monthlyPI30 = calculateMonthlyPI(loanAmount, rate, 30);
  const totalInterest15 = calculateTotalInterest(loanAmount, rate, 15);
  const totalInterest30 = calculateTotalInterest(loanAmount, rate, 30);
  const totalCost15 = loanAmount + totalInterest15;
  const totalCost30 = loanAmount + totalInterest30;
  const interestSavedWith15 = totalInterest30 - totalInterest15;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Home Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={10000}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment ({downPaymentPercent}%)
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
              <option value={10}>10 years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Property Tax
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={annualPropertyTax}
                onChange={(e) => setAnnualPropertyTax(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={100}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Homeowners Insurance
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra Monthly Payment (optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={extraMonthly}
                onChange={(e) => setExtraMonthly(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={50}
              />
            </div>
          </div>
          {hasPMI && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PMI Rate (down payment &lt; 20%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pmiRate}
                  onChange={(e) => setPmiRate(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                  min={0}
                  max={3}
                  step={0.05}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Result */}
      <div className="bg-sky-600 rounded-xl p-6 text-white text-center">
        <p className="text-sky-100 text-sm mb-1">Total Monthly Payment (PITI)</p>
        <p className="text-5xl font-bold">${fmt(Math.round(totalMonthlyPITI))}</p>
        {extraMonthly > 0 && (
          <p className="text-sky-200 text-sm mt-1">
            + ${fmt(extraMonthly)} extra = ${fmt(Math.round(totalMonthlyPITI + extraMonthly))}/mo
          </p>
        )}
      </div>

      {/* PITI Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Payment Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Principal &amp; Interest</span>
            <span className="font-semibold text-gray-900">${fmt(Math.round(monthlyPayment))}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Property Tax</span>
            <span className="font-semibold text-gray-900">${fmt(Math.round(monthlyPropertyTax))}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Homeowners Insurance</span>
            <span className="font-semibold text-gray-900">${fmt(Math.round(monthlyInsurance))}</span>
          </div>
          {hasPMI && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <span className="text-gray-600">PMI</span>
                <span className="text-xs text-gray-400 ml-2">(drops off at 20% equity)</span>
              </div>
              <span className="font-semibold text-gray-900">${fmt(Math.round(monthlyPMI))}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-gray-300">
            <span className="font-bold text-gray-900">Total Payment</span>
            <span className="font-bold text-gray-900 text-lg">${fmt(Math.round(totalMonthlyPITI))}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Loan Amount" value={`$${fmt(loanAmount)}`} />
        <SummaryCard label="Total Interest" value={`$${fmt(Math.round(totalInterest))}`} />
        <SummaryCard label="Total Paid" value={`$${fmt(Math.round(totalPaid))}`} />
        <SummaryCard
          label="Interest / Principal"
          value={`${interestPercent}% / ${principalPercent}%`}
        />
      </div>

      {/* Extra Payment Impact */}
      {extraMonthly > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-900 mb-2">
            Extra Payment Impact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-700">Interest saved</p>
              <p className="text-2xl font-bold text-green-900">
                ${fmt(Math.round(interestSaved))}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700">Time saved</p>
              <p className="text-2xl font-bold text-green-900">
                {Math.floor(monthsSaved / 12)} years, {monthsSaved % 12} months
              </p>
            </div>
          </div>
          <p className="text-sm text-green-700 mt-2">
            Payoff in {Math.floor(payoffMonths / 12)} years,{" "}
            {payoffMonths % 12} months instead of {termYears} years
          </p>
        </div>
      )}

      {/* 15yr vs 30yr Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">15-Year vs 30-Year Comparison</h3>
        <p className="text-sm text-gray-600 mb-6">
          See how a shorter term affects your monthly payment and total cost using your current inputs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 15-Year Card */}
          <div className="border border-sky-200 bg-sky-50 rounded-lg p-5">
            <h4 className="font-semibold text-sky-900 text-lg mb-3">15-Year Fixed</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Monthly P&amp;I</span>
                <span className="font-bold text-gray-900">${fmt(Math.round(monthlyPI15))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Interest</span>
                <span className="font-bold text-gray-900">${fmt(Math.round(totalInterest15))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Cost</span>
                <span className="font-bold text-gray-900">${fmt(Math.round(totalCost15))}</span>
              </div>
            </div>
          </div>
          {/* 30-Year Card */}
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
            <h4 className="font-semibold text-gray-700 text-lg mb-3">30-Year Fixed</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Monthly P&amp;I</span>
                <span className="font-bold text-gray-900">${fmt(Math.round(monthlyPI30))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Interest</span>
                <span className="font-bold text-gray-900">${fmt(Math.round(totalInterest30))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Cost</span>
                <span className="font-bold text-gray-900">${fmt(Math.round(totalCost30))}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Savings Summary */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-900 font-semibold">
            Choosing 15 years saves you ${fmt(Math.round(interestSavedWith15))} in interest
          </p>
          <p className="text-sm text-green-700 mt-1">
            Monthly payment is ${fmt(Math.round(monthlyPI15 - monthlyPI30))} higher, but you pay off your home 15 years sooner and keep far more of your money.
          </p>
        </div>
      </div>

      {/* Amortization Schedule Toggle */}
      <div>
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {showSchedule ? "Hide" : "Show"} Amortization Schedule
        </button>
      </div>

      {showSchedule && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Month</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-600">Payment</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-600">Principal</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-600">Interest</th>
                  {extraMonthly > 0 && (
                    <th className="text-right py-2 px-3 font-medium text-gray-600">Extra</th>
                  )}
                  <th className="text-right py-2 px-3 font-medium text-gray-600">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-t border-gray-100">
                    <td className="py-1.5 px-3 text-gray-600">{row.month}</td>
                    <td className="py-1.5 px-3 text-right">${fmt(Math.round(row.payment))}</td>
                    <td className="py-1.5 px-3 text-right text-green-700">${fmt(Math.round(row.principal))}</td>
                    <td className="py-1.5 px-3 text-right text-red-600">${fmt(Math.round(row.interest))}</td>
                    {extraMonthly > 0 && (
                      <td className="py-1.5 px-3 text-right text-sky-600">${fmt(Math.round(row.extraPayment))}</td>
                    )}
                    <td className="py-1.5 px-3 text-right font-mono">${fmt(Math.round(row.balance))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
