"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface CatalogItem {
  id: string;
  name: string;
  unit: string;
  keywords: string[];
  basePrice: number;
  promoPrice: number | null;
}

interface ParsedLine {
  id: string;
  raw: string;
  itemName: string;
  unit: string;
  qty: number;
  unitPrice: number;
  isPromo: boolean;
  matched: boolean;
}

const CATALOG: CatalogItem[] = [
  { id: "marlboro", name: "Marlboro Reds", unit: "case", keywords: ["marlboro"], basePrice: 62.0, promoPrice: 57.5 },
  { id: "newport", name: "Newport Menthols", unit: "case", keywords: ["newport"], basePrice: 64.0, promoPrice: 59.0 },
  { id: "redbull", name: "Red Bull", unit: "case", keywords: ["red bull", "redbull"], basePrice: 38.4, promoPrice: null },
  { id: "monster", name: "Monster Energy", unit: "case", keywords: ["monster"], basePrice: 34.8, promoPrice: 31.99 },
  { id: "budlight", name: "Bud Light", unit: "case", keywords: ["bud light", "budlight"], basePrice: 27.6, promoPrice: 24.99 },
  { id: "swisher", name: "Swisher Sweets", unit: "box", keywords: ["swisher"], basePrice: 18.0, promoPrice: null },
];

const DEFAULT_INPUT =
  "2 cases Marlboro reds, promo pricing this week, 3 cases Red Bull, 1 box Swisher Sweets, 2 cases Bud Light on deal";

const PROMO_WORDS = ["promo", "deal", "on sale", "special"];

function parseOrder(text: string): ParsedLine[] {
  const clauses = text
    .split(/[,\n]/)
    .map((c) => c.trim())
    .filter(Boolean);

  const lines: ParsedLine[] = [];

  clauses.forEach((clause, idx) => {
    const lower = clause.toLowerCase();
    const promoFlagHere = PROMO_WORDS.some((w) => lower.includes(w));
    const catalogMatch = CATALOG.find((c) => c.keywords.some((k) => lower.includes(k)));

    if (!catalogMatch) {
      if (promoFlagHere && lines.length > 0) {
        lines[lines.length - 1].isPromo = true;
        lines[lines.length - 1].unitPrice =
          CATALOG.find((c) => c.name === lines[lines.length - 1].itemName)?.promoPrice ??
          lines[lines.length - 1].unitPrice;
      }
      return;
    }

    const qtyMatch = lower.match(/(\d+)/);
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
    const isPromo = promoFlagHere && catalogMatch.promoPrice !== null;
    const unitPrice = isPromo ? catalogMatch.promoPrice! : catalogMatch.basePrice;

    lines.push({
      id: `${catalogMatch.id}-${idx}`,
      raw: clause,
      itemName: catalogMatch.name,
      unit: catalogMatch.unit,
      qty,
      unitPrice,
      isPromo,
      matched: true,
    });
  });

  return lines;
}

export default function PepperOrderAgentDemo({ accentColor, bgDark }: Props) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [lines, setLines] = useState<ParsedLine[] | null>(null);
  const [parsing, setParsing] = useState(false);

  function handleParse() {
    setParsing(true);
    setLines(null);
    setTimeout(() => {
      setLines(parseOrder(input));
      setParsing(false);
    }, 550);
  }

  const total = lines?.reduce((sum, l) => sum + l.qty * l.unitPrice, 0) ?? 0;
  const promoSavings =
    lines?.reduce((sum, l) => {
      const catalogItem = CATALOG.find((c) => c.name === l.itemName);
      if (!l.isPromo || !catalogItem) return sum;
      return sum + (catalogItem.basePrice - l.unitPrice) * l.qty;
    }, 0) ?? 0;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-1">Order Agent, c-store edition</p>
          <p className="text-white/35 text-[10px] mb-4">Paste a messy order the way a store owner would text it in</p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/30 mb-3 outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />

          <button
            onClick={handleParse}
            disabled={parsing}
            className="text-xs font-semibold px-4 py-2.5 rounded-xl mb-5 disabled:opacity-50"
            style={{ background: accentColor, color: bgDark }}
          >
            {parsing ? "Parsing order…" : "Parse order →"}
          </button>

          <AnimatePresence mode="wait">
            {lines && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-1.5 mb-4">
                  {lines.map((line, i) => (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-lg px-3 py-2.5 flex items-center justify-between gap-3"
                      style={{
                        background: line.isPromo ? `${accentColor}16` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${line.isPromo ? accentColor + "66" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-white text-xs font-medium">
                          {line.qty} {line.unit}
                          {line.qty > 1 ? "s" : ""} — {line.itemName}
                        </p>
                        <p className="text-white/30 text-[9px] mt-0.5 truncate">&ldquo;{line.raw}&rdquo;</p>
                      </div>
                      <div className="text-right shrink-0">
                        {line.isPromo && (
                          <span
                            className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded block mb-0.5"
                            style={{ background: accentColor, color: bgDark }}
                          >
                            Promo
                          </span>
                        )}
                        <p className="text-white text-xs font-mono tabular-nums">
                          ${(line.qty * line.unitPrice).toFixed(2)}
                        </p>
                        <p className="text-white/30 text-[9px] font-mono tabular-nums">
                          ${line.unitPrice.toFixed(2)}/{line.unit}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {lines.length === 0 && (
                    <p className="text-white/30 text-[11px] italic">No catalog matches found in that text.</p>
                  )}
                </div>

                <div
                  className="rounded-xl p-3.5 flex items-center justify-between"
                  style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${accentColor}33` }}
                >
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">Order total</p>
                    {promoSavings > 0 && (
                      <p className="text-[10px] mt-0.5" style={{ color: accentColor }}>
                        Includes ${promoSavings.toFixed(2)} in promo pricing, flagged separately from standard
                      </p>
                    )}
                  </div>
                  <p className="text-white text-xl font-bold tabular-nums">${total.toFixed(2)}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Mock c-store catalog and prices for this demo only, not Pepper&apos;s live Order Agent output.
          </p>
        </div>
      </div>
    </div>
  );
}
