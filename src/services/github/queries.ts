// GraphQL queries for GitHub API

export const USER_LANGUAGE_QUERY = `
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

export const RECENT_LANGUAGE_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(first: 20, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
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
