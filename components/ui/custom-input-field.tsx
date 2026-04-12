"use client";

import {
  Controller,
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
  FieldPath,
} from "react-hook-form";
import { memo, ReactNode, useState } from "react";
import Image from "next/image";
import { Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormFieldType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = string | { label: string; value: string };

interface CustomProps<T extends FieldValues> {
  control: Control<T>;
  fieldType: FormFieldType;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
  options?: Option[];
  iconSrc?: string;
  iconAlt?: string;
  dateFormat?: string;
  showTimeSelect?: boolean;
  className?: string;
  renderSkeleton?: (field: ControllerRenderProps<T, FieldPath<T>>) => ReactNode;
  // New props for number input
  min?: number;
  max?: number;
  step?: number;
}

interface RenderFieldProps<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  props: CustomProps<T>;
}

const InputWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "border border-[#e5e5e5] dark:border-neutral-800 dark:bg-transparent px-4 rounded-[8px] h-[48px] overflow-hidden flex items-center gap-x-4 focus-within:border-[#FDC316]",
      className,
    )}
  >
    {children}
  </div>
);

const RenderField = <T extends FieldValues>({
  field,
  props,
}: RenderFieldProps<T>) => {
  const {
    fieldType,
    disabled,
    placeholder,
    options,
    className,
    icon,
    iconSrc,
    iconAlt,
    min,
    max,
    step,
  } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const renderIcon = () =>
    typeof iconSrc === "string" ? (
      <Image src={iconSrc} height={24} width={24} alt={iconAlt || "icon"} />
    ) : (
      icon
    );

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <InputWrapper className={className}>
          <input
            {...field}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full h-full bg-transparent text-[#171717] dark:text-white text-[12px] placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none"
          />
          {renderIcon()}
        </InputWrapper>
      );

    case FormFieldType.EMAIL:
      return (
        <InputWrapper className={className}>
          <input
            {...field}
            type="email"
            disabled={disabled}
            placeholder={placeholder}
            className="w-full h-full bg-transparent text-[#171717] dark:text-white text-[12px] placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none"
          />
          {renderIcon()}
        </InputWrapper>
      );

    case FormFieldType.PASSWORD:
      return (
        <InputWrapper className={className}>
          <input
            {...field}
            type={isPasswordVisible ? "text" : "password"}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full h-full bg-transparent text-[#171717] dark:text-white text-[12px] placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none"
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <Eye className="text-[#A3A3A3]" size={20} />
            ) : (
              <EyeClosed className="text-[#A3A3A3]" size={20} />
            )}
          </button>
        </InputWrapper>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <InputWrapper className={className}>
          <input
            {...field}
            type="tel"
            disabled={disabled}
            placeholder={placeholder}
            className="w-full h-full text-[12px] bg-transparent text-[#171717] dark:text-white placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none"
          />
        </InputWrapper>
      );

    case FormFieldType.NUMBER:
      return (
        <InputWrapper className={className}>
          <input
            {...field}
            type="number"
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full h-full text-[12px] bg-transparent text-[#171717] dark:text-white placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none"
            onChange={(e) => {
              const value = e.target.value;
              // Handle empty value
              if (value === "") {
                field.onChange("");
                return;
              }

              const numValue = parseFloat(value);

              // Apply min constraint
              if (min !== undefined && numValue < min) {
                field.onChange(min);
                return;
              }

              // Apply max constraint
              if (max !== undefined && numValue > max) {
                field.onChange(max);
                return;
              }

              field.onChange(numValue);
            }}
          />
          {renderIcon()}
        </InputWrapper>
      );

    case FormFieldType.DATE:
      return (
        <InputWrapper className={className}>
          <input
            {...field}
            suppressHydrationWarning
            type="date"
            disabled={disabled}
            placeholder={placeholder}
            className="w-full h-full text-[12px] bg-transparent text-[#171717] dark:text-white text-[13px] placeholder:text-[#A3A3A3] dark:placeholder:text-neutral-400 placeholder:font-light outline-none"
          />
          {renderIcon()}
        </InputWrapper>
      );

    case FormFieldType.TEXTAREA:
      return (
        <textarea
          {...field}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-[12px] min-h-[9rem] border border-[#f5f5f5] md:border-[#e5e5e5] dark:border-neutral-800 rounded-lg bg-white dark:bg-transparent overflow-y-auto resize-none text-[#404040] dark:text-white placeholder:text-[#a3a3a3] dark:placeholder:text-neutral-400 placeholder:font-normal outline-none"
        />
      );

    case FormFieldType.SELECT:
      return (
        <InputWrapper className={className}>
          <Select
            onValueChange={field.onChange}
            value={field.value || ""}
            disabled={disabled}
          >
            <SelectTrigger className="w-full border-none bg-none h-12 p-0 dark:border-neutral-800 rounded-lg text-left dark:bg-transparent focus:ring-0 focus:ring-none">
              <SelectValue placeholder={placeholder || "Select an option..."} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => {
                const value =
                  typeof option === "string" ? option : option.value;
                const label =
                  typeof option === "string" ? option : option.label;
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </InputWrapper>
      );
    case FormFieldType.MULTI_SELECT:
      return (
        <InputWrapper
          className={cn(className, "w-full p-2 h-fit overflow-none")}
        >
          <div className="w-full flex flex-wrap gap-1 py-1 overflow-x-auto">
            {options?.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const label = typeof option === "string" ? option : option.label;
              const selected: string[] = Array.isArray(field.value)
                ? field.value
                : [];
              const isSelected = selected.includes(value);

              return (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    const next = isSelected
                      ? selected.filter((v) => v !== value)
                      : [...selected, value];
                    field.onChange(next);
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-medium border transition-colors whitespace-nowrap",
                    isSelected
                      ? "bg-[#1E6FB8] text-white border-[#1E6FB8]"
                      : "bg-white text-[#404040] border-[#e5e5e5] hover:border-[#1E6FB8]",
                    disabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </InputWrapper>
      );

    default:
      return null;
  }
};

const CustomFormField = <T extends FieldValues>(props: CustomProps<T>) => {
  const { control, fieldType, label, name } = props;

  return (
    <div className="flex flex-col gap-y-2">
      {fieldType !== FormFieldType.CHECKBOX && label && (
        <label className="text-sm capitalize font-[500] text-InfraSoftBlack dark:text-white">
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <RenderField field={field} props={props} />
            {fieldState.error && (
              <p className="text-sm font-normal text-red-400">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default memo(CustomFormField) as typeof CustomFormField;
