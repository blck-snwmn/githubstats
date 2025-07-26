import type { CSSProperties } from "hono/jsx";
import type { LanguageData } from "../types/language";
import { colors } from "../lib/colors";
import { fonts } from "../lib/fonts";
import { Card } from "./Card";
import { colorDotStyle, getLanguageColor } from "../lib/language-colors";
import { ProgressBar } from "./ProgressBar";

interface RecentLanguageStatsProps {
  languages: LanguageData[];
}

export function RecentLanguageStats({ languages }: RecentLanguageStatsProps) {
  const languageItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const languageNameContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const languageNameStyle: CSSProperties = {
    fontSize: fonts.size.body,
    fontWeight: fonts.weight.medium,
  };

  const percentageStyle: CSSProperties = {
    fontSize: fonts.size.body,
    color: colors.text.secondary,
  };

  return (
    <Card title="Recently Used Languages">
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {languages.map((lang) => {
          const color = getLanguageColor(lang.language);
          return (
            <div
              key={lang.language}
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <div style={languageItemStyle}>
                <div style={languageNameContainerStyle}>
                  <div style={colorDotStyle(12, color)} />
                  <span style={languageNameStyle}>{lang.language}</span>
                </div>
                <span style={percentageStyle}>{lang.percentage.toFixed(1)}%</span>
              </div>
              <ProgressBar percentage={lang.percentage} color={color} height={6} borderRadius={3} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
