"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ReusableDropdownProps<T = string> {
  items: T[];
  disabled?: boolean;
  placeholder?: string;
  value?: T | null;
  onSelect: (item: T) => void;
  className?: string;
}

export function ReusableDropdown<T extends string>({
  items,
  disabled = false,
  placeholder = "Select",
  value = null,
  onSelect,
  className,
}: ReusableDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item: T) => {
    onSelect(item);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!disabled) {
      setOpen(isOpen);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <div
          className={`input-field flex cursor-pointer text-foreground ${className} items-center justify-between whitespace-nowrap ${
            open ? "border-neutral-darker" : ""
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {value || placeholder}
          <ChevronDown
            size={16}
            className={`ml-2 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-popover shadow-neutral/50 z-40 max-h-70 min-w-(--radix-dropdown-menu-trigger-width) overflow-y-auto rounded-md border-none p-1 shadow-md">
        {items.map((item) => (
          <DropdownMenuItem
            key={item}
            onSelect={() => handleSelect(item)}
            className="hover:bg-muted cursor-pointer rounded-sm px-4 py-2 capitalize transition-colors duration-300 outline-none"
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
