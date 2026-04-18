import React from "react";

interface AvatarInitialsProps {
  firstName?: string;
  lastName?: string;
}

const AvatarInitials: React.FC<AvatarInitialsProps> = ({
  firstName = "",
  lastName = "",
}) => (
  <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
    <span className="text-[11px] font-[700] text-[#D97706]">
      {`${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`}
    </span>
  </div>
);

export default AvatarInitials;
