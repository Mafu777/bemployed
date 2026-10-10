"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconBriefcase, IconCap, IconBook, IconHome as IconAbout } from "@/components/Icons";

const TABS = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/jobs", label: "Jobs", Icon: IconBriefcase },
  { href: "/bursaries", label: "Bursaries", Icon: IconCap },
  { href: "/blog", label: "Advice", Icon: IconBook },
  { href: "/about", label: "About", Icon: IconAbout },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-[11px] font-semibold ${
              active ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}