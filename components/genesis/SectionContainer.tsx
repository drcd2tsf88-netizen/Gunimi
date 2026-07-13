import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// SectionContainer
//
// Content width constrainer for genesis sections. Centers
// content horizontally within its parent and enforces the
// reading column or layout max-width from GUNIMI_VISUAL_TOKENS.
//
// text:    640px — single reading column (body copy, headings)
// content: 1024px — two-column layouts, features, cards
// wide:    1280px — full layout width, workspace previews
//
// Usage:
// <Section>
//   <SectionContainer maxWidth="text">
//     <SectionHeading eyebrow="..." headline="..." />
//   </SectionContainer>
// </Section>
// ─────────────────────────────────────────────────────────────

type MaxWidth = "text" | "content" | "wide";

const maxWidthClass: Record<MaxWidth, string> = {
  text:    "max-w-[640px]",
  content: "max-w-[1024px]",
  wide:    "max-w-[1280px]",
};

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: MaxWidth;
}

export function SectionContainer({
  children,
  className,
  maxWidth = "text",
}: SectionContainerProps) {
  return (
    <div className={cn("mx-auto w-full", maxWidthClass[maxWidth], className)}>
      {children}
    </div>
  );
}
