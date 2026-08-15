"use client";

import { Suspense } from "react";
import JelajahContent from "@/features/restaurants/jelajah-content";

export default function JelajahPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-[#6d7a72]">
            <div className="h-8 w-8 rounded-full border-4 border-[#006948]/20 border-t-[#006948] animate-spin" />
            <span className="text-sm">Memuat daftar restoran...</span>
          </div>
        </div>
      }
    >
      <JelajahContent />
    </Suspense>
  );
}
