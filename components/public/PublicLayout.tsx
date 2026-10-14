import { GenesisNavbar } from "@/components/genesis";
import LandingFooter from "@/components/landing/LandingFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020307] text-white">
      <GenesisNavbar />
      {children}
      <LandingFooter />
    </div>
  );
}
