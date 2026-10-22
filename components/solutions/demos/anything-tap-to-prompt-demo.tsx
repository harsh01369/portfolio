"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface AppNode {
  id: string;
  name: string;
  kind: "card" | "button" | "list";
}

interface Instruction {
  id: string;
  label: string;
  apply: (style: NodeStyle) => NodeStyle;
}

interface NodeStyle {
  rounded: boolean;
  accented: boolean;
  scaled: boolean;
}

const NODES: AppNode[] = [
  { id: "n1", name: "Welcome card", kind: "card" },
  { id: "n2", name: "Primary CTA button", kind: "button" },
  { id: "n3", name: "Recent activity list", kind: "list" },
];

const INSTRUCTIONS: Instruction[] = [
  { id: "i1", label: "Make it rounded", apply: (s) => ({ ...s, rounded: true }) },
  { id: "i2", label: "Use the accent color", apply: (s) => ({ ...s, accented: true }) },
  { id: "i3", label: "Make it bigger", apply: (s) => ({ ...s, scaled: true }) },
  { id: "i4", label: "Reset this element", apply: () => ({ rounded: false, accented: false, scaled: false }) },
];

const DEFAULT_STYLE: NodeStyle = { rounded: false, accented: false, scaled: false };

export default function AnythingTapToPromptDemo({ accentColor, bgDark }: Props) {
  const [anchoredId, setAnchoredId] = useState<string | null>(null);
  const [styles, setStyles] = useState<Record<string, NodeStyle>>({});
  const [history, setHistory] = useState<{ id: string; text: string; node: string }[]>([]);

  const styleFor = (id: string) => styles[id] ?? DEFAULT_STYLE;

  const applyInstruction = (instr: Instruction) => {
    if (!anchoredId) return;
    setStyles((prev) => ({ ...prev, [anchoredId]: instr.apply(styleFor(anchoredId)) }));
    const node = NODES.find((n) => n.id === anchoredId)!;
    setHistory((h) => [{ id: `${Date.now()}`, text: instr.label, node: node.name }, ...h].slice(0, 4));
  };

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-1">Tap-to-prompt preview</p>
          <p className="text-white text-sm font-semibold mb-4">Tap a real element, then tell it what to change</p>

          <div className="flex gap-4">
            {/* phone mock */}
            <div
              className="relative shrink-0 rounded-[1.4rem] p-2.5"
              style={{ width: 150, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <div className="rounded-xl overflow-hidden p-2 space-y-2" style={{ background: "rgba(0,0,0,0.25)", minHeight: 230 }}>
                {NODES.map((node) => {
                  const s = styleFor(node.id);
                  const isAnchored = anchoredId === node.id;
                  return (
                    <motion.button
                      key={node.id}
                      onClick={() => setAnchoredId(isAnchored ? null : node.id)}
                      className="w-full text-left block"
                      animate={{ scale: s.scaled ? 1.06 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    >
                      <div
                        className="px-2.5 py-2.5 transition-colors"
                        style={{
                          borderRadius: s.rounded ? 14 : 4,
                          background: s.accented ? `${accentColor}26` : "rgba(255,255,255,0.06)",
                          border: `1.5px solid ${isAnchored ? accentColor : s.accented ? accentColor + "77" : "rgba(255,255,255,0.12)"}`,
                          boxShadow: isAnchored ? `0 0 0 3px ${accentColor}22` : "none",
                        }}
                      >
                        <p className="text-white text-[9px] font-semibold">{node.name}</p>
                        <p className="text-white/35 text-[8px] mt-0.5 capitalize">{node.kind}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* prompt bar + instructions */}
            <div className="flex-1 flex flex-col">
              <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-2">Anchored target</p>
              <div
                className="rounded-lg px-3 py-2 mb-3 min-h-[34px] flex items-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <AnimatePresence mode="wait">
                  {anchoredId ? (
                    <motion.span
                      key={anchoredId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ background: `${accentColor}22`, color: accentColor }}
                    >
                      @{NODES.find((n) => n.id === anchoredId)?.name}
                    </motion.span>
                  ) : (
                    <motion.span key="none" className="text-white/30 text-[10px] italic">
                      tap an element in the preview to anchor your prompt
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {INSTRUCTIONS.map((instr) => (
                  <button
                    key={instr.id}
                    onClick={() => applyInstruction(instr)}
                    disabled={!anchoredId}
                    className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg text-left transition-opacity disabled:opacity-30"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                  >
                    {instr.label}
                  </button>
                ))}
              </div>

              <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-1.5">Applied this turn</p>
              <div className="space-y-1 flex-1">
                <AnimatePresence>
                  {history.map((h) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] text-white/55 leading-relaxed"
                    >
                      <span style={{ color: accentColor }}>{h.text}</span>{" "}
                      <span className="text-white/30">bound to {h.node}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {history.length === 0 && <p className="text-white/25 text-[10px] italic">Nothing applied yet.</p>}
              </div>
            </div>
          </div>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            The next instruction binds to the exact node you tapped, not to whichever element the model guesses from
            your wording. Sample app preview, built for this demo only.
          </p>
        </div>
      </div>
    </div>
  );
}
