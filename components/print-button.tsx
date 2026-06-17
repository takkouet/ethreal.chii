"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print receipt
    </button>
  );
}
