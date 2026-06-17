import type { CSSProperties } from "hono/jsx";
import type { WeeklyRepositoryActivity } from "../../../services/github/types";
import { Card } from "../../../shared/components/Card/Card";
import { colors } from "../../../shared/lib/colors";
import { fonts } from "../../../shared/lib/fonts";

interface WeeklyActivityStatsProps {
  repositories: WeeklyRepositoryActivity[];
}

const DAY_KEYS = ["day-1", "day-2", "day-3", "day-4", "day-5", "day-6", "day-7"];

function getActivityColor(count: number): string {
  if (count >= 7) {
    return "#39d353";
  }

  if (count >= 2) {
    return "#26a641";
  }

  if (count >= 1) {
    return "#0e4429";
  }

  return colors.background.secondary;
}

export function WeeklyActivityStats({ repositories }: WeeklyActivityStatsProps) {
  const repoItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: fonts.size.body,
    gap: "16px",
  };

  const repoNameStyle: CSSProperties = {
    fontWeight: fonts.weight.medium,
    color: colors.text.primary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "190px",
  };

  const cellsStyle: CSSProperties = {
    display: "flex",
    gap: "5px",
    flexShrink: 0,
  };

  const cellStyle = (count: number): CSSProperties => ({
    width: "12px",
    height: "12px",
    borderRadius: "3px",
    backgroundColor: getActivityColor(count),
    border: count === 0 ? "1px solid rgba(255, 255, 255, 0.10)" : "1px solid transparent",
    boxSizing: "border-box",
  });

  return (
    <Card title="Weekly Activity">
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {repositories.map((repo) => (
          <div key={repo.name} style={repoItemStyle}>
            <span style={repoNameStyle}>{repo.name}</span>
            <div style={cellsStyle}>
              {repo.dailyCounts.map((count, index) => {
                const dayKey = DAY_KEYS[index] ?? `day-${repo.dailyCounts.length}`;

                return <div key={`${repo.name}-${dayKey}`} style={cellStyle(count)} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
