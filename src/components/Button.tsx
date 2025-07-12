"use client";

import React from "react";
import Link from "next/link";
import localFont from "next/font/local";

const body_Font = localFont({
  src: "../app/fonts/GeneralSans/fonts/GeneralSans-Regular.woff",
});

interface ButtonProps {
  text: string;
  onClick?: () => void;
  href?: string;
  color?: string;
  border?: string;
  backgroundColor?: string;
  isLink?: boolean;
  additionalClasses?: string;
  type?: any;
  disabled?: any;
  icon?: React.ReactNode; // Add an icon prop of type ReactNode
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type,
  disabled,
  href,
  color = "text-white",
  border = "border",
  backgroundColor = "bg-primary",
  isLink = false,
  additionalClasses = "",
  icon, // Destructure the icon prop
}) => {
  const commonClasses = `relative font-semibold overflow-hidden group ${backgroundColor} ${color} ${border} ${body_Font.className} px-[24px] py-[10px] font-medium  text-[14px] sm:text-[16px]  rounded-full cursor-pointer text-center ${additionalClasses}`;

  const hoverEffectClasses =
    "absolute inset-0 bg-black g -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out";

  const content = (
    <>
      <span className={hoverEffectClasses} aria-hidden="true"></span>
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span>{icon}</span>} {/* Render icon if provided */}
        {text}
      </span>
    </>
  );

  if (isLink && href) {
    return (
      <Link href={href} passHref className={commonClasses} onClick={onClick}>
        <p>{content}</p>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={commonClasses}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;
