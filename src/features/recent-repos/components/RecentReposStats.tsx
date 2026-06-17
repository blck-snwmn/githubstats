import type { CSSProperties } from "hono/jsx";
import type { RecentRepository } from "../../../services/github/types";
import { colors } from "../../../shared/lib/colors";
import { fonts } from "../../../shared/lib/fonts";
import { Card } from "../../../shared/components/Card/Card";
import { colorDotStyle, getLanguageColor } from "../../../shared/lib/language-colors";

interface RecentReposStatsProps {
  repositories: RecentRepository[];
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
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
    maxWidth: "160px",
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
    fontVariantNumeric: "tabular-nums",
    flexShrink: 0,
    width: "116px",
    textAlign: "right",
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
