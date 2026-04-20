"use client";

import { useState, useMemo, useRef } from "react";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function fmtCurrency(n: number): string {
  return "$" + fmt(Math.round(n));
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
  totalPrincipal: number;
}

function calculateAmortization(
  loanAmount: number,
  annualRate: number,
  termYears: number
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
  let totalPrincipal = 0;

  for (let month = 1; month <= totalPayments && balance > 0; month++) {
    const interest = balance * monthlyRate;
    let principal = basePayment - interest;

    if (principal > balance) {
      principal = balance;
    }

    balance -= principal;
    totalInterest += interest;
    totalPrincipal += principal;

    rows.push({
      month,
      payment: basePayment,
      principal,
      interest,
      balance: Math.max(0, balance),
      totalInterest,
      totalPrincipal,
    });

    if (balance <= 0) break;
  }

  return rows;
}

export default function AmortizationScheduleCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("yearly");
  const tableRef = useRef<HTMLDivElement>(null);

  const schedule = useMemo(
    () => calculateAmortization(loanAmount, rate, termYears),
    [loanAmount, rate, termYears]
  );

  const totalInterest = schedule[schedule.length - 1]?.totalInterest || 0;
  const totalPaid = loanAmount + totalInterest;
  const monthlyPayment = schedule[0]?.payment || 0;

  // Yearly summary
  const yearlySummary = useMemo(() => {
    const years: {
      year: number;
      principal: number;
      interest: number;
      endBalance: number;
    }[] = [];
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (const row of schedule) {
      yearPrincipal += row.principal;
      yearInterest += row.interest;

      if (row.month % 12 === 0 || row.month === schedule.length) {
        years.push({
          year: Math.ceil(row.month / 12),
          principal: yearPrincipal,
          interest: yearInterest,
          endBalance: row.balance,
        });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }
    return years;
  }, [schedule]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={10000}
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
              <option value={25}>25 years</option>
              <option value={20}>20 years</option>
              <option value={15}>15 years</option>
              <option value={10}>10 years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="bg-sky-600 rounded-xl p-6 text-white text-center">
        <p className="text-sky-100 text-sm mb-1">Monthly Payment (P&I)</p>
        <p className="text-5xl font-bold">{fmtCurrency(monthlyPayment)}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
          <p className="text-xl font-bold text-gray-900">{fmtCurrency(loanAmount)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Total Interest</p>
          <p className="text-xl font-bold text-red-600">{fmtCurrency(totalInterest)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Total Cost</p>
          <p className="text-xl font-bold text-gray-900">{fmtCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Total Payments</p>
          <p className="text-xl font-bold text-gray-900">{schedule.length}</p>
        </div>
      </div>

      {/* View Toggle & Print */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("yearly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === "yearly"
                ? "bg-sky-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Yearly View
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === "monthly"
                ? "bg-sky-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Monthly View
          </button>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition print:hidden"
        >
          Print Schedule
        </button>
      </div>

      {/* Schedule Table */}
      <div ref={tableRef} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          {viewMode === "yearly" ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Year</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Principal Paid</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Interest Paid</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlySummary.map((row) => (
                  <tr key={row.year} className="border-t border-gray-100">
                    <td className="py-2 px-4 text-gray-600">{row.year}</td>
                    <td className="py-2 px-4 text-right text-green-700">{fmtCurrency(row.principal)}</td>
                    <td className="py-2 px-4 text-right text-red-600">{fmtCurrency(row.interest)}</td>
                    <td className="py-2 px-4 text-right font-mono">{fmtCurrency(row.endBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-3 font-medium text-gray-600">Month</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">Payment</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">Principal</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">Interest</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">Balance</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">Total Interest</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-t border-gray-100">
                    <td className="py-1.5 px-3 text-gray-600">{row.month}</td>
                    <td className="py-1.5 px-3 text-right">{fmtCurrency(row.payment)}</td>
                    <td className="py-1.5 px-3 text-right text-green-700">{fmtCurrency(row.principal)}</td>
                    <td className="py-1.5 px-3 text-right text-red-600">{fmtCurrency(row.interest)}</td>
                    <td className="py-1.5 px-3 text-right font-mono">{fmtCurrency(row.balance)}</td>
                    <td className="py-1.5 px-3 text-right text-gray-500">{fmtCurrency(row.totalInterest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Internal Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/" className="text-sky-600 hover:underline text-sm">Mortgage Payment Calculator</a>
          <a href="/extra-payments" className="text-sky-600 hover:underline text-sm">Extra Payment Calculator</a>
          <a href="/refinance" className="text-sky-600 hover:underline text-sm">Refinance Calculator</a>
          <a href="/affordability" className="text-sky-600 hover:underline text-sm">Home Affordability Calculator</a>
          <a href="/rent-vs-buy" className="text-sky-600 hover:underline text-sm">Rent vs Buy Calculator</a>
        </div>
      </div>
    </div>
  );
}
