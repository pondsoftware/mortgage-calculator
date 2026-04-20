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

interface YearComparison {
  year: number;
  rentCumulative: number;
  buyCumulative: number;
  homeEquity: number;
  netBuyCost: number; // cumulative buy costs minus equity built
}

export default function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [appreciation, setAppreciation] = useState(3);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [annualInsurance, setAnnualInsurance] = useState(1500);
  const [annualMaintenance, setAnnualMaintenance] = useState(1.0);
  const [yearsToCompare, setYearsToCompare] = useState(10);

  const results = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const monthlyPI = calculateMonthlyPayment(loanAmount, rate, termYears);
    const monthlyRate = rate / 100 / 12;

    const yearlyData: YearComparison[] = [];
    let rentCumulative = 0;
    let buyCumulative = downPayment; // Include down payment as cost
    let balance = loanAmount;
    let currentRent = monthlyRent;
    let currentHomeValue = homePrice;

    for (let year = 1; year <= yearsToCompare; year++) {
      // Rent costs for the year
      const yearRent = currentRent * 12;
      rentCumulative += yearRent;
      currentRent *= 1 + rentIncrease / 100;

      // Buy costs for the year
      const yearPI = monthlyPI * 12;
      const yearTax = (currentHomeValue * propertyTaxRate) / 100;
      const yearInsurance = annualInsurance;
      const yearMaintenance = (currentHomeValue * annualMaintenance) / 100;
      const yearBuyCosts = yearPI + yearTax + yearInsurance + yearMaintenance;
      buyCumulative += yearBuyCosts;

      // Calculate balance remaining after this year
      let yearInterestPaid = 0;
      for (let m = 0; m < 12; m++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPI - interest;
        balance -= principal;
        yearInterestPaid += interest;
      }

      // Home appreciation
      currentHomeValue *= 1 + appreciation / 100;

      // Equity = home value - remaining balance
      const homeEquity = currentHomeValue - Math.max(0, balance);

      // Net buy cost = total costs minus equity
      const netBuyCost = buyCumulative - homeEquity;

      yearlyData.push({
        year,
        rentCumulative,
        buyCumulative,
        homeEquity,
        netBuyCost,
      });
    }

    // Find crossover point (year where buying becomes cheaper)
    let crossoverYear: number | null = null;
    for (const data of yearlyData) {
      if (data.netBuyCost < data.rentCumulative) {
        crossoverYear = data.year;
        break;
      }
    }

    const finalYear = yearlyData[yearlyData.length - 1];
    const buyAdvantage = finalYear ? finalYear.rentCumulative - finalYear.netBuyCost : 0;

    return {
      yearlyData,
      crossoverYear,
      buyAdvantage,
      monthlyPI,
      loanAmount,
      totalMonthlyBuy: monthlyPI + (homePrice * propertyTaxRate / 100) / 12 + annualInsurance / 12 + (homePrice * annualMaintenance / 100) / 12,
    };
  }, [monthlyRent, rentIncrease, homePrice, downPayment, rate, termYears, appreciation, propertyTaxRate, annualInsurance, annualMaintenance, yearsToCompare]);

  return (
    <div className="space-y-8">
      {/* Rent Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Renting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Rent
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                step={100}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Rent Increase
            </label>
            <div className="relative">
              <input
                type="number"
                value={rentIncrease}
                onChange={(e) => setRentIncrease(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                max={15}
                step={0.5}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Buying</h3>
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
              Home Appreciation
            </label>
            <div className="relative">
              <input
                type="number"
                value={appreciation}
                onChange={(e) => setAppreciation(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={-5}
                max={15}
                step={0.5}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%/yr</span>
            </div>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance (% of home value/yr)
            </label>
            <div className="relative">
              <input
                type="number"
                value={annualMaintenance}
                onChange={(e) => setAnnualMaintenance(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                min={0}
                max={5}
                step={0.25}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years to Compare
            </label>
            <input
              type="number"
              value={yearsToCompare}
              onChange={(e) => setYearsToCompare(Math.min(30, Math.max(1, Number(e.target.value))))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
              min={1}
              max={30}
              step={1}
            />
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
      <div className={`rounded-xl p-6 text-white text-center ${results.buyAdvantage > 0 ? "bg-sky-600" : "bg-orange-600"}`}>
        <p className="text-sm opacity-80 mb-1">
          After {yearsToCompare} Years, {results.buyAdvantage > 0 ? "Buying Saves You" : "Renting Saves You"}
        </p>
        <p className="text-5xl font-bold">{fmtCurrency(Math.abs(results.buyAdvantage))}</p>
        {results.crossoverYear && (
          <p className="text-sm opacity-80 mt-2">
            Buying becomes cheaper after year {results.crossoverYear}
          </p>
        )}
        {!results.crossoverYear && results.buyAdvantage <= 0 && (
          <p className="text-sm opacity-80 mt-2">
            Renting stays cheaper for the entire {yearsToCompare}-year period
          </p>
        )}
      </div>

      {/* Monthly Cost Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Initial Monthly Cost Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
            <h4 className="font-semibold text-gray-700 text-lg mb-3">Renting</h4>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent</span>
              <span className="font-bold text-gray-900">{fmtCurrency(monthlyRent)}</span>
            </div>
          </div>
          <div className="border border-sky-200 bg-sky-50 rounded-lg p-5">
            <h4 className="font-semibold text-sky-900 text-lg mb-3">Buying</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">P&I</span>
                <span className="font-semibold text-gray-900">{fmtCurrency(results.monthlyPI)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Tax + Insurance + Maintenance</span>
                <span className="font-semibold text-gray-900">{fmtCurrency(results.totalMonthlyBuy - results.monthlyPI)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-sky-200">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{fmtCurrency(results.totalMonthlyBuy)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Year-by-Year Comparison</h3>
          <p className="text-sm text-gray-500">Net buy cost = total buying costs minus home equity</p>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Year</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Rent (Cumulative)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Buy (Cumulative)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Home Equity</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Net Buy Cost</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Winner</th>
              </tr>
            </thead>
            <tbody>
              {results.yearlyData.map((row) => (
                <tr key={row.year} className="border-t border-gray-100">
                  <td className="py-2 px-4 text-gray-600">{row.year}</td>
                  <td className="py-2 px-4 text-right">{fmtCurrency(row.rentCumulative)}</td>
                  <td className="py-2 px-4 text-right">{fmtCurrency(row.buyCumulative)}</td>
                  <td className="py-2 px-4 text-right text-green-700">{fmtCurrency(row.homeEquity)}</td>
                  <td className="py-2 px-4 text-right font-mono">{fmtCurrency(row.netBuyCost)}</td>
                  <td className="py-2 px-4 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      row.netBuyCost < row.rentCumulative
                        ? "bg-sky-100 text-sky-800"
                        : "bg-orange-100 text-orange-800"
                    }`}>
                      {row.netBuyCost < row.rentCumulative ? "Buy" : "Rent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/" className="text-sky-600 hover:underline text-sm">Mortgage Payment Calculator</a>
          <a href="/affordability" className="text-sky-600 hover:underline text-sm">Home Affordability Calculator</a>
          <a href="/amortization-schedule" className="text-sky-600 hover:underline text-sm">Amortization Schedule</a>
          <a href="/refinance" className="text-sky-600 hover:underline text-sm">Refinance Calculator</a>
          <a href="/extra-payments" className="text-sky-600 hover:underline text-sm">Extra Payment Calculator</a>
        </div>
      </div>
    </div>
  );
}
