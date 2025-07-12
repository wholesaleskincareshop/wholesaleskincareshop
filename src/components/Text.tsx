import React from "react";
import localFont from "next/font/local";

const body_Font_Medium = localFont({
  src: "../app/fonts/GeneralSans/fonts/GeneralSans-Regular.woff",
});

const body_Font_Regular = localFont({
  src: "../app/fonts/GeneralSans/fonts/GeneralSans-Regular.woff",
});

const body_Font_Light = localFont({
  src: "../app/fonts/GeneralSans/fonts/GeneralSans-Light.woff",
});

const body_Font_Bold = localFont({
  src: "../app/fonts/GeneralSans/fonts/GeneralSans-Bold.woff",
});

const body_p_regular = localFont({
  src: "../app/fonts/GeneralSans/fonts/GeneralSans-Regular.woff",
});

const body_p_light = localFont({
  src: "../app/fonts/GeneralSans/fonts/GeneralSans-Light.woff",
});

// Header Component
export const Header1: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h1
    className={`text-[24px] sm:text-[32px]   ${body_Font_Medium.className} ${className}`}
  >
    {children}
  </h1>
);

export const Header1Plus: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h1
    className={`text-[24px] sm:text-[32px] ${body_Font_Regular.className} ${className}`}
  >
    {children}
  </h1>
);

export const Header2: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h2
    className={`text-[16px] sm:text-[20px]  font-bold ${body_Font_Bold.className} ${className}`}
  >
    {children}
  </h2>
);

export const Header3: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h3
    className={`text-[20px] sm:text-[24px] md:text-[32px]   font-bold ${body_Font_Regular.className} ${className}`}
  >
    {children}
  </h3>
);

export const Header4: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h4
    className={`text-[18px] sm:text-[24px]    font-bold ${body_Font_Regular.className} ${className}`}
  >
    {children}
  </h4>
);

export const Header5: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h4
    className={`text-[14px] sm:text-[14px]    font-bold ${body_Font_Medium.className} ${className}`}
  >
    {children}
  </h4>
);

export const HeaderAny: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h4 className={` ${body_Font_Medium.className} ${className}`}>{children}</h4>
);

// Paragraph Component
export const Paragraph1: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h1
    className={`text-[14px] sm:text-[16px] leading-[24px] sm:leading-[28px] md:leading-[32px] lg:leading-[36px] xl:leading-[38px] 2xl:leading-[40px]  ${body_p_regular.className} ${className}`}
  >
    {children}
  </h1>
);

export const Paragraph2: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <p
    className={`text-[14px] sm:text-[16px] leading-[24px] sm:leading-[28px] md:leading-[32px] lg:leading-[36px] xl:leading-[38px] 2xl:leading-[40px]   ${body_p_regular.className} ${className}`}
  >
    {children}
  </p>
);

export const Paragraph3: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <p
    className={`  leading-[24px] sm:leading-[28px] md:leading-[32px] lg:leading-[36px] xl:leading-[38px] 2xl:leading-[40px]   ${body_p_light.className} ${className}`}
  >
    {children}
  </p>
);

export const ParagraphLink1: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h1
    className={`text-[14px] sm:text-[16px]   leading-[24px] sm:leading-[28px] md:leading-[32px] lg:leading-[36px] xl:leading-[38px] 2xl:leading-[40px] hover:scale-105 transition-transform duration-300  ${body_Font_Regular.className} ${className}`}
  >
    {children}
  </h1>
);

export const ParagraphLink2: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h1
    className={`   hover:scale-105 transition-transform duration-300 text-[13px] sm:text-[14px] ${body_Font_Light.className} ${className}`}
  >
    {children}
  </h1>
);
