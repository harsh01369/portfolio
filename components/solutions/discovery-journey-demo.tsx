"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PlanOption } from "@/data/proof-of-work-previews";

interface Props {
  practicePrompt: string;
  practiceFeedback: string;
  plans: PlanOption[];
  confirmationHeadline: string;
  confirmationNote: string;
  accentColor: string;
  bgDark: string;
}

type Step = "practice" | "plan" | "confirm";

export default function DiscoveryJourneyDemo({
  practicePrompt,
  practiceFeedback,
  plans,
  confirmationHeadline,
  confirmationNote,
  accentColor,
  bgDark,
}: Props) {
  const [step, setStep] = useState<Step>("practice");
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const stepIndex = step === "practice" ? 0 : step === "plan" ? 1 : 2;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: bgDark }}>
        <div className="flex gap-1.5 px-5 pt-5">
          {["practice", "plan", "confirm"].map((s, i) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full"
              style={{ background: i <= stepIndex ? accentColor : "rgba(255,255,255,0.15)" }}
            />
          ))}
        </div>

        <div className="p-6 min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === "practice" && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-3">Try it</p>
                <p className="text-white text-base font-medium mb-5 leading-snug">{practicePrompt}</p>

                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full rounded-lg bg-white/10 border border-white/15 text-white text-sm px-3.5 py-2.5 mb-3 placeholder:text-white/30 focus:outline-none focus:border-white/40"
                />

                {!showFeedback ? (
                  <button
                    onClick={() => setShowFeedback(true)}
                    disabled={!answer.trim()}
                    className="text-sm font-semibold rounded-full px-4 py-2.5 transition-opacity disabled:opacity-30"
                    style={{ background: accentColor, color: "white" }}
                  >
                    Check my answer
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg p-3.5 mb-4 text-sm text-white/85 leading-relaxed"
                    style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}55` }}
                  >
                    {practiceFeedback}
                  </motion.div>
                )}

                <div className="flex-1" />
                {showFeedback && (
                  <button
                    onClick={() => setStep("plan")}
                    className="text-sm font-semibold text-white/90 self-end flex items-center gap-1"
                  >
                    Continue
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                )}
              </motion.div>
            )}

            {step === "plan" && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-4">Choose your plan</p>

                <div className="space-y-2.5 mb-4">
                  {plans.map((plan) => (
                    <button
                      key={plan.name}
                      onClick={() => setSelectedPlan(plan.name)}
                      className="w-full text-left rounded-lg p-3.5 transition-colors"
                      style={{
                        background: selectedPlan === plan.name ? `${accentColor}22` : "rgba(255,255,255,0.06)",
                        border: `1px solid ${selectedPlan === plan.name ? accentColor : "rgba(255,255,255,0.12)"}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-semibold">{plan.name}</span>
                        {selectedPlan === plan.name && (
                          <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-xs mb-1.5">{plan.tagline}</p>
                      <ul className="text-white/60 text-xs space-y-0.5">
                        {plan.features.map((f) => (
                          <li key={f}>&middot; {f}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                <div className="flex-1" />
                <button
                  onClick={() => selectedPlan && setStep("confirm")}
                  disabled={!selectedPlan}
                  className="text-sm font-semibold rounded-full px-4 py-2.5 transition-opacity disabled:opacity-30 self-start"
                  style={{ background: accentColor, color: "white" }}
                >
                  Continue
                </button>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: `${accentColor}33`, border: `1.5px solid ${accentColor}` }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white text-lg font-semibold mb-2">{confirmationHeadline}</p>
                <p className="text-white/50 text-xs max-w-[220px] leading-relaxed">{confirmationNote}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
