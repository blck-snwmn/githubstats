import type { CSSProperties } from "hono/jsx";

interface CardProps {
  title: string;
  description: string;
  author?: string;
  date?: string;
}

export const Card = ({ title, description, author, date }: CardProps) => {
  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "48px",
    backgroundColor: "#1a1a1a",
    backgroundImage: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  };

  const titleStyle: CSSProperties = {
    fontSize: "60px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "24px",
    lineHeight: "1.2",
  };

  const descriptionStyle: CSSProperties = {
    fontSize: "24px",
    color: "#a0a0a0",
    marginBottom: "32px",
    lineHeight: "1.4",
  };

  const footerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  };

  const authorStyle: CSSProperties = {
    fontSize: "20px",
    color: "#808080",
  };

  const dateStyle: CSSProperties = {
    fontSize: "18px",
    color: "#606060",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{title}</h1>
      <p style={descriptionStyle}>{description}</p>
      <div style={footerStyle}>
        {author && <span style={authorStyle}>{author}</span>}
        {date && <span style={dateStyle}>{date}</span>}
      </div>
    </div>
  );
};
