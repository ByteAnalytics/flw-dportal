import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaseDeleteBannerProps {
  count: string;
  isDeleting: boolean;
  onDelete: () => void;
  compact?: boolean;
}

export const CaseDeleteBanner = ({
  count,
  isDeleting,
  onDelete,
  compact = false,
}: CaseDeleteBannerProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
        <span className="text-red-800 font-medium">
          {count} case(s) selected
        </span>
        <Button
          onClick={onDelete}
          disabled={isDeleting}
          className="h-[35px] bg-red-600 hover:bg-red-700 text-white text-sm"
        >
          {isDeleting ? "Deleting..." : "Delete Selected"}
          <Trash2 className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
      <div className="text-red-800">
        <span className="font-medium">{count}</span> case(s) selected
      </div>
      <Button
        onClick={onDelete}
        disabled={isDeleting}
        className="!h-[43px] bg-red-600 hover:bg-red-700 text-white"
      >
        {isDeleting ? "Deleting..." : "Delete Selected"}
        <Trash2 className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
