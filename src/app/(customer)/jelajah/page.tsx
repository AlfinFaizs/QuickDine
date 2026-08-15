"use client";

import { Suspense } from "react";
import JelajahContent from "@/features/restaurants/jelajah-content";
import { JelajahGridSkeleton } from "@/features/restaurants/resto-card-skeleton";

export default function JelajahPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <JelajahGridSkeleton />
        </div>
      }
    >
      <JelajahContent />
    </Suspense>
  );
}
