import { LoaderCircle } from "lucide-react";
import React from "react";
import Link from "next/link";

export type Variant =
  | "primary"
  | "neutral"
  | "outline"
  | "ghost"
  | "danger"
  | "black";
export type IconPosition = "start" | "end";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  variant?: Variant;
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  external?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover text-neutral-light shadow-sm shadow-neutral disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed",
  neutral:
    "bg-neutral-light hover:bg-neutral text-neutral-darker shadow-sm shadow-neutral disabled:opacity-60 disabled:text-neutral disabled:pointer-events-none disabled:cursor-not-allowed",
  outline:
    "bg-transparent border border-neutral text-neutral-dark hover:bg-neutral/10 disabled:bg-transparent disabled:border-neutral/50 disabled:text-neutral disabled:pointer-events-none disabled:cursor-not-allowed",
  ghost:
    "bg-transparent hover:bg-neutral-dark/10 disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed",
  danger:
    "bg-danger hover:bg-danger-dark text-neutral-light shadow-sm shadow-neutral disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed",
  black:
    "bg-black text-white shadow-sm shadow-neutral disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed",
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "primary",
  text,
  icon,
  iconPosition = "start",
  isLoading = false,
  loadingText,
  disabled = false,
  className = "",
  href,
  external = false,
  ...rest
}) => {
  if (!text && !icon) {
    return null;
  }

  const classes = `flex capitalize items-center justify-center ${
    text && icon ? "gap-2" : ""
  } px-4 py-2  rounded-xl font-medium transition-all duration-300 active:scale-95 ${
    variantClasses[variant]
  } ${className}`;

  const iconElement = icon && <span>{icon}</span>;

  const content = isLoading ? (
    <div className="flex items-center gap-2">
      <LoaderCircle className="h-4 w-4 animate-spin" />
      <span>{loadingText ?? "Processing..."}</span>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      {iconPosition === "start" && iconElement}
      {text && <span>{text}</span>}
      {iconPosition === "end" && iconElement}
    </div>
  );

  if (href) {
    if (external) {
      return (
        <Link
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </Link>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
};

export { Button };
