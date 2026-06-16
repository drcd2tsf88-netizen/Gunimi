"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import {
  CaretDownIcon,
  CaretUpIcon,
  CheckIcon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

function Select(
  props: React.ComponentProps<
    typeof SelectPrimitive.Root
  >
) {
  return (
    <SelectPrimitive.Root
      data-slot="select"
      {...props}
    />
  );
}

function SelectGroup(
  props: React.ComponentProps<
    typeof SelectPrimitive.Group
  >
) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      {...props}
    />
  );
}

function SelectValue(
  props: React.ComponentProps<
    typeof SelectPrimitive.Value
  >
) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.Trigger
>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        `
        flex
        h-12
        w-full

        items-center
        justify-between

        rounded-xl

        border
        border-white/[0.08]

        bg-white/[0.025]

        px-4

        text-sm
        text-white

        backdrop-blur-2xl

        transition-all
        duration-300

        hover:border-white/[0.12]

        focus:border-violet-500/30
        focus:bg-white/[0.04]

        focus:outline-none

        disabled:cursor-not-allowed
        disabled:opacity-50

        data-[placeholder]:text-zinc-500

        [&_svg]:shrink-0
        `,
        className
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon
        asChild
      >
        <CaretDownIcon
          size={16}
          className="
            text-zinc-500
          "
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.Content
>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          `
          relative

          z-50

          overflow-hidden

          rounded-2xl

          border
          border-white/[0.08]

          bg-[#0b0b10]

          text-white

          backdrop-blur-2xl

          shadow-[0_0_40px_rgba(124,58,237,0.10)]

          data-[state=open]:animate-in
          data-[state=open]:fade-in-0
          data-[state=open]:zoom-in-95

          data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0
          data-[state=closed]:zoom-out-95
          `,
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />

        <SelectPrimitive.Viewport
          className="
            p-1
          "
        >
          {children}
        </SelectPrimitive.Viewport>

        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.Label
>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        `
        px-3
        py-2

        text-xs
        uppercase

        tracking-[0.18em]

        text-zinc-500
        `,
        className
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.Item
>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        `
        relative

        flex
        w-full

        cursor-default
        items-center

        gap-2

        rounded-xl

        py-2.5
        pl-3
        pr-8

        text-sm
        text-white

        outline-none

        transition-all
        duration-200

        data-[highlighted]:bg-white/[0.08]

        data-[state=checked]:bg-white/[0.12]

        data-disabled:pointer-events-none
        data-disabled:opacity-50
        `,
        className
      )}
      {...props}
    >
      <span
        className="
          pointer-events-none

          absolute
          right-3

          flex
          items-center
          justify-center
        "
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon
            size={14}
          />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.Separator
>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        `
        my-1
        h-px

        bg-white/[0.08]
        `,
        className
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.ScrollUpButton
>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        `
        flex
        items-center
        justify-center

        bg-[#0b0b10]

        py-1
        `,
        className
      )}
      {...props}
    >
      <CaretUpIcon
        size={14}
      />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.ScrollDownButton
>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        `
        flex
        items-center
        justify-center

        bg-[#0b0b10]

        py-1
        `,
        className
      )}
      {...props}
    >
      <CaretDownIcon
        size={14}
      />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};