"use client";

import { useState, useMemo } from "react";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function fmtCurrency(n: number): string {
  return "$" + fmt(Math.round(n));
}

interface ScheduleResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
}

function calculateLoan(
  loanAmount: number,
  annualRate: number,
  termYears: number,
  extraMonthly: number,
  extraAnnual: number
): ScheduleResult {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  const basePayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmount / totalPayments;

  let balance = loanAmount;
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;

  for (let month = 1; month <= totalPayments && balance > 0; month++) {
    const interest = balance * monthlyRate;
    let principal = basePayment - interest;
    let extra = extraMonthly;

    // Add annual extra payment in December (month 12, 24, 36, etc.)
    if (month % 12 === 0) {
      extra += extraAnnual;
    }

    if (principal + extra > balance) {
      extra = Math.max(0, balance - principal);
      if (principal > balance) principal = balance;
    }

    balance -= principal + extra;
    totalInterest += interest;
    totalPaid += basePayment + extra;
    months = month;

    if (balance <= 0) break;
  }

  return { months, totalInterest, totalPaid };
}

interface YearlyBreakdown {
  year: number;
  principalWithExtra: number;
  interestWithExtra: number;
  balanceWithExtra: number;
  principalNoExtra: number;
  interestNoExtra: number;
  balanceNoExtra: number;
}

function calculateYearlyComparison(
  loanAmount: number,
  annualRate: number,
  termYears: number,
  extraMonthly: number,
  extraAnnual: number
): YearlyBreakdown[] {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  const basePayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmount / totalPayments;

  const years: YearlyBreakdown[] = [];
  let balanceExtra = loanAmount;
  let balanceNoExtra = loanAmount;

  for (let year = 1; year <= termYears; year++) {
    let yearPrincipalExtra = 0;
    let yearInterestExtra = 0;
    let yearPrincipalNoExtra = 0;
    let yearInterestNoExtra = 0;

    for (let m = 1; m <= 12; m++) {
      const month = (year - 1) * 12 + m;

      // With extra payments
      if (balanceExtra > 0) {
        const interest = balanceExtra * monthlyRate;
        let principal = basePayment - interest;
        let extra = extraMonthly;
        if (m === 12) extra += extraAnnual;

        if (principal + extra > balanceExtra) {
          extra = Math.max(0, balanceExtra - principal);
          if (principal > balanceExtra) principal = balanceExtra;
        }

        balanceExtra -= principal + extra;
        yearPrincipalExtra += principal + extra;
        yearInterestExtra += interest;
        if (balanceExtra < 0) balanceExtra = 0;
      }

      // Without extra payments
      if (balanceNoExtra > 0 && month <= totalPayments) {
        const interest = balanceNoExtra * monthlyRate;
        let principal = basePayment - interest;
        if (principal > balanceNoExtra) principal = balanceNoExtra;

        balanceNoExtra -= principal;
        yearPrincipalNoExtra += principal;
        yearInterestNoExtra += interest;
        if (balanceNoExtra < 0) balanceNoExtra = 0;
      }
    }

    years.push({
      year,
      principalWithExtra: yearPrincipalExtra,
      interestWithExtra: yearInterestExtra,
      balanceWithExtra: Math.max(0, balanceExtra),
      principalNoExtra: yearPrincipalNoExtra,
      interestNoExtra: yearInterestNoExtra,
      balanceNoExtra: Math.max(0, balanceNoExtra),
    });

    if (balanceExtra <= 0 && balanceNoExtra <= 0) break;
  }

  return years;
}

export default function ExtraPaymentsCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [extraMonthly, setExtraMonthly] = useState(200);
  const [extraAnnual, setExtraAnnual] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const results = useMemo(() => {
    const withExtra = calculateLoan(loanAmount, rate, termYears, extraMonthly, extraAnnual);
    const withoutExtra = calculateLoan(loanAmount, rate, termYears, 0, 0);

    const monthsSaved = withoutExtra.months - withExtra.months;
    const interestSaved = withoutExtra.totalInterest - withExtra.totalInterest;
    const yearsSaved = Math.floor(monthsSaved / 12);
    const remainingMonths = monthsSaved % 12;

    return {
      withExtra,
      withoutExtra,
      monthsSaved,
      interestSaved,
      yearsSaved,
      remainingMonths,
      payoffYears: Math.floor(withExtra.months / 12),
      payoffMonths: withExtra.months % 12,
    };
  }, [loanAmount, rate, termYears, extraMonthly, extraAnnual]);

  const yearlyData = useMemo(
    () => calculateYearlyComparison(loanAmount, rate, termYears, extraMonthly, extraAnnual),
    [loanAmount, rate, termYears, extraMonthly, extraAnnual]
  );

  const monthlyPayment = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const totalPayments = termYears * 12;
    if (monthlyRate <= 0) return loanAmount / totalPayments;
    return (
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    );
  }, [loanAmount, rate, termYears]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Loan Details</h3>
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

      {/* Extra Payment Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Extra Payments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra Monthly Payment
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
            <p className="text-xs text-gray-500 mt-1">Additional amount paid each month toward principal</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra Annual Payment
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={extraAnnual}
                onChange={(e) => setExtraAnnual(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={500}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">One-time extra payment each year (e.g., tax refund, bonus)</p>
          </div>
        </div>
      </div>

      {/* Key Result */}
      <div className="bg-green-600 rounded-xl p-6 text-white text-center">
        <p className="text-green-100 text-sm mb-1">Total Interest Saved</p>
        <p className="text-5xl font-bold">{fmtCurrency(results.interestSaved)}</p>
        <p className="text-green-200 text-sm mt-2">
          Pay off {results.yearsSaved} years and {results.remainingMonths} months early
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">With vs Without Extra Payments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
            <h4 className="font-semibold text-gray-700 text-lg mb-3">Without Extra Payments</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Monthly Payment</span>
                <span className="font-bold text-gray-900">{fmtCurrency(monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Interest</span>
                <span className="font-bold text-red-600">{fmtCurrency(results.withoutExtra.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Paid</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.withoutExtra.totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Payoff Time</span>
                <span className="font-bold text-gray-900">{termYears} years</span>
              </div>
            </div>
          </div>
          <div className="border border-green-200 bg-green-50 rounded-lg p-5">
            <h4 className="font-semibold text-green-900 text-lg mb-3">With Extra Payments</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Monthly Payment</span>
                <span className="font-bold text-gray-900">{fmtCurrency(monthlyPayment + extraMonthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Interest</span>
                <span className="font-bold text-green-700">{fmtCurrency(results.withExtra.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Paid</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.withExtra.totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Payoff Time</span>
                <span className="font-bold text-green-700">{results.payoffYears}y {results.payoffMonths}m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Interest Saved</p>
          <p className="text-xl font-bold text-green-700">{fmtCurrency(results.interestSaved)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Time Saved</p>
          <p className="text-xl font-bold text-green-700">{results.yearsSaved}y {results.remainingMonths}m</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Extra Paid Total</p>
          <p className="text-xl font-bold text-gray-900">
            {fmtCurrency(extraMonthly * results.withExtra.months + extraAnnual * Math.ceil(results.withExtra.months / 12))}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Return on Extra $</p>
          <p className="text-xl font-bold text-green-700">
            {((results.interestSaved / (extraMonthly * results.withExtra.months + extraAnnual * Math.ceil(results.withExtra.months / 12))) * 100).toFixed(0) || 0}%
          </p>
        </div>
      </div>

      {/* Year-by-Year Table */}
      <div>
        <button
          onClick={() => setShowTable(!showTable)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {showTable ? "Hide" : "Show"} Year-by-Year Comparison
        </button>
      </div>

      {showTable && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-3 font-medium text-gray-600">Year</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">Balance (No Extra)</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">Balance (With Extra)</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-600">Difference</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((row) => (
                  <tr key={row.year} className="border-t border-gray-100">
                    <td className="py-2 px-3 text-gray-600">{row.year}</td>
                    <td className="py-2 px-3 text-right font-mono">{fmtCurrency(row.balanceNoExtra)}</td>
                    <td className="py-2 px-3 text-right font-mono text-green-700">
                      {row.balanceWithExtra <= 0 ? "PAID OFF" : fmtCurrency(row.balanceWithExtra)}
                    </td>
                    <td className="py-2 px-3 text-right text-sky-600">
                      {fmtCurrency(row.balanceNoExtra - row.balanceWithExtra)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Internal Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/" className="text-sky-600 hover:underline text-sm">Mortgage Payment Calculator</a>
          <a href="/amortization-schedule" className="text-sky-600 hover:underline text-sm">Amortization Schedule</a>
          <a href="/refinance" className="text-sky-600 hover:underline text-sm">Refinance Calculator</a>
          <a href="/affordability" className="text-sky-600 hover:underline text-sm">Home Affordability Calculator</a>
          <a href="/rent-vs-buy" className="text-sky-600 hover:underline text-sm">Rent vs Buy Calculator</a>
        </div>
      </div>
    </div>
  );
}
