import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Section
//
// Semantic <section> wrapper for all genesis / landing
// surfaces. Handles vertical padding (120px desktop / 80px
// mobile), horizontal padding, overflow clipping, and optional
// ambient background effects.
//
// ambient="violet"  — faint radial violet glow (Proof Moment,
//                     Signal Engine sections)
// ambient="cool"    — cool blue-violet ambient (Business Memory
//                     section — reinforces permanence)
//
// Pair with SectionContainer inside to constrain content width.
//
// Usage:
// <Section id="proof" ambient="violet">
//   <SectionContainer maxWidth="text">
//     <SectionHeading ... />
//   </SectionContainer>
// </Section>
// ─────────────────────────────────────────────────────────────

type AmbientVariant = "none" | "violet" | "cool";

const ambientStyle: Record<AmbientVariant, React.CSSProperties> = {
  none:   {},
  violet: {
    background:
      "radial-gradient(ellipse 600px 400px at center 50%, rgba(109,91,255,0.04), transparent)",
  },
  cool:   {
    background:
      "radial-gradient(ellipse 800px 600px at 50% 0%, rgba(30,20,80,0.15), transparent)",
  },
};

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** Subtle ambient glow behind section content. Default: "none". */
  ambient?: AmbientVariant;
  /** Use min-h-dvh and center content vertically. For hero / CTA sections. */
  fullHeight?: boolean;
}

export function Section({
  children,
  id,
  className,
  ambient = "none",
  fullHeight = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden px-6 py-20 md:px-20 md:py-[120px]",
        fullHeight && "flex min-h-dvh flex-col items-center justify-center",
        className
      )}
      style={ambientStyle[ambient]}
    >
      {children}
    </section>
  );
}
