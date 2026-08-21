"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Gossip Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#0D100B] text-[#F5F5EF] p-6 font-sans">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-rose-400 mb-2">
            Critical Application Error
          </h2>
          <p className="text-sm text-[#B7B8A9] mb-6">
            A system-level error occurred. Click below to re-initialize the application.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-lg bg-[#31321D] text-[#F5F5EF] font-semibold text-sm hover:bg-[#363824] transition-colors"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
