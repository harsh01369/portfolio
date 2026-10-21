"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type StockId = "aapl" | "tsla" | "nvda";
type PeriodId = "1y" | "2y";

interface ReturnData {
  rawReturnPct: number;
  currencyEffectPct: number;
  taxDragPctOfGain: number;
}

const STOCKS: { id: StockId; ticker: string; name: string }[] = [
  { id: "aapl", ticker: "AAPL", name: "Apple Inc." },
  { id: "tsla", ticker: "TSLA", name: "Tesla Inc." },
  { id: "nvda", ticker: "NVDA", name: "Nvidia Corp." },
];

const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "1y", label: "1 year ago → today" },
  { id: "2y", label: "2 years ago → today" },
];

const AMOUNTS = [1000, 5000, 10000];

const DATA: Record<StockId, Record<PeriodId, ReturnData>> = {
  aapl: {
    "1y": { rawReturnPct: 18.4, currencyEffectPct: 2.1, taxDragPctOfGain: 9 },
    "2y": { rawReturnPct: 34.0, currencyEffectPct: 4.8, taxDragPctOfGain: 10 },
  },
  tsla: {
    "1y": { rawReturnPct: 42.5, currencyEffectPct: 2.1, taxDragPctOfGain: 9 },
    "2y": { rawReturnPct: 61.0, currencyEffectPct: 4.8, taxDragPctOfGain: 10 },
  },
  nvda: {
    "1y": { rawReturnPct: 92.0, currencyEffectPct: 2.1, taxDragPctOfGain: 9 },
    "2y": { rawReturnPct: 168.0, currencyEffectPct: 4.8, taxDragPctOfGain: 10 },
  },
};

function formatPct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export default function VestedTrueReturnDemo({ accentColor, bgDark }: Props) {
  const [stockId, setStockId] = useState<StockId>("nvda");
  const [periodId, setPeriodId] = useState<PeriodId>("1y");
  const [amount, setAmount] = useState(5000);

  const stock = STOCKS.find((s) => s.id === stockId)!;
  const data = DATA[stockId][periodId];

  const computed = useMemo(() => {
    const rawAmount = amount * (data.rawReturnPct / 100);
    const combinedMultiplier = (1 + data.rawReturnPct / 100) * (1 + data.currencyEffectPct / 100) - 1;
    const afterCurrencyAmount = amount * combinedMultiplier;
    const dragAmount = afterCurrencyAmount * (data.taxDragPctOfGain / 100);
    const afterTaxAmount = afterCurrencyAmount - dragAmount;
    const afterTaxPct = (afterTaxAmount / amount) * 100;
    return {
      rawAmount,
      afterCurrencyAmount,
      afterCurrencyPct: combinedMultiplier * 100,
      dragAmount,
      afterTaxAmount,
      afterTaxPct,
    };
  }, [amount, data]);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-5">True Return calculator</p>

          <div className="flex gap-1.5 mb-3">
            {STOCKS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStockId(s.id)}
                className="relative flex-1 text-[11px] font-semibold px-2 py-1.5 rounded-lg"
                style={{
                  background: stockId === s.id ? accentColor : "rgba(255,255,255,0.05)",
                  color: stockId === s.id ? bgDark : "rgba(255,255,255,0.5)",
                  border: `1px solid ${stockId === s.id ? accentColor : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {s.ticker}
              </button>
            ))}
          </div>

          <div
            className="flex rounded-full p-0.5 w-fit mb-3"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriodId(p.id)}
                className="relative text-[10px] font-semibold px-3 py-1.5 rounded-full"
                style={{ color: periodId === p.id ? bgDark : "rgba(255,255,255,0.55)" }}
              >
                {periodId === p.id && (
                  <motion.div
                    layoutId="period-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: accentColor }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{p.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 mb-6">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className="relative flex-1 text-[11px] font-semibold px-2 py-1.5 rounded-lg"
                style={{
                  background: amount === a ? accentColor : "rgba(255,255,255,0.05)",
                  color: amount === a ? bgDark : "rgba(255,255,255,0.5)",
                  border: `1px solid ${amount === a ? accentColor : "rgba(255,255,255,0.1)"}`,
                }}
              >
                ${a.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {[
              {
                key: "raw",
                label: "Raw USD return",
                amountVal: computed.rawAmount,
                pctVal: data.rawReturnPct,
                note: `${stock.name}, measured in USD only`,
              },
              {
                key: "currency",
                label: "After currency movement",
                amountVal: computed.afterCurrencyAmount,
                pctVal: computed.afterCurrencyPct,
                note: `INR moved ${formatPct(data.currencyEffectPct)} against USD over the period`,
              },
              {
                key: "true",
                label: "True Return (after tax + remittance drag)",
                amountVal: computed.afterTaxAmount,
                pctVal: computed.afterTaxPct,
                note: `Approx. ${data.taxDragPctOfGain}% of gain lost to capital-gains tax and LRS remittance costs`,
                highlight: true,
              },
            ].map((row, i) => (
              <motion.div
                key={row.key + stockId + periodId + amount}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.3 }}
                className="rounded-xl p-3.5"
                style={{
                  background: row.highlight ? `${accentColor}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${row.highlight ? accentColor + "66" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <p
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: row.highlight ? accentColor : "rgba(255,255,255,0.45)" }}
                  >
                    {row.label}
                  </p>
                  <p className="text-[10px] font-mono tabular-nums" style={{ color: row.highlight ? accentColor : "rgba(255,255,255,0.4)" }}>
                    {formatPct(row.pctVal)}
                  </p>
                </div>
                <p className="text-white text-xl font-bold tabular-nums mt-1">
                  {row.amountVal >= 0 ? "+" : ""}${Math.abs(row.amountVal).toFixed(0)}
                </p>
                <p className="text-white/35 text-[9px] leading-relaxed mt-1">{row.note}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Illustrative model only, actual currency movement, LRS costs, and Indian capital-gains treatment vary by
            investor and tax year. Not investment or tax advice.
          </p>
        </div>
      </div>
    </div>
  );
}
