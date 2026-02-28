"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";

interface IPagination {
  totalPageNumber?: number;
  totalCount?: number;
  itemsPerPage?: number;
  activePage: string;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

const NextPagination = () => (
  <div className="border text-sm rounded-md flex items-center gap-2 py-2 px-4 justify-center cursor-pointer">
    Next <ChevronRight className="w-4 h-4" />
  </div>
);

const PrevPagination = () => (
  <div className="border text-sm rounded-md flex items-center gap-2 py-2 px-4 justify-center cursor-pointer">
    <ChevronLeft className="w-4 h-4" /> Prev
  </div>
);

const pagination_Style = {
  nextLabel: <NextPagination />,
  previousLabel: <PrevPagination />,
  containerClassName:
    "border-t-2 flex text-xs w-full justify-center items-center flex-wrap bg-thick-purple-5  pb-1 pt-3",
  activeClassName: " bg-[#F9F5FF]",
  previousClassName: "w-fit px-2 me-auto",
  nextClassName: "w-fit px-2 ms-auto",
  pageClassName:
    "gap-2 px-4 py-2  text-sm cursor-pointer  rounded-lg text-center md:w-auto w-[1.5rem] text-thick-purple",
};

export const Pagination: React.FC<IPagination> = ({
  totalCount,
  totalPageNumber,
  itemsPerPage = 10,
  activePage,
  setPageNumber,
}) => {
  const handlePageClick = (event: any) => {
    const page_number = event.selected + 1;
    setPageNumber(page_number);
  };

  const pageCount = totalCount
    ? Math.ceil(totalCount / itemsPerPage)
    : Math.max(Math.floor(totalPageNumber ?? 1), 1);

  const initialPageIndex = activePage
    ? Math.max(parseInt(activePage, 10) - 1, 0)
    : 0;

  return (
    <div className="flex flex-wrap-reverse justify-end items-end mt-auto md:flex-wrap-nowrap gap-2 pb-4 pt-6">
      <ReactPaginate
        breakLabel="..."
        nextLabel={pagination_Style.nextLabel}
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        initialPage={initialPageIndex}
        disableInitialCallback={true}
        previousLabel={pagination_Style.previousLabel}
        renderOnZeroPageCount={null}
        marginPagesDisplayed={1}
        containerClassName={pagination_Style.containerClassName}
        activeClassName={pagination_Style.activeClassName}
        previousClassName={pagination_Style.previousClassName}
        nextClassName={pagination_Style.nextClassName}
        pageClassName={pagination_Style.pageClassName}
      />
    </div>
  );
};
