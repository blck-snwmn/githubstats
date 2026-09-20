// GraphQL queries for GitHub API

export const RECENT_LANGUAGE_QUERY = `
  query($username: String!, $repoLimit: Int!) {
    user(login: $username) {
      repositories(
        first: $repoLimit
        ownerAffiliations: OWNER
        isFork: false
        isArchived: false
        orderBy: {field: PUSHED_AT, direction: DESC}
      ) {
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

export const RECENT_REPOSITORIES_QUERY = `
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

export const WEEKLY_ACTIVITY_QUERY = `
  query($username: String!, $repoLimit: Int!, $since: GitTimestamp!, $until: GitTimestamp!) {
    user(login: $username) {
      repositories(first: $repoLimit, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
        edges {
          node {
            name
            isFork
            defaultBranchRef {
              target {
                targetType: __typename
                ... on Commit {
                  history(first: 100, since: $since, until: $until) {
                    totalCount
                    nodes {
                      committedDate
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
