import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mortgage Calculator — Monthly Payment, Amortization & Extra Payments",
  description:
    "Free mortgage calculator with monthly payment breakdown, full amortization schedule, and extra payment analysis. See exactly how much interest you'll pay over the life of your loan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-K7FMZ8XELQ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-K7FMZ8XELQ');
        `}
      </Script>
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-xl font-bold text-gray-900">
              Mortgage Calculator
            </p>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 text-center mb-2">More Free Tools</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
                <a href="https://appliancecostcalculator.net" className="text-blue-600 hover:underline">Appliance Cost Calculator</a>
                <a href="https://sidehustletaxcalculator.net" className="text-blue-600 hover:underline">Side Hustle Tax Calculator</a>
                <a href="https://imageconverters.net" className="text-blue-600 hover:underline">Image Converter</a>
                <a href="https://photometadata.net" className="text-blue-600 hover:underline">Photo Metadata Viewer</a>
                <a href="https://freelancerates.net" className="text-blue-600 hover:underline">Freelance Rate Calculator</a>
                <a href="https://imageresizers.net" className="text-blue-600 hover:underline">Social Image Resizer</a>
                <a href="https://compoundinterestcalc.app" className="text-blue-600 hover:underline">Compound Interest Calculator</a>
                <a href="https://salaryconverter.net" className="text-blue-600 hover:underline">Salary Converter</a>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              This calculator provides estimates for informational purposes
              only. Actual payments may vary based on lender terms, taxes,
              insurance, PMI, and fees. Consult a mortgage professional for
              accurate quotes.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
