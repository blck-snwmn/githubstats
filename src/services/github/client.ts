// GitHub GraphQL API client

import type { GraphQLResponse } from "./types";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

function isGraphQLResponse<T>(value: unknown): value is GraphQLResponse<T> {
  return typeof value === "object" && value !== null && ("data" in value || "errors" in value);
}

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

  const payload = await response.json();
  if (!isGraphQLResponse<T>(payload)) {
    throw new Error(`Unexpected GraphQL response: ${JSON.stringify(payload)}`);
  }

  if (payload.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(payload.errors)}`);
  }

  if (!payload.data) {
    throw new Error("No data returned from GraphQL");
  }

  return payload.data;
}
