"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { IndustryConfig, SolutionIndustryContent } from "@/data/solutions-config";
import MockupFrame from "./mockups/mockup-frame";
import DentalMockup from "./mockups/dental-mockup";
import TattooMockup from "./mockups/tattoo-mockup";
import TradesMockup from "./mockups/trades-mockup";
import SalonMockup from "./mockups/salon-mockup";
import PetCareMockup from "./mockups/pet-care-mockup";
import RestaurantMockup from "./mockups/restaurant-mockup";
import CafeMockup from "./mockups/cafe-mockup";
import FitnessMockup from "./mockups/fitness-mockup";
import PhotographyMockup from "./mockups/photography-mockup";
import MovingMockup from "./mockups/moving-mockup";
import AutomotiveMockup from "./mockups/automotive-mockup";
import MedSpaMockup from "./mockups/med-spa-mockup";
import LiveChatPanel from "./live-chat-panel";

const mockups: Record<string, React.ComponentType> = {
  medico: DentalMockup, tattoo: TattooMockup, trades: TradesMockup,
  salon: SalonMockup, "pet-care": PetCareMockup, restaurant: RestaurantMockup,
  cafe: CafeMockup, fitness: FitnessMockup, photography: PhotographyMockup,
  moving: MovingMockup, automotive: AutomotiveMockup, "med-spa": MedSpaMockup,
};

export default function MockupSection({ industry, content }: { industry: IndustryConfig; content: SolutionIndustryContent }) {
  const [vp, setVp] = useState<"desktop" | "mobile">("desktop");
  const Comp = mockups[industry.slug];

  return (
    <section id="mockup-section" className="py-20 border-b border-[#e2e8f0]">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>Live Preview</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-2">An Example of What This Looks Like</h2>
          <p className="text-[#475569]">A preview of a {industry.label.toLowerCase()} {industry.businessNoun} built with this. The chat in the corner is genuinely live, powered by the same AI you'd get. Try it.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
          <div className="relative">
            <MockupFrame url={`your${industry.businessNoun}.com`} viewport={vp}>
              {Comp ? <Comp /> : (
                <div className="flex items-center justify-center h-96 text-[#94a3b8] text-sm">
                  <div className="text-center">
                    <p className="font-medium text-[#0f172a]">{industry.label} example</p>
                    <p className="text-xs mt-1">Available on a call</p>
                  </div>
                </div>
              )}
            </MockupFrame>
            <LiveChatPanel industry={industry} content={content} />
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {(["desktop", "mobile"] as const).map((v) => (
              <button key={v} onClick={() => setVp(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${vp === v ? "text-white" : "text-[#475569] border-transparent hover:bg-[#f1f5f9]"}`}
                style={vp === v ? { backgroundColor: industry.accentColor, borderColor: industry.accentColor } : undefined}>
                {v === "desktop" ? "Desktop" : "Mobile"}
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-[#475569] mb-3">Want this for your business?</p>
            <button onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3.5 rounded-md text-white font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity" style={{ backgroundColor: industry.accentColor }}>
              Book a Free Call
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}