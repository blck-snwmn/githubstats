import type { CSSProperties } from "hono/jsx";
import type { RecentRepository } from "../../../services/github/types";
import { colors } from "../../../shared/lib/colors";
import { fonts } from "../../../shared/lib/fonts";
import { Card } from "../../../shared/components/Card/Card";
import { colorDotStyle, getLanguageColor } from "../../../shared/lib/language-colors";

interface RecentReposStatsProps {
  repositories: RecentRepository[];
}

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

export function RecentReposStats({ repositories }: RecentReposStatsProps) {
  const repoItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: fonts.size.body,
  };

  const repoNameStyle: CSSProperties = {
    fontWeight: fonts.weight.medium,
    color: colors.text.primary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "200px",
  };

  const languageContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const languageNameStyle: CSSProperties = {
    color: colors.text.secondary,
    fontSize: fonts.size.small,
  };

  const timeStyle: CSSProperties = {
    color: colors.text.secondary,
    fontSize: fonts.size.small,
    flexShrink: 0,
  };

  return (
    <Card title="Recently Updated">
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {repositories.map((repo) => (
          <div key={repo.name} style={repoItemStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <span style={repoNameStyle}>{repo.name}</span>
              {repo.primaryLanguage && (
                <div style={languageContainerStyle}>
                  <div style={colorDotStyle(8, getLanguageColor(repo.primaryLanguage))} />
                  <span style={languageNameStyle}>{repo.primaryLanguage.name}</span>
                </div>
              )}
            </div>
            <span style={timeStyle}>{formatDate(repo.pushedAt)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
