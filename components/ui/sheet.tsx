"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import GunimiButton from "@/components/ui/GunimiButton";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        `
        fixed
        inset-0
        z-sheet

        bg-black/50

        backdrop-blur-sm

        data-[state=open]:animate-in
        data-[state=open]:fade-in-0

        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        `,
        className
      )}
      {...props}
    />
  );
}

type SheetContentProps = React.ComponentProps<
  typeof DialogPrimitive.Content
> & {
  showCloseButton?: boolean;
};

function SheetContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />

      <DialogPrimitive.Content
        className={cn(
          `
          fixed
          right-0
          top-0
          z-sheet

          flex
          h-full
          w-full
          max-w-2xl
          flex-col

          border-l
          border-white/[0.08]

          bg-[#050B18]

          shadow-[0_0_80px_rgba(124,58,237,0.12)]

          backdrop-blur-2xl

          outline-none

          duration-300

          data-[state=open]:animate-in
          data-[state=open]:slide-in-from-right

          data-[state=closed]:animate-out
          data-[state=closed]:slide-out-to-right
          `,
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <GunimiButton
              variant="secondary"
              className="
                absolute
                right-4
                top-4

                h-9
                w-9

                p-0
              "
            >
              <XIcon size={16} />
              <span className="sr-only">Close</span>
            </GunimiButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        `
        flex
        flex-col
        gap-1.5

        border-b
        border-white/[0.06]

        px-6
        py-5
        `,
        className
      )}
      {...props}
    />
  );
}

function SheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        `
        mt-auto

        flex
        items-center
        justify-end
        gap-3

        border-t
        border-white/[0.06]

        px-6
        py-4
        `,
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        `
        text-lg
        font-semibold

        tracking-tight

        text-white
        `,
        className
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn(
        `
        text-sm
        leading-relaxed

        text-zinc-400
        `,
        className
      )}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
