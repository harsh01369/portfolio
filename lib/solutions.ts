import {
  industries, solutions, getContent, getFallbackContent,
  type IndustryConfig, type SolutionConfig, type SolutionIndustryContent,
  type IndustrySlug, type SolutionSlug,
} from "@/data/solutions-config";

export function getSolutionBySlug(slug: string): SolutionConfig | undefined {
  return solutions.find((s) => s.slug === slug);
}
export function getIndustryBySlug(slug: string): IndustryConfig | undefined {
  return industries.find((i) => i.slug === slug);
}
export function getContentFor(solutionSlug: string, industrySlug: string): SolutionIndustryContent {
  return getContent(solutionSlug, industrySlug) ?? getFallbackContent(solutionSlug, industrySlug);
}
export function getSolutionSlugs(): SolutionSlug[] { return solutions.map((s) => s.slug); }
export function getIndustrySlugs(): IndustrySlug[] { return industries.map((i) => i.slug); }
export function isValidSolutionSlug(slug: string): slug is SolutionSlug {
  return solutions.some((s) => s.slug === slug);
}
export function isValidIndustrySlug(slug: string): slug is IndustrySlug {
  return industries.some((i) => i.slug === slug);
}
