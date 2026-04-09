const ReportCalculateError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
      <svg
        className="w-6 h-6 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z"
        />
      </svg>
    </div>
    <div>
      <p className="text-[15px] font-semibold text-gray-800">
        Unable to load report
      </p>
      <p className="text-[13px] text-gray-400 mt-1">
        Something went wrong while calculating the case. Please try again.
      </p>
    </div>
    <button
      onClick={onRetry}
      className="text-[13px] font-semibold text-white bg-[#1A5FA8] px-5 py-2 rounded-[8px] hover:opacity-90"
    >
      Retry
    </button>
  </div>
);

export default ReportCalculateError;
