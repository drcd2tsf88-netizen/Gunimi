import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";

export async function V13Footer() {
  const t = await getTranslations("landing.v13.footer");

  return (
    <footer className="border-t border-[rgba(255,255,255,.04)] px-6 md:px-10 py-6">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <Link href="/" aria-label="Gunimi" className="flex items-center gap-[9px]">
          <div
            className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(109,91,255,.07)",
              border: "1px solid rgba(109,91,255,.15)",
            }}
          >
            <Image src="/icon.svg" alt="" width={12} height={12} />
          </div>
          <span className="text-[13px] font-extrabold tracking-[-0.05em] text-[#F0F2FA]">
            Gunimi
          </span>
        </Link>

        <p className="text-[11px] text-[rgba(61,69,88,.7)]">{t("copyright")}</p>
      </div>
    </footer>
  );
}
