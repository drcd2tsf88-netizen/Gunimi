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
      <ol className="flex items-center gap-1.5 text-[11px] text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight size={10} className="shrink-0 text-zinc-700" aria-hidden />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-zinc-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-zinc-300" : ""}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
