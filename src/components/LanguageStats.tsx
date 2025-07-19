import type { CSSProperties } from "hono/jsx";

interface LanguageData {
  language: string;
  bytes: number;
  percentage: number;
}

interface LanguageStatsProps {
  username: string;
  languages: LanguageData[];
}

// Language colors based on GitHub's language colors
const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  React: "#61dafb",
  Svelte: "#ff3e00",
};

export const LanguageStats = ({ username, languages }: LanguageStatsProps) => {
  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "60px",
    backgroundColor: "#0d1117",
    color: "#c9d1d9",
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "40px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "8px",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "20px",
    color: "#8b949e",
  };

  const languagesContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const languageItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const languageNameStyle: CSSProperties = {
    fontSize: "18px",
    fontWeight: "500",
    width: "120px",
    textAlign: "right",
  };

  const barContainerStyle: CSSProperties = {
    display: "flex",
    flex: "1",
    height: "32px",
    backgroundColor: "#161b22",
    borderRadius: "6px",
    overflow: "hidden",
    position: "relative",
  };

  const percentageStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: "500",
    width: "80px",
    textAlign: "right",
    color: "#8b949e",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>@{username}'s Language Stats</h1>
        <p style={subtitleStyle}>Top 10 most used programming languages</p>
      </div>

      <div style={languagesContainerStyle}>
        {languages.map((lang) => {
          const barStyle: CSSProperties = {
            height: "100%",
            width: `${lang.percentage}%`,
            backgroundColor: languageColors[lang.language] || "#586069",
            transition: "width 0.3s ease",
          };

          return (
            <div key={lang.language} style={languageItemStyle}>
              <span style={languageNameStyle}>{lang.language}</span>
              <div style={barContainerStyle}>
                <div style={barStyle} />
              </div>
              <span style={percentageStyle}>{lang.percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
