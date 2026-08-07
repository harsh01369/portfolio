"use client";

export default function MockupFrame({ url, viewport, children }: { url: string; viewport: "desktop" | "mobile"; children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className={`relative rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden transition-all duration-500 ${viewport === "mobile" ? "w-[375px]" : "w-full max-w-4xl"}`}
        style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-3 px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-md bg-white border border-[#e2e8f0] text-xs text-[#94a3b8] max-w-xs truncate">{url}</div>
          </div>
          <div className="w-[54px]" />
        </div>
        <div className="overflow-y-auto max-h-[600px] relative">{children}</div>
        <div className="px-4 py-2 bg-[#f8fafc] border-t border-[#e2e8f0] text-center">
          <span className="text-xs text-[#94a3b8]">Scroll to see the full page. The chat bubble in the corner is live, try it.</span>
        </div>
      </div>
    </div>
  );
}