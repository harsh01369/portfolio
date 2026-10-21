// Registry for the "next 25" batch of proof-of-work demos: each lead gets a
// fully self-contained component (own sample data, own visual concept) under
// demos/, keyed here by a plain string instead of growing the discriminated
// union in data/proof-of-work-previews.ts per lead. That union was fine for
// 3 leads with genuinely different prop shapes; at 25+ bespoke, one-off
// concepts, a shared "registryKey -> component" map scales without every new
// lead touching the same central files (avoids merge conflicts when several
// demos are built in parallel, and keeps each company's content colocated
// with its own component instead of spread across a growing union type).
import type { ComponentType } from "react";
import CustodiaCustodyDemo from "./demos/custodia-custody-demo";
import ArrePathPhenotypeExplorerDemo from "./demos/arrepath-phenotype-explorer-demo";
import AugustCrossMarginDemo from "./demos/august-cross-margin-demo";
import CovuGoldenRecordDemo from "./demos/covu-golden-record-demo";
import DeepgramTrustFlowDemo from "./demos/deepgram-trust-flow-demo";
import GarnerRankingAuditDemo from "./demos/garner-ranking-audit-demo";
import HallidayRouteExplainerDemo from "./demos/halliday-route-explainer-demo";
import HonorCareLedgerDemo from "./demos/honor-care-ledger-demo";
import NopsSavingsLedgerDemo from "./demos/nops-savings-ledger-demo";
import PodiumCallHealthDemo from "./demos/podium-call-health-demo";
import RhythmSpreadMonitorDemo from "./demos/rhythm-spread-monitor-demo";
import SniffspotBookingIntegrityDemo from "./demos/sniffspot-booking-integrity-demo";
import SnoutPlanRadarDemo from "./demos/snout-plan-radar-demo";
import SpoilerDecayClockDemo from "./demos/spoiler-decay-clock-demo";
import TennaTelemetryDemo from "./demos/tenna-telemetry-demo";
import ViaductWarningLagDemo from "./demos/viaduct-warning-lag-demo";
import VirtaSignalChainDemo from "./demos/virta-signal-chain-demo";
import WhatConvertsAttributionUptimeDemo from "./demos/whatconverts-attribution-uptime-demo";
import YipitPipelineConfidenceDemo from "./demos/yipit-pipeline-confidence-demo";
import RavennaEscalationDemo from "./demos/ravenna-escalation-demo";
import RilianProvenanceDemo from "./demos/rilian-provenance-demo";
import MonteCarloRootCauseDemo from "./demos/montecarlo-rootcause-demo";
import Dv01LoanLevelDemo from "./demos/dv01-loanlevel-demo";
import SubstraktSyncDemo from "./demos/substrakt-sync-demo";
import EightSleepBoundaryDemo from "./demos/eightsleep-boundary-demo";

export interface RegistryDemoProps {
  accentColor: string;
  bgDark: string;
}

export const demoRegistry: Record<string, ComponentType<RegistryDemoProps>> = {
  "custodia-custody": CustodiaCustodyDemo,
  "arrepath-phenotype-explorer": ArrePathPhenotypeExplorerDemo,
  "august-cross-margin": AugustCrossMarginDemo,
  "covu-golden-record": CovuGoldenRecordDemo,
  "deepgram-trust-flow": DeepgramTrustFlowDemo,
  "garner-ranking-audit": GarnerRankingAuditDemo,
  "halliday-route-explainer": HallidayRouteExplainerDemo,
  "honor-care-ledger": HonorCareLedgerDemo,
  "nops-savings-ledger": NopsSavingsLedgerDemo,
  "podium-call-health": PodiumCallHealthDemo,
  "rhythm-spread-monitor": RhythmSpreadMonitorDemo,
  "sniffspot-booking-integrity": SniffspotBookingIntegrityDemo,
  "snout-plan-radar": SnoutPlanRadarDemo,
  "spoiler-decay-clock": SpoilerDecayClockDemo,
  "tenna-telemetry": TennaTelemetryDemo,
  "viaduct-warning-lag": ViaductWarningLagDemo,
  "virta-signal-chain": VirtaSignalChainDemo,
  "whatconverts-attribution-uptime": WhatConvertsAttributionUptimeDemo,
  "yipit-pipeline-confidence": YipitPipelineConfidenceDemo,
  "ravenna-escalation": RavennaEscalationDemo,
  "rilian-provenance": RilianProvenanceDemo,
  "montecarlo-rootcause": MonteCarloRootCauseDemo,
  "dv01-loanlevel": Dv01LoanLevelDemo,
  "substrakt-sync": SubstraktSyncDemo,
  "eightsleep-boundary": EightSleepBoundaryDemo,
};
