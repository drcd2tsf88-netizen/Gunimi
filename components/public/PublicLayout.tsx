import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

// ─────────────────────────────────────────────────────────────
// PublicLayout — Shared shell for all public marketing pages.
// Wraps with consistent navbar, footer, and deep space bg.
// ─────────────────────────────────────────────────────────────

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05060A] text-white">
      <LandingNavbar />
      {children}
      <LandingFooter />
    </div>
  );
}
