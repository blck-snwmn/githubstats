// Type definitions for GitHub API

export interface RepositoryNode {
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

export interface GraphQLResponse<T> {
  errors?: Array<{ message: string }>;
  data?: T;
}

export interface UserRepositoriesData {
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

export interface RecentRepositoriesData {
  user: {
    repositories: {
      edges: Array<{ node: RepositoryNode }>;
    };
  };
}

export interface RecentRepository {
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
  pushedAt: string;
}

export interface RecentRepositoriesQueryData {
  user: {
    repositories: {
      totalCount: number;
      edges: Array<{ node: RecentRepository }>;
    };
  };
}
