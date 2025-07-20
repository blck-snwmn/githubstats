interface LanguageStats {
  [language: string]: number;
}

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export async function fetchUserLanguageStats(
  username: string,
  githubToken?: string,
): Promise<LanguageStats> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  const query = `
    query($username: String!, $cursor: String) {
      user(login: $username) {
        repositories(first: 100, after: $cursor, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
          edges {
            node {
              name
              isFork
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  const languageBytes: LanguageStats = {};
  let hasNextPage = true;
  let cursor: string | null = null;

  try {
    while (hasNextPage) {
      const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${githubToken}`,
          "User-Agent": "readmewk-svg-generator",
        },
        body: JSON.stringify({
          query,
          variables: { username, cursor },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as {
        errors?: Array<{ message: string }>;
        data?: {
          user: {
            repositories: {
              edges: Array<{
                node: {
                  name: string;
                  isFork: boolean;
                  languages: {
                    edges: Array<{
                      size: number;
                      node: {
                        name: string;
                        color: string | null;
                      };
                    }>;
                  };
                };
              }>;
              pageInfo: {
                hasNextPage: boolean;
                endCursor: string | null;
              };
            };
          };
        };
      };

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const repositories = data.data?.user?.repositories;

      if (!repositories) {
        throw new Error("User not found or no repositories");
      }

      // Process language data
      for (const edge of repositories.edges) {
        if (!edge.node.isFork) {
          const languages = edge.node.languages.edges;
          for (const langEdge of languages) {
            const language = langEdge.node.name;
            const size = langEdge.size;
            languageBytes[language] = (languageBytes[language] || 0) + size;
          }
        }
      }

      hasNextPage = repositories.pageInfo.hasNextPage;
      cursor = repositories.pageInfo.endCursor;
    }

    return languageBytes;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
}

export function getTopLanguages(
  languageStats: LanguageStats,
  limit: number = 10,
): Array<{ language: string; bytes: number; percentage: number }> {
  // First get the top languages
  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);

  // Calculate total bytes only from top languages for percentage
  const topLanguagesTotalBytes = topLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);

  return topLanguages.map(([language, bytes]) => ({
    language,
    bytes,
    percentage: (bytes / topLanguagesTotalBytes) * 100,
  }));
}

export interface RecentRepository {
  name: string;
  pushedAt: string;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
}

export async function fetchRecentRepositories(
  username: string,
  githubToken?: string,
  limit: number = 5,
): Promise<RecentRepository[]> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  const query = `
    query($username: String!, $limit: Int!) {
      user(login: $username) {
        repositories(first: $limit, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
          edges {
            node {
              name
              pushedAt
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "readmewk-svg-generator",
      },
      body: JSON.stringify({
        query,
        variables: { username, limit },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as {
      errors?: Array<{ message: string }>;
      data?: {
        user: {
          repositories: {
            edges: Array<{
              node: {
                name: string;
                pushedAt: string;
                primaryLanguage: {
                  name: string;
                  color: string | null;
                } | null;
              };
            }>;
          };
        };
      };
    };

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const repositories = data.data?.user?.repositories;

    if (!repositories) {
      throw new Error("User not found or no repositories");
    }

    return repositories.edges.map((edge) => ({
      name: edge.node.name,
      pushedAt: edge.node.pushedAt,
      primaryLanguage: edge.node.primaryLanguage,
    }));
  } catch (error) {
    console.error("Error fetching recent repositories:", error);
    throw error;
  }
}

export async function fetchRecentLanguageStats(
  username: string,
  githubToken?: string,
  repoLimit: number = 20,
): Promise<LanguageStats> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  const query = `
    query($username: String!, $repoLimit: Int!) {
      user(login: $username) {
        repositories(first: $repoLimit, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
          edges {
            node {
              name
              isFork
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const languageBytes: LanguageStats = {};

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "readmewk-svg-generator",
      },
      body: JSON.stringify({
        query,
        variables: { username, repoLimit },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as {
      errors?: Array<{ message: string }>;
      data?: {
        user: {
          repositories: {
            edges: Array<{
              node: {
                name: string;
                isFork: boolean;
                languages: {
                  edges: Array<{
                    size: number;
                    node: {
                      name: string;
                      color: string | null;
                    };
                  }>;
                };
              };
            }>;
          };
        };
      };
    };

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const repositories = data.data?.user?.repositories;

    if (!repositories) {
      throw new Error("User not found or no repositories");
    }

    // Process language data
    for (const edge of repositories.edges) {
      if (!edge.node.isFork) {
        const languages = edge.node.languages.edges;
        for (const langEdge of languages) {
          const language = langEdge.node.name;
          const size = langEdge.size;
          languageBytes[language] = (languageBytes[language] || 0) + size;
        }
      }
    }

    return languageBytes;
  } catch (error) {
    console.error("Error fetching recent language stats:", error);
    throw error;
  }
}
