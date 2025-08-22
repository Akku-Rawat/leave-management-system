import React from "react";
import clsx from "clsx";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-100 shadow-sm rounded-2xl",
        "p-5",               // sensible default padding
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
