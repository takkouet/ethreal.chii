import Link from "next/link";
import { Reveal } from "@/components/reveal";

export default function NotFound() {
  return (
    <Reveal as="section" className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-ink">
        page not found
      </h1>
      <p className="mt-4 text-muted">
        The page you&apos;re looking for wandered off somewhere small and cute.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer"
      >
        Back home
      </Link>
    </Reveal>
  );
}
