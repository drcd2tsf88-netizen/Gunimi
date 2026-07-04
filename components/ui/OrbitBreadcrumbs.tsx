import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type OrbitBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function OrbitBreadcrumbs({ items }: OrbitBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-[11px] text-[#9AA3B2]/50">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight size={10} className="shrink-0 text-[#9AA3B2]/25" aria-hidden />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors duration-200 hover:text-[#C8CDD8]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-[#C8CDD8]" : ""}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
