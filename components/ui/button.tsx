import * as React from "react";

import { Slot }
from "@radix-ui/react-slot";

import {
  cva,
  type VariantProps,
}
from "class-variance-authority";

import { cn }
from "@/lib/utils";

const buttonVariants = cva(

  `
  inline-flex
  items-center
  justify-center
  whitespace-nowrap
  rounded-2xl
  text-sm
  font-semibold
  transition-all
  duration-300
  disabled:pointer-events-none
  disabled:opacity-50
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-white/20
  `,

  {

    variants: {

      variant: {

        primary: `
          bg-white
          text-black
          hover:scale-[1.02]
          hover:bg-white/90
        `,

        secondary: `
          border
          border-white/10
          bg-white/5
          text-white
          hover:bg-white/10
        `,

        ghost: `
          bg-transparent
          text-white
          hover:bg-white/5
        `,

        danger: `
          bg-red-500
          text-white
          hover:bg-red-400
        `,

        outline: `
          border
          border-white/20
          bg-transparent
          text-white
          hover:bg-white/5
        `,
      },

      size: {

        default:
          "h-12 px-6 py-3",

        sm:
          "h-10 px-4 text-xs",

        lg:
          "h-14 px-8 text-base",

        icon:
          "h-12 w-12",

        "icon-sm":
          "h-8 w-8",
      },
    },

    defaultVariants: {

      variant:
        "primary",

      size:
        "default",
    },
  }
);

export interface ButtonProps

  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {

  asChild?: boolean;
}

function Button({

  className,

  variant,

  size,

  asChild = false,

  ...props

}: ButtonProps) {

  const Comp =
    asChild
      ? Slot
      : "button";

  return (

    <Comp

      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}

      {...props}

    />

  );
}

export {
  Button,
  buttonVariants,
};