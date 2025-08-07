// GitHub GraphQL API client

import type { GraphQLResponse } from "./types";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export async function executeGraphQLQuery<T>(
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
