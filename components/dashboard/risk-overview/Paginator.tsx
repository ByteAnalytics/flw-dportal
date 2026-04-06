import { ChevronLeft, ChevronRight } from "lucide-react";

const Paginator = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600">
      Page {currentPage} of {totalPages}
    </span>
    <div className="flex items-center gap-2">
      <ChevronLeft
        className={`cursor-pointer ${currentPage === 1 ? "opacity-40" : ""}`}
        onClick={() => currentPage > 1 && onPrev()}
      />
      <ChevronRight
        className={`cursor-pointer ${currentPage === totalPages ? "opacity-40" : ""}`}
        onClick={() => currentPage < totalPages && onNext()}
      />
    </div>
  </div>
);

export default Paginator;
