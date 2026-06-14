"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminNav() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-4">
      <Link
        href="/admin"
        className="text-xl font-bold text-ink cursor-pointer"
      >
        Admin
      </Link>
      <Link
        href="/admin/products"
        className="text-muted hover:text-coral transition-colors duration-200 cursor-pointer"
      >
        Products
      </Link>
      <Link
        href="/admin"
        className="text-muted hover:text-coral transition-colors duration-200 cursor-pointer"
      >
        Orders
      </Link>
      <button
        type="button"
        onClick={logout}
        className="ml-auto rounded-full border border-border px-4 py-2 text-sm hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
      >
        Log out
      </button>
    </nav>
  );
}
