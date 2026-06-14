"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "./cart-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All items" },
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-stripe border-b border-border relative">
      {/* Welcome board (chiikawamarket.jp .welcome) — characters stick to nav bottom */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 hidden w-full max-w-6xl -translate-x-1/2 px-4 sm:px-6 lg:block">
        <div className="flex w-52 flex-col items-center">
          <Image
            src="/market/welcome.png"
            alt="Chiikawa, Hachiware and Usagi waving hello"
            width={241}
            height={129}
            className="h-auto w-44"
          />
        </div>
      </div>

      {/* Top row: spacer · logo wordmark · account/cart pills (balanced) */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-24 items-center justify-between gap-4">
          <span className="hidden flex-1 lg:block" aria-hidden="true" />

          <Link
            href="/"
            className="text-3xl sm:text-4xl font-extrabold text-coral cursor-pointer"
          >
            ethereal.chii
          </Link>

          <div className="flex flex-1 items-center justify-end gap-2">
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-soft hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              Account
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-soft hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-xs font-extrabold text-ink">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft hover:bg-pink-pale transition-colors duration-200 cursor-pointer md:hidden"
            >
              {open ? (
                <X className="h-5 w-5 text-ink" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5 text-ink" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Yellow nav bar (desktop) — matches chiikawamarket.jp */}
      <nav className="hidden md:block bg-yellow border-t border-border">
        <ul className="mx-auto max-w-6xl flex items-center justify-center gap-8 px-4 sm:px-6 py-3 text-md">
          {navLinks.map((l) => (
            <li key={l.label} className="topMenu">
              <Link
                href={l.href}
                className="text-ink hover:text-coral transition-colors duration-200 cursor-pointer"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-yellow border-t border-border">
          <ul className="mx-auto max-w-6xl flex flex-col px-4 py-2">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 font-bold text-ink hover:bg-pink transition-colors duration-200 cursor-pointer"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
