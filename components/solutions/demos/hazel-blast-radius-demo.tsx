"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type ActionType = "klaviyo" | "shopify";

const TOTAL_LIST = 48200;
const AVG_ORDER_VALUE = 68;
const CONV_LOW = 0.018;
const CONV_HIGH = 0.034;

const TRAVEL_CLEANSER_STOCK = 12;
const TRAVEL_CLEANSER_BASE_WEEKLY_SELLTHROUGH = 9;
const BASE_MARGIN = 0.52;

export default function HazelBlastRadiusDemo({ accentColor, bgDark }: Props) {
  const [action, setAction] = useState<ActionType>("klaviyo");
  const [segmentPct, setSegmentPct] = useState(8);
  const [discount, setDiscount] = useState(20);

  const audienceSize = Math.round(TOTAL_LIST * (segmentPct / 100));
  const revenueLow = audienceSize * AVG_ORDER_VALUE * CONV_LOW;
  const revenueHigh = audienceSize * AVG_ORDER_VALUE * CONV_HIGH;
  const klaviyoRisk = revenueHigh > 5000 ? "high" : "low";

  const demandMultiplier = 1 + discount * 0.08;
  const projectedDemand = Math.round(TRAVEL_CLEANSER_BASE_WEEKLY_SELLTHROUGH * demandMultiplier);
  const inventoryConflict = projectedDemand > TRAVEL_CLEANSER_STOCK;
  const marginPoints = BASE_MARGIN - discount / 100;
  const weeklyOrders = 300;
  const marginDollarImpact = weeklyOrders * AVG_ORDER_VALUE * (discount / 100);

  const needsReview = action === "klaviyo" ? klaviyoRisk === "high" : inventoryConflict;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Blast radius preview</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["klaviyo", "shopify"] as ActionType[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: action === a ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {action === a && (
                    <motion.div
                      layoutId="action-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{a === "klaviyo" ? "Klaviyo campaign" : "Shopify bundle"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1">Action queued</p>
            <p className="text-white/75 text-xs leading-relaxed">
              {action === "klaviyo"
                ? "Send a test campaign for the new retention flow to a segment of the active subscriber list."
                : "Launch a Restorative Night Serum plus Travel-Size Cleanser bundle at a limited-time discount."}
            </p>
          </div>

          {action === "klaviyo" ? (
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-white/35 text-[9px] uppercase tracking-wider">Segment size</p>
                  <p className="text-white text-xs font-mono tabular-nums font-semibold">{segmentPct}% of list</p>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={segmentPct}
                  onChange={(e) => setSegmentPct(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor, background: "rgba(255,255,255,0.1)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-white/30 text-[8px] uppercase tracking-wider">Audience</p>
                  <p className="text-white text-sm font-mono tabular-nums font-bold">{audienceSize.toLocaleString()}</p>
                  <p className="text-white/35 text-[9px]">subscribers</p>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}44` }}>
                  <p className="text-white/30 text-[8px] uppercase tracking-wider">Revenue at risk</p>
                  <p className="text-sm font-mono tabular-nums font-bold" style={{ color: accentColor }}>
                    ${Math.round(revenueLow).toLocaleString()}{"–"}${Math.round(revenueHigh).toLocaleString()}
                  </p>
                  <p className="text-white/35 text-[9px]">if the flow underperforms</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-white/35 text-[9px] uppercase tracking-wider">Bundle discount</p>
                  <p className="text-white text-xs font-mono tabular-nums font-semibold">{discount}% off</p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor, background: "rgba(255,255,255,0.1)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-white/30 text-[8px] uppercase tracking-wider">Margin impact</p>
                  <p className="text-sm font-mono tabular-nums font-bold" style={{ color: marginPoints < 0.3 ? "#E5484D" : "#1E9E6B" }}>
                    {(marginPoints * 100).toFixed(0)}% margin
                  </p>
                  <p className="text-white/35 text-[9px]">
                    {"–"}${marginDollarImpact.toFixed(0)}/wk at {weeklyOrders} orders
                  </p>
                </div>
                <div
                  className="rounded-lg p-2.5"
                  style={{
                    background: inventoryConflict ? "rgba(229,72,77,0.1)" : "rgba(30,158,107,0.08)",
                    border: `1px solid ${inventoryConflict ? "#E5484D55" : "#1E9E6B55"}`,
                  }}
                >
                  <p className="text-white/30 text-[8px] uppercase tracking-wider">Inventory check</p>
                  <p className="text-sm font-mono tabular-nums font-bold" style={{ color: inventoryConflict ? "#E5484D" : "#1E9E6B" }}>
                    {projectedDemand} vs {TRAVEL_CLEANSER_STOCK} in stock
                  </p>
                  <p className="text-white/35 text-[9px]">Travel-Size Cleanser projected demand</p>
                </div>
              </div>
            </div>
          )}

          <div
            className="rounded-xl p-3.5"
            style={{
              background: needsReview ? "rgba(229,72,77,0.08)" : "rgba(30,158,107,0.08)",
              border: `1px solid ${needsReview ? "#E5484D55" : "#1E9E6B55"}`,
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-bold" style={{ color: needsReview ? "#E5484D" : "#1E9E6B" }}>
                {needsReview ? "Needs review" : "Clear to send"}
              </p>
            </div>
            <p className="text-white/55 text-[11px] leading-relaxed">
              {action === "klaviyo"
                ? needsReview
                  ? "This segment is large enough that a bad test flow puts real revenue on the line. Approve with a smaller segment first, or proceed with eyes open."
                  : "Small enough segment that a misfire is cheap to recover from. Safe to approve as a quick test."
                : inventoryConflict
                ? "Projected demand at this discount outstrips what's actually in the warehouse. Approving now risks a bundle that sells out mid-promotion and overselling the cleanser."
                : "Stock covers projected demand at this discount, and margin stays in a healthy range. Safe to approve."}
            </p>
            <button
              disabled={needsReview}
              className="mt-3 text-[10px] font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: needsReview ? "rgba(255,255,255,0.08)" : accentColor,
                color: needsReview ? "rgba(255,255,255,0.35)" : bgDark,
                cursor: needsReview ? "not-allowed" : "pointer",
              }}
            >
              {needsReview ? "Blocked pending review" : "Approve action"}
            </button>
          </div>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Illustrative list size, pricing, and inventory for this demo only, not a real brand&apos;s Shopify or
            Klaviyo data.
          </p>
        </div>
      </div>
    </div>
  );
}
