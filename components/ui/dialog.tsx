"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import OrbitButton from "@/components/ui/OrbitButton";

function Dialog(
  props: React.ComponentProps<
    typeof DialogPrimitive.Root
  >
) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
    />
  );
}

function DialogTrigger(
  props: React.ComponentProps<
    typeof DialogPrimitive.Trigger
  >
) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...props}
    />
  );
}

function DialogPortal(
  props: React.ComponentProps<
    typeof DialogPrimitive.Portal
  >
) {
  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      {...props}
    />
  );
}

function DialogClose(
  props: React.ComponentProps<
    typeof DialogPrimitive.Close
  >
) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...props}
    />
  );
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Overlay
>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        `
        fixed
        inset-0

        z-50

        bg-black/40

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

type DialogContentProps =
  React.ComponentProps<
    typeof DialogPrimitive.Content
  > & {
    showCloseButton?: boolean;
  };

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  const t =
    useTranslations();

  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          `
          fixed
          left-1/2
          top-1/2

          z-50

          w-full
          max-w-[calc(100%-2rem)]

          -translate-x-1/2
          -translate-y-1/2

          rounded-2xl

          border
          border-white/[0.08]

          bg-white/[0.03]

          p-6

          text-white

          backdrop-blur-2xl

          shadow-[0_0_40px_rgba(124,58,237,0.10)]

          outline-none

          sm:max-w-2xl

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
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            asChild
          >
            <OrbitButton
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
              <XIcon
                size={16}
              />

              <span
                className="
                  sr-only
                "
              >
                {t(
                  "common.close"
                )}
              </span>
            </OrbitButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        `
        flex
        flex-col
        gap-2

        text-left
        `,
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        `
        flex
        flex-col-reverse
        gap-2

        sm:flex-row
        sm:justify-end
        `,
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Title
>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        `
        text-xl
        font-semibold

        tracking-tight
        `,
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<
  typeof DialogPrimitive.Description
>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
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
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};