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
import AccountableProofVaultDemo from "./demos/accountable-proof-vault-demo";
import AstraRoutingDemo from "./demos/astra-routing-demo";
import ConstructorReasoningDemo from "./demos/constructor-reasoning-demo";
import CypherockShardMapDemo from "./demos/cypherock-shard-map-demo";
import FloxChainOfCustodyDemo from "./demos/flox-chain-of-custody-demo";
import FormceptInfraOntologyDemo from "./demos/formcept-infra-ontology-demo";
import HcaptchaLatencyRiskDemo from "./demos/hcaptcha-latency-risk-demo";
import InterraGuardrailConsoleDemo from "./demos/interra-guardrail-console-demo";
import JerryTcoSimulatorDemo from "./demos/jerry-tco-simulator-demo";
import KargoTowerTrustDemo from "./demos/kargo-tower-trust-demo";
import KovoScoreClimbDemo from "./demos/kovo-score-climb-demo";
import MetabaseUpgradeSafetyDemo from "./demos/metabase-upgrade-safety-demo";
import NametagDeletionAttestationDemo from "./demos/nametag-deletion-attestation-demo";
import NexCrossDomainDemo from "./demos/nex-crossdomain-demo";
import NorthbeamReconciliationDemo from "./demos/northbeam-reconciliation-demo";
import OdenLineToModelDemo from "./demos/oden-line-to-model-demo";
import PepperOrderAgentDemo from "./demos/pepper-order-agent-demo";
import PurposeCausalTraceDemo from "./demos/purpose-causal-trace-demo";
import SkylightMagicImportDemo from "./demos/skylight-magic-import-demo";
import SpadeMtlsHandshakeDemo from "./demos/spade-mtls-handshake-demo";
import TemporalProxyInspectorDemo from "./demos/temporal-proxy-inspector-demo";
import VestedTrueReturnDemo from "./demos/vested-true-return-demo";
import WellbeamCareTransitionDemo from "./demos/wellbeam-care-transition-demo";
import WheelhousePriceProvenanceDemo from "./demos/wheelhouse-price-provenance-demo";
import WyndlabsTrustReceiptDemo from "./demos/wyndlabs-trust-receipt-demo";
import HeyMarvinCitationHarnessDemo from "./demos/heymarvin-citation-harness-demo";
import FieldguideTenantIsolationDemo from "./demos/fieldguide-tenant-isolation-demo";
import PoshDropMomentDemo from "./demos/posh-drop-moment-demo";
import TwinMindUnitEconomicsDemo from "./demos/twinmind-unit-economics-demo";
import HazelBlastRadiusDemo from "./demos/hazel-blast-radius-demo";
import QuidientMeasuredGeneratedDemo from "./demos/quidient-measured-generated-demo";
import CoastGhostFillDemo from "./demos/coast-ghost-fill-demo";
import FeatheryProvenanceDemo from "./demos/feathery-provenance-demo";
import LindusCitrusDemo from "./demos/lindus-citrus-demo";
import SiroConsentDemo from "./demos/siro-consent-demo";
import CapsuleBrandLockDemo from "./demos/capsule-brand-lock-demo";
import BobyardConfidenceTakeoffDemo from "./demos/bobyard-confidence-takeoff-demo";
import AnythingTapToPromptDemo from "./demos/anything-tap-to-prompt-demo";
import DataDomeSignalDemo from "./demos/datadome-signal-demo";
import MochiRoutingDemo from "./demos/mochi-routing-demo";
import BevelAttributionDemo from "./demos/bevel-attribution-demo";
import StuutReconciliationDemo from "./demos/stuut-reconciliation-demo";
import EdgeQUtilizationDemo from "./demos/edgeq-utilization-demo";
import CounselTriageDemo from "./demos/counsel-triage-demo";
import OnosTenantIsolationDemo from "./demos/onos-tenant-isolation-demo";
import DossSyncConflictDemo from "./demos/doss-sync-conflict-demo";
import ForwardTwinFreshnessDemo from "./demos/forward-twin-freshness-demo";
import StarbridgeProvenanceTraceDemo from "./demos/starbridge-provenance-trace-demo";
import SwoopAirgapParityDemo from "./demos/swoop-airgap-parity-demo";
import FreeformPartReplayDemo from "./demos/freeform-part-replay-demo";
import TykMdcbQuotaDemo from "./demos/tyk-mdcb-quota-demo";
import AltinityReplicaLagDemo from "./demos/altinity-replica-lag-demo";
import ArizeDriftMonitorDemo from "./demos/arize-drift-monitor-demo";
import KalepaRiskBreakdownDemo from "./demos/kalepa-risk-breakdown-demo";
import NorthflankIdleTeardownDemo from "./demos/northflank-idle-teardown-demo";
import AssuredDeterminismBoundaryDemo from "./demos/assured-determinism-boundary-demo";
import JuniperSquareRebalanceDemo from "./demos/juniper-square-rebalance-demo";
import ToiLabsOtaSessionDemo from "./demos/toi-labs-ota-session-demo";
import SentilinkManifestLinkDemo from "./demos/sentilink-manifest-link-demo";
import CompaCohortThresholdDemo from "./demos/compa-cohort-threshold-demo";
import SpruceChannelBoundaryDemo from "./demos/spruce-channel-boundary-demo";
import DrivewealthFractionalFillDemo from "./demos/drivewealth-fractional-fill-demo";
import Class8OemNormalizeDemo from "./demos/class8-oem-normalize-demo";
import NetbirdRelayFallbackDemo from "./demos/netbird-relay-fallback-demo";
import ParadeDbInlineIndexDemo from "./demos/paradedb-inline-index-demo";
import SeeqCapsuleResetDemo from "./demos/seeq-capsule-reset-demo";
import ChronographMarkFreshnessDemo from "./demos/chronograph-mark-freshness-demo";
import OscilarFeatureStalenessDemo from "./demos/oscilar-feature-staleness-demo";
import EnveritasPixelResolutionDemo from "./demos/enveritas-pixel-resolution-demo";
import NamespaceCacheLocalityDemo from "./demos/namespace-cache-locality-demo";
import CoderSessionPersistenceDemo from "./demos/coder-session-persistence-demo";
import DatamintFingerprintLayersDemo from "./demos/datamint-fingerprint-layers-demo";
import KaavioConflictConfidenceDemo from "./demos/kaavio-conflict-confidence-demo";
import SphinxAntennaContentionDemo from "./demos/sphinx-antenna-contention-demo";
import RelevantIdentityResolutionDemo from "./demos/relevant-identity-resolution-demo";
import TahomaPortalSelfhealDemo from "./demos/tahoma-portal-selfheal-demo";
import NovaCreditScoreNormalizeDemo from "./demos/novacredit-score-normalize-demo";
import WorkersIoInterleavingDemo from "./demos/workersio-interleaving-demo";
import OrcaGuardrailDemo from "./demos/orca-guardrail-demo";
import EntanglAsbuiltDriftDemo from "./demos/entangl-asbuilt-drift-demo";
import KlavisVerificationGapDemo from "./demos/klavis-verification-gap-demo";

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
  "accountable-proof-vault": AccountableProofVaultDemo,
  "astra-routing": AstraRoutingDemo,
  "constructor-reasoning": ConstructorReasoningDemo,
  "cypherock-shard-map": CypherockShardMapDemo,
  "flox-chain-of-custody": FloxChainOfCustodyDemo,
  "formcept-infra-ontology": FormceptInfraOntologyDemo,
  "hcaptcha-latency-risk": HcaptchaLatencyRiskDemo,
  "interra-guardrail-console": InterraGuardrailConsoleDemo,
  "jerry-tco-simulator": JerryTcoSimulatorDemo,
  "kargo-tower-trust": KargoTowerTrustDemo,
  "kovo-score-climb": KovoScoreClimbDemo,
  "metabase-upgrade-safety": MetabaseUpgradeSafetyDemo,
  "nametag-deletion-attestation": NametagDeletionAttestationDemo,
  "nex-crossdomain": NexCrossDomainDemo,
  "northbeam-reconciliation": NorthbeamReconciliationDemo,
  "oden-line-to-model": OdenLineToModelDemo,
  "pepper-order-agent": PepperOrderAgentDemo,
  "purpose-causal-trace": PurposeCausalTraceDemo,
  "skylight-magic-import": SkylightMagicImportDemo,
  "spade-mtls-handshake": SpadeMtlsHandshakeDemo,
  "temporal-proxy-inspector": TemporalProxyInspectorDemo,
  "vested-true-return": VestedTrueReturnDemo,
  "wellbeam-care-transition": WellbeamCareTransitionDemo,
  "wheelhouse-price-provenance": WheelhousePriceProvenanceDemo,
  "wyndlabs-trust-receipt": WyndlabsTrustReceiptDemo,
  "heymarvin-citation-harness": HeyMarvinCitationHarnessDemo,
  "fieldguide-tenant-isolation": FieldguideTenantIsolationDemo,
  "posh-drop-moment": PoshDropMomentDemo,
  "twinmind-unit-economics": TwinMindUnitEconomicsDemo,
  "hazel-blast-radius": HazelBlastRadiusDemo,
  "quidient-measured-generated": QuidientMeasuredGeneratedDemo,
  "coast-ghost-fill": CoastGhostFillDemo,
  "feathery-provenance": FeatheryProvenanceDemo,
  "lindus-citrus": LindusCitrusDemo,
  "siro-consent": SiroConsentDemo,
  "capsule-brand-lock": CapsuleBrandLockDemo,
  "bobyard-confidence-takeoff": BobyardConfidenceTakeoffDemo,
  "anything-tap-to-prompt": AnythingTapToPromptDemo,
  "datadome-signal": DataDomeSignalDemo,
  "mochi-routing": MochiRoutingDemo,
  "bevel-attribution": BevelAttributionDemo,
  "stuut-reconciliation": StuutReconciliationDemo,
  "edgeq-utilization": EdgeQUtilizationDemo,
  "counsel-triage": CounselTriageDemo,
  "onos-tenant-isolation": OnosTenantIsolationDemo,
  "doss-sync-conflict": DossSyncConflictDemo,
  "forward-twin-freshness": ForwardTwinFreshnessDemo,
  "starbridge-provenance-trace": StarbridgeProvenanceTraceDemo,
  "swoop-airgap-parity": SwoopAirgapParityDemo,
  "freeform-part-replay": FreeformPartReplayDemo,
  "tyk-mdcb-quota": TykMdcbQuotaDemo,
  "altinity-replica-lag": AltinityReplicaLagDemo,
  "arize-drift-monitor": ArizeDriftMonitorDemo,
  "kalepa-risk-breakdown": KalepaRiskBreakdownDemo,
  "northflank-idle-teardown": NorthflankIdleTeardownDemo,
  "assured-determinism-boundary": AssuredDeterminismBoundaryDemo,
  "juniper-square-rebalance": JuniperSquareRebalanceDemo,
  "toi-labs-ota-session": ToiLabsOtaSessionDemo,
  "sentilink-manifest-link": SentilinkManifestLinkDemo,
  "compa-cohort-threshold": CompaCohortThresholdDemo,
  "spruce-channel-boundary": SpruceChannelBoundaryDemo,
  "drivewealth-fractional-fill": DrivewealthFractionalFillDemo,
  "class8-oem-normalize": Class8OemNormalizeDemo,
  "netbird-relay-fallback": NetbirdRelayFallbackDemo,
  "paradedb-inline-index": ParadeDbInlineIndexDemo,
  "seeq-capsule-reset": SeeqCapsuleResetDemo,
  "chronograph-mark-freshness": ChronographMarkFreshnessDemo,
  "oscilar-feature-staleness": OscilarFeatureStalenessDemo,
  "enveritas-pixel-resolution": EnveritasPixelResolutionDemo,
  "namespace-cache-locality": NamespaceCacheLocalityDemo,
  "coder-session-persistence": CoderSessionPersistenceDemo,
  "datamint-fingerprint-layers": DatamintFingerprintLayersDemo,
  "kaavio-conflict-confidence": KaavioConflictConfidenceDemo,
  "sphinx-antenna-contention": SphinxAntennaContentionDemo,
  "relevant-identity-resolution": RelevantIdentityResolutionDemo,
  "tahoma-portal-selfheal": TahomaPortalSelfhealDemo,
  "novacredit-score-normalize": NovaCreditScoreNormalizeDemo,
  "workersio-interleaving": WorkersIoInterleavingDemo,
  "orca-guardrail": OrcaGuardrailDemo,
  "entangl-asbuilt-drift": EntanglAsbuiltDriftDemo,
  "klavis-verification-gap": KlavisVerificationGapDemo,
};
