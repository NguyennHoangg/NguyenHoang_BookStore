export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ELLIPSIS_START = "ellipsis-start" as const;
const ELLIPSIS_END = "ellipsis-end" as const;
type PageItem = number | typeof ELLIPSIS_START | typeof ELLIPSIS_END;

const getPages = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, ELLIPSIS_END, totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, ELLIPSIS_START, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    ELLIPSIS_START,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    ELLIPSIS_END,
    totalPages,
  ];
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPages(currentPage, totalPages);

  return (
    <div className="mt-10 flex justify-center gap-2">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Previous
      </button>

      {/* Pages */}
      {pages.map((page) =>
        page === ELLIPSIS_START || page === ELLIPSIS_END ? (
          <span key={page} className="px-3 py-1">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`rounded border px-3 py-1 ${
              currentPage === page ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}