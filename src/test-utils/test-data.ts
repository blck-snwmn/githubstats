import type { LanguageData, LanguageStats } from "../types/language";

export const testLanguageData: LanguageData[] = [
  { language: "TypeScript", bytes: 45000, percentage: 45.5 },
  { language: "JavaScript", bytes: 30000, percentage: 30.2 },
  { language: "Go", bytes: 15000, percentage: 15.1 },
  { language: "Python", bytes: 10000, percentage: 9.2 },
];

export const testLanguageStats: LanguageStats = {
  TypeScript: 45000,
  JavaScript: 30000,
  Go: 15000,
  Python: 10000,
  Rust: 3000,
  Java: 2000,
  "C++": 1000,
};

export const testRecentRepos = [
  {
    name: "test-repo-1",
    description: "Test repository 1",
    url: "https://github.com/user/test-repo-1",
    pushedAt: "2025-01-20T10:00:00Z",
    primaryLanguage: {
      name: "TypeScript",
      color: "#3178c6",
    },
  },
  {
    name: "test-repo-2",
    description: "Test repository 2",
    url: "https://github.com/user/test-repo-2",
    pushedAt: "2025-01-19T10:00:00Z",
    primaryLanguage: {
      name: "Go",
      color: "#00ADD8",
    },
  },
];

export const testGitHubApiResponse = {
  user: {
    repositories: {
      nodes: [
        {
          name: "repo1",
          languages: {
            edges: [
              {
                size: 45000,
                node: { name: "TypeScript", color: "#3178c6" },
              },
              {
                size: 30000,
                node: { name: "JavaScript", color: "#f1e05a" },
              },
            ],
          },
        },
        {
          name: "repo2",
          languages: {
            edges: [
              {
                size: 15000,
                node: { name: "Go", color: "#00ADD8" },
              },
              {
                size: 10000,
                node: { name: "Python", color: "#3572A5" },
              },
            ],
          },
        },
      ],
    },
  },
};
