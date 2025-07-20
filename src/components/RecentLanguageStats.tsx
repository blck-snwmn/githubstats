import type { JSX } from "hono/jsx";
import { languageColors } from "../lib/language-colors";

interface RecentLanguageStatsProps {
  languages: Array<{ language: string; bytes: number; percentage: number }>;
}

export function RecentLanguageStats({ languages }: RecentLanguageStatsProps): JSX.Element {
  return (
    <div
      style={{
        width: "400px",
        height: "150px",
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
        Recently Used Languages
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {languages.map((lang, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: languageColors[lang.language] || colors.language.default,
                  }}
                />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>{lang.language}</span>
              </div>
              <span style={{ fontSize: "14px", color: "#8b949e" }}>
                {lang.percentage.toFixed(1)}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "#161b22",
                borderRadius: "3px",
                overflow: "hidden",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: `${lang.percentage}%`,
                  height: "100%",
                  backgroundColor: languageColors[lang.language] || colors.language.default,
                  borderRadius: "3px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
