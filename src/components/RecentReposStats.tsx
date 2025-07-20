import type { JSX } from "hono/jsx";
import type { RecentRepository } from "../lib/github-api";
import { languageColors } from "../lib/language-colors";

interface RecentReposStatsProps {
  repositories: RecentRepository[];
}

export function RecentReposStats({ repositories }: RecentReposStatsProps): JSX.Element {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}w ago`;
    }
    const months = Math.floor(diffDays / 30);
    return `${months}mo ago`;
  };

  return (
    <div
      style={{
        width: "400px",
        height: "200px",
        backgroundColor: "#0d1117",
        borderRadius: "8px",
        padding: "8px 16px 12px",
        fontFamily: "Inter, sans-serif",
        color: "#c9d1d9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          fontSize: "16px",
          fontWeight: "600",
          margin: 0,
          marginBottom: "8px",
          color: "#58a6ff",
        }}
      >
        Recently Updated
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {repositories.map((repo, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <span
                style={{
                  fontWeight: "500",
                  color: "#c9d1d9",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "200px",
                }}
              >
                {repo.name}
              </span>
              {repo.primaryLanguage && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor:
                        languageColors[repo.primaryLanguage.name] ||
                        repo.primaryLanguage.color ||
                        "#586069",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#8b949e" }}>
                    {repo.primaryLanguage.name}
                  </span>
                </div>
              )}
            </div>
            <span style={{ fontSize: "12px", color: "#8b949e", flexShrink: 0 }}>
              {formatDate(repo.pushedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
