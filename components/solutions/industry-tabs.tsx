"use client";

import { motion } from "framer-motion";
import { industries, type IndustrySlug } from "@/data/solutions-config";

interface Props { selected: IndustrySlug; onSelect: (slug: IndustrySlug) => void; }

export default function IndustryTabs({ selected, onSelect }: Props) {
  return (
    <div className="w-full overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
      <div className="flex gap-1.5 min-w-max px-1 py-1">
        {industries.map((ind) => {
          const isActive = ind.slug === selected;
          return (
            <button key={ind.slug} onClick={() => onSelect(ind.slug)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 border ${isActive ? "text-white border-transparent" : "text-[#475569] border-transparent hover:text-[#0f172a] hover:bg-[#f1f5f9]"}`}>
              {isActive && (
                <motion.div layoutId="industry-tab-bg" className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--industry-accent, #2563eb)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10">{ind.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}