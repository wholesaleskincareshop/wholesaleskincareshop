import React from "react";

interface Props {
  currentPage: number;
  pageCount: number;
  setCurrentPage: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  pageCount,
  setCurrentPage,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        // onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        &lt;
      </button>
      <span className="text-sm font-semibold">
        Page {currentPage} of {pageCount}
      </span>
      <button
        // onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
        disabled={currentPage === pageCount}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
