"use client";

import { motion } from "framer-motion";
import CardSpotlight from "./card-spotlight";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We needed a better way to catch incorrect figures in AI-generated billing responses. Silentgreen gives us a way to check answers against the source instead of trusting a confident-sounding response.",
    name: "Jimmy Brown",
    role: "Finance Operations Manager",
    location: "United Kingdom",
  },
  {
    quote:
      "The distinction between a verified fact and an unproven claim matters. It gives our team a clearer picture of what the evidence actually supports.",
    name: "Michelle Tan",
    role: "Fintech Operations Lead",
    location: "Singapore",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative border-t border-border overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-sm font-medium text-accent mb-2">From the people using it</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
            What SilentGreen catches
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <CardSpotlight className="h-full rounded-xl border border-border bg-surface p-6">
                <p className="text-sm leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-muted">
                    {t.role} · {t.location}
                  </p>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
