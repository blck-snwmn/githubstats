interface LanguageStats {
  [language: string]: number;
}

interface RepositoryNode {
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
}

interface GraphQLResponse<T> {
  errors?: Array<{ message: string }>;
  data?: T;
}

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const USER_LANGUAGE_QUERY = `
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

const RECENT_LANGUAGE_QUERY = `
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

async function executeGraphQLQuery<T>(
  query: string,
  variables: Record<string, unknown>,
  githubToken: string,
): Promise<T> {
  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${githubToken}`,
      "User-Agent": "readmewk-svg-generator",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as GraphQLResponse<T>;

  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  if (!data.data) {
    throw new Error("No data returned from GraphQL");
  }

  return data.data;
}

function processLanguageData(repositories: RepositoryNode[]): LanguageStats {
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

interface UserRepositoriesData {
  user: {
    repositories: {
      edges: Array<{ node: RepositoryNode }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

export async function fetchUserLanguageStats(
  username: string,
  githubToken?: string,
): Promise<LanguageStats> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  const allLanguageBytes: LanguageStats = {};
  let hasNextPage = true;
  let cursor: string | null = null;

  try {
    while (hasNextPage) {
      // eslint-disable-next-line no-await-in-loop
      const response: UserRepositoriesData = await executeGraphQLQuery<UserRepositoriesData>(
        USER_LANGUAGE_QUERY,
        { username, cursor },
        githubToken,
      );

      const repositories = response.user.repositories;
      if (!repositories) {
        throw new Error("User not found or no repositories");
      }

      // Process and merge language data
      const pageLanguageBytes = processLanguageData(
        repositories.edges.map((edge: { node: RepositoryNode }) => edge.node),
      );

      for (const [language, bytes] of Object.entries(pageLanguageBytes)) {
        allLanguageBytes[language] = (allLanguageBytes[language] || 0) + bytes;
      }

      hasNextPage = repositories.pageInfo.hasNextPage;
      cursor = repositories.pageInfo.endCursor;
    }

    return allLanguageBytes;
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

const RECENT_REPOSITORIES_QUERY = `
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

interface RecentRepositoriesQueryData {
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
}

export async function fetchRecentRepositories(
  username: string,
  githubToken?: string,
  limit: number = 5,
): Promise<RecentRepository[]> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  try {
    const data = await executeGraphQLQuery<RecentRepositoriesQueryData>(
      RECENT_REPOSITORIES_QUERY,
      { username, limit },
      githubToken,
    );

    if (!data.user?.repositories) {
      throw new Error("User not found or no repositories");
    }
    const repositories = data.user.repositories;

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

interface RecentRepositoriesData {
  user: {
    repositories: {
      edges: Array<{ node: RepositoryNode }>;
    };
  };
}

export async function fetchRecentLanguageStats(
  username: string,
  githubToken?: string,
  repoLimit: number = 20,
): Promise<LanguageStats> {
  if (!githubToken) {
    throw new Error("GitHub token is required for API access");
  }

  try {
    const data = await executeGraphQLQuery<RecentRepositoriesData>(
      RECENT_LANGUAGE_QUERY,
      { username, repoLimit },
      githubToken,
    );

    if (!data.user?.repositories) {
      throw new Error("User not found or no repositories");
    }
    const repositories = data.user.repositories;

    // Process language data from recent repositories
    return processLanguageData(repositories.edges.map((edge) => edge.node));
  } catch (error) {
    console.error("Error fetching recent language stats:", error);
    throw error;
  }
}
