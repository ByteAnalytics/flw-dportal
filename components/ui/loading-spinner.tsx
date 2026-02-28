export const LoadingSpinner = ({ loadingText }: { loadingText?: string }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col gap-2 items-center">
      <div className="w-8 h-8 border-2 border-white/30 border-t-black rounded-full animate-spin" />
      {loadingText && (
        <p className="text-sm text-gray-500 text-center">{loadingText}</p>
      )}
    </div>
  </div>
);
