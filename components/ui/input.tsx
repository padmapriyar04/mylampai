import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full p-2 border-2 border-purple-100 focus:outline-none rounded-xl text-black placeholder:text-gray-400 font-semibold focus:-translate-y-1 focus:border-purple-300 focus:shadow-lg hover:shadow-sm hover:border-purple-300 transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
