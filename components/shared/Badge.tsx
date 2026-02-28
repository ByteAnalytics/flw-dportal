import { cn } from "@/lib/utils";
import { BadgeIcon } from "@/svg";

const getStatusBadge = (status: string) => {
  const isActive = status?.toLocaleLowerCase() === "active";

  return (
    <span
      className={cn(
        "capitalize px-2 py-1 rounded-full text-[12px] font-[500] flex items-center justify-center gap-2 w-fit",
        isActive
          ? "bg-[#D1FAE5] text-[#39D98A]"
          : "bg-[#FEE2E2] text-[#FF5C5C]",
      )}
    >
      <BadgeIcon fill={isActive ? "#39D98A" : "#FF5C5C"} />
      {status}
    </span>
  );
};

const getRoleBadge = (role: string) => {
  const isSuperUser = role?.toLocaleLowerCase() === "super user";
  const isAdmin = role?.toLocaleLowerCase() === "admin";

  return (
    <span
      className={cn(
        "capitalize px-2 py-1 rounded-full text-[12px] font-[500] flex items-center justify-center gap-2 w-fit",
        isSuperUser
          ? "bg-[#E0ECFF] text-[#0063F7]"
          : isAdmin
            ? "bg-[#FFFBDE] text-[#E5B800]"
            : "bg-[#F2F4F5] text-[#536066]",
      )}
    >
      <BadgeIcon
        fill={isSuperUser ? "#0063F7" : isAdmin ? "#E5B800 " : "#536066"}
      />
      {role}
    </span>
  );
};

export { getRoleBadge, getStatusBadge };
