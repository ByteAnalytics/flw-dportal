import { CustomModal } from "../ui/custom-modal";
import SuccessModal, { ActionButtonProps } from "./SuccessModal";

const UserActionSuccessModal: React.FC<{
  isOpen: boolean;
  setIsOpen: () => void;
  title: string;
  description?: string;
  leftAction?: ActionButtonProps;
  rightAction?: ActionButtonProps;
}> = ({ isOpen, setIsOpen, title, description, leftAction, rightAction }) => {
  return (
    <CustomModal
      open={isOpen}
      setOpen={setIsOpen}
      width="max-w-[300px]"
      isAlert
    >
      <SuccessModal
        title={title}
        description={description}
        leftAction={leftAction}
        rightAction={rightAction}
      />
    </CustomModal>
  );
};

export default UserActionSuccessModal;
