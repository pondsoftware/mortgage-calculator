import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-sky-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">
        Page not found
      </h2>
      <p className="mt-2 text-gray-600 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 transition"
      >
        Back to Mortgage Calculator
      </Link>
    </div>
  );
}
