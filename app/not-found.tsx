import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-8xl font-bold text-border">404</p>
      <h1 className="mt-4 text-2xl font-bold text-text-primary">
        Page not found
      </h1>
      <p className="mt-2 text-text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
