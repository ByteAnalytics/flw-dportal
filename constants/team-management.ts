import { TableColumn } from "@/components/ui/custom-table";
import { AddAsEmailReceipient, UserRole } from "@/types";

export const usersTableColumns: TableColumn[] = [
  {
    key: "name",
    label: "Name",
    className: "min-w-[150px]",
  },
  {
    key: "lastLogin",
    label: "Last Login",
    className: "min-w-[150px]",
  },
  {
    key: "email",
    label: "Email Address",
    className: "min-w-[180px]",
  },
  {
    key: "role",
    label: "Role/Access",
    className: "min-w-[100px]",
  },
  {
    key: "status",
    label: "Status",
    className: "min-w-[100px]",
  },
  {
    key: "actions",
    label: "Actions",
    align: "right",
    className: "min-w-[100px]",
  },
];

export const roleOptions = Object.values(UserRole);

export const receipientOptions = [
  { label: "Yes", value: AddAsEmailReceipient.YES },
  { label: "No", value: AddAsEmailReceipient.NO },
];

export const ActivitiesTableColumn: TableColumn[] = [
  { key: "name", label: "Name", className: "min-w-[150px]" },
  { key: "timestamp", label: "Timestamp", className: "min-w-[150px]" },
  { key: "email", label: "Email Address", className: "min-w-[180px]" },
  { key: "role", label: "Role/Access", className: "min-w-[100px]" },
  { key: "status", label: "Status", className: "min-w-[100px]" },
  {
    key: "actions",
    label: "Actions",
    align: "left",
    className: "min-w-[100px]",
  },
];

export const PasswordChangeLogColumns: TableColumn[] = [
  { key: "timestamp", label: "Timestamp", className: "min-w-[150px]" },
  { key: "admin_name", label: "Admin Name", className: "min-w-[150px]" },
  { key: "user_name", label: "User Name", className: "min-w-[150px]" },
  { key: "admin_email", label: "Admin Email", className: "min-w-[180px]" },
  { key: "user_email", label: "User Email", className: "min-w-[180px]" },
  { key: "status", label: "Status", className: "min-w-[120px]" },
  { key: "ip_address", label: "IP Address", className: "min-w-[120px]" },
];

export const itemsPerPage = 10;
