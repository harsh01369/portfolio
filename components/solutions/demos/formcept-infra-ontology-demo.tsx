"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Stage = "clear" | "infra" | "etl" | "ontology";

const INFRA_NODES = ["HDFS", "Kafka", "Spark", "HBase", "Elasticsearch"];
const FAILING_NODE = "Kafka";

const ONTOLOGY_ENTITIES = [
  { label: "Customer Churn Risk", staleAt: "stale in 2 min" },
  { label: "Revenue Forecast Q4", staleAt: "stale in 3 min" },
  { label: "Inventory Health Index", staleAt: "stale in 4 min" },
];

export default function FormceptInfraOntologyDemo({ accentColor, bgDark }: Props) {
  const [stage, setStage] = useState<Stage>("clear");

  useEffect(() => {
    if (stage === "clear") return;
    const sequence: { stage: Stage; delay: number }[] = [
      { stage: "etl", delay: 700 },
      { stage: "ontology", delay: 1400 },
    ];
    const timers = sequence.map((step) =>
      stage === "infra" ? setTimeout(() => setStage(step.stage), step.delay) : null
    );
    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [stage]);

  const injectFailure = () => setStage("infra");
  const reset = () => setStage("clear");

  const atLeast = (s: Stage) => {
    const order: Stage[] = ["clear", "infra", "etl", "ontology"];
    return order.indexOf(stage) >= order.indexOf(s);
  };

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Infra-to-ontology map</p>
            {stage !== "clear" && (
              <button
                onClick={reset}
                className="text-white/35 hover:text-white/60 text-[10px] uppercase tracking-wide transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Ontology layer */}
          <p className="text-white/35 text-[9px] uppercase tracking-wide mb-1.5">Domain ontology</p>
          <div className="space-y-1.5 mb-4">
            {ONTOLOGY_ENTITIES.map((entity) => (
              <motion.div
                key={entity.label}
                animate={{
                  background: atLeast("ontology") ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.03)",
                  borderColor: atLeast("ontology") ? "#F43F5E" : "rgba(255,255,255,0.07)",
                }}
                className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{ border: "1px solid" }}
              >
                <span className="text-white text-[11px] font-medium">{entity.label}</span>
                <AnimatePresence mode="wait">
                  {atLeast("ontology") ? (
                    <motion.span
                      key="stale"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] font-mono tabular-nums font-semibold"
                      style={{ color: "#F43F5E" }}
                    >
                      {entity.staleAt}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="fresh"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] font-mono tabular-nums"
                      style={{ color: accentColor }}
                    >
                      fresh
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mb-3">
            <motion.div
              className="w-px h-5"
              animate={{
                background: atLeast("etl") ? "#F43F5E" : "rgba(255,255,255,0.15)",
                opacity: stage === "etl" ? [0.4, 1, 0.4] : 1,
              }}
              transition={{ duration: 0.8, repeat: stage === "etl" ? Infinity : 0 }}
            />
          </div>

          {/* ETL / MecRAG layer */}
          <p className="text-white/35 text-[9px] uppercase tracking-wide mb-1.5">ETL / MecRAG</p>
          <motion.div
            animate={{
              background: atLeast("etl") ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.03)",
              borderColor: atLeast("etl") ? "#F43F5E" : "rgba(255,255,255,0.07)",
            }}
            className="rounded-lg px-3 py-2 mb-4 text-center"
            style={{ border: "1px solid" }}
          >
            <span className="text-white/70 text-[11px]">
              {atLeast("etl") ? "Pipeline lag propagating" : "Ingest + enrich, nominal"}
            </span>
          </motion.div>

          <div className="flex justify-center mb-3">
            <motion.div
              className="w-px h-5"
              animate={{
                background: atLeast("infra") ? "#F43F5E" : "rgba(255,255,255,0.15)",
                opacity: stage === "infra" ? [0.4, 1, 0.4] : 1,
              }}
              transition={{ duration: 0.8, repeat: stage === "infra" ? Infinity : 0 }}
            />
          </div>

          {/* Infra layer */}
          <p className="text-white/35 text-[9px] uppercase tracking-wide mb-1.5">Infra</p>
          <div className="grid grid-cols-5 gap-1.5 mb-5">
            {INFRA_NODES.map((node) => {
              const isFailing = node === FAILING_NODE && atLeast("infra");
              return (
                <motion.div
                  key={node}
                  animate={{
                    background: isFailing ? "rgba(244,63,94,0.16)" : "rgba(255,255,255,0.03)",
                    borderColor: isFailing ? "#F43F5E" : "rgba(255,255,255,0.08)",
                  }}
                  className="rounded-lg px-1.5 py-2.5 text-center"
                  style={{ border: "1px solid" }}
                >
                  <span className="text-[9px] font-mono" style={{ color: isFailing ? "#F43F5E" : "rgba(255,255,255,0.5)" }}>
                    {node}
                  </span>
                  {isFailing && (
                    <motion.div
                      className="w-1 h-1 rounded-full mx-auto mt-1"
                      style={{ background: "#F43F5E" }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {stage === "clear" ? (
            <motion.button
              onClick={injectFailure}
              whileTap={{ scale: 0.96 }}
              className="w-full rounded-lg py-2.5 text-xs font-semibold"
              style={{ background: accentColor, color: bgDark }}
            >
              Inject failure: Kafka consumer lag spike
            </motion.button>
          ) : (
            <div
              className="rounded-lg px-3.5 py-3"
              style={{ background: "rgba(244,63,94,0.1)", border: "1px solid #F43F5E" }}
            >
              <p className="text-[11px] leading-relaxed" style={{ color: "#F43F5E" }}>
                {stage === "infra" && "Kafka consumer lag spiking. Propagating through ETL now."}
                {stage === "etl" && "ETL enrichment stalled on lagging Kafka topic. Reaching ontology layer."}
                {stage === "ontology" &&
                  "3 named business entities now tracked as going stale, visible by name, not a generic dashboard red dot."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
