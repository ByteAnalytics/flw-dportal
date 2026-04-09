export const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-[12px] border border-gray-200 bg-[#F9FAFB] p-5">
    {children}
  </div>
);

export const InfoField = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[13px] font-medium text-gray-400">{label}</span>
    <span
      className={`text-[15px] font-bold text-gray-900 ${valueClassName ?? ""}`}
    >
      {value}
    </span>
  </div>
);
