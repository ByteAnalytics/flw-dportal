import { cn } from "@/lib/utils";
import CustomButton from "../ui/custom-button";
import { CustomModal } from "../ui/custom-modal";
import { ActionButtonProps } from "./SuccessModal";
import FailedIcon from "@/public/assets/icon/failed-icon.svg";
import { CustomImage } from "../ui/custom-image";

const AlertModal: React.FC<{
  isOpen: boolean;
  displayIcon?: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  description?: string;
  leftAction?: ActionButtonProps;
  rightAction?: ActionButtonProps;
  children?: React.ReactNode;
}> = ({
  isOpen,
  setIsOpen,
  description,
  leftAction,
  rightAction,
  displayIcon = false,
  children,
}) => {
  return (
    <CustomModal
      open={isOpen}
      setOpen={setIsOpen}
      width="max-w-[400px]"
      isAlert
    >
      <div className="flex flex-col items-center justify-center pt-8 px-6">
        {displayIcon && <CustomImage src={FailedIcon} style="w-20 h-20 mb-4" />}

        {description && (
          <p className="text-[18px] font-[600] text-center mb-8">
            {description}
          </p>
        )}
        {children}
        <div className="flex gap-6 w-full mt-auto">
          {leftAction && (
            <CustomButton
              title={leftAction.label}
              onClick={leftAction.onClick}
              textClassName="!text-[14px] font-[600] text-[#5B5F5E]"
              className={cn(
                "flex-1 rounded-[20px]  border bg-white cursor-pointer",
                leftAction.className,
              )}
            />
          )}
          {rightAction && (
            <CustomButton
              title={rightAction.label}
              onClick={rightAction.onClick}
              disabled={rightAction.disabled}
              isLoading={rightAction.isLoading}
              textClassName="!text-[14px] font-[600]"
              className={cn(
                "flex-1 rounded-[20px] bg-[#006F37] cursor-pointer",
                rightAction.className,
              )}
            />
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default AlertModal;
