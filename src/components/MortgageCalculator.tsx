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

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);

  const loanAmount = homePrice - downPayment;
  const downPaymentPercent =
    homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : "0";

  const schedule = useMemo(
    () => calculateAmortization(loanAmount, rate, termYears, extraMonthly),
    [loanAmount, rate, termYears, extraMonthly]
  );

  const scheduleNoExtra = useMemo(
    () => calculateAmortization(loanAmount, rate, termYears, 0),
    [loanAmount, rate, termYears]
  );

  const monthlyPayment = schedule[0]?.payment || 0;
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
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
                className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
            >
              <option value={30}>30 years</option>
              <option value={20}>20 years</option>
              <option value={15}>15 years</option>
              <option value={10}>10 years</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extra Monthly Payment (optional)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              min={0}
              step={50}
            />
          </div>
        </div>
      </div>

      {/* Key Result */}
      <div className="bg-blue-600 rounded-xl p-6 text-white text-center">
        <p className="text-blue-100 text-sm mb-1">Monthly Payment</p>
        <p className="text-5xl font-bold">${fmt(Math.round(monthlyPayment))}</p>
        {extraMonthly > 0 && (
          <p className="text-blue-200 text-sm mt-1">
            + ${fmt(extraMonthly)} extra = ${fmt(Math.round(monthlyPayment + extraMonthly))}/mo
          </p>
        )}
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
                      <td className="py-1.5 px-3 text-right text-blue-600">${fmt(Math.round(row.extraPayment))}</td>
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
