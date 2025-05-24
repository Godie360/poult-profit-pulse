
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  textClassName = "",
  size = "md",
  withText = true,
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size]}`}>
        <img src="/lovable-uploads/3767062a-b994-4e6d-b932-eab2d9b334b3.png" alt="DG Poultry Logo" className="h-full w-full" />
      </div>
      {withText && <span className={`font-bold text-green-800 ${textClassName}`}>DG Poultry</span>}
    </Link>
  );
};
