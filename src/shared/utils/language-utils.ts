// Shared utilities for language processing

import type { LanguageStats } from "../../types/language";
import type { RepositoryNode } from "../../services/github/types";

export function processLanguageData(repositories: RepositoryNode[]): LanguageStats {
  const languageBytes: LanguageStats = {};

  for (const repo of repositories) {
    if (!repo.isFork) {
      const languages = repo.languages.edges;
      for (const langEdge of languages) {
        const language = langEdge.node.name;
        const size = langEdge.size;
        languageBytes[language] = (languageBytes[language] || 0) + size;
      }
    }
  }

  return languageBytes;
}

export function getTopLanguages(
  languageStats: LanguageStats,
  limit = 10,
): Array<{ language: string; value: number; percentage: number }> {
  // First get the top languages
  const topLanguages = Object.entries(languageStats)
    .toSorted(([, a], [, b]) => b - a)
    .slice(0, limit);

  // Calculate the total only from top languages for percentage
  const topLanguagesTotal = topLanguages.reduce((sum, [, value]) => sum + value, 0);

  return topLanguages.map(([language, value]) => ({
    language,
    value,
    percentage: (value / topLanguagesTotal) * 100,
  }));
}
