import React from "react";
import { css } from "@emotion/css";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

const styles = {
  button: css({
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",

    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #1f2937",

    background: "#0f172a",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,

    cursor: "pointer",
    transition:
      "background-color 120ms ease, transform 80ms ease, box-shadow 120ms ease",

    /* nested selectors MUST be strings */
    "& svg": {
      width: "20px",
      height: "20px",
      fill: "currentColor",
    },

    "&:hover:not(:disabled)": {
      background: "#111827",
      transform: "translateY(-1px)",
      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
    },

    "&:active:not(:disabled)": {
      transform: "translateY(0)",
      boxShadow: "none",
    },

    "&:focus-visible": {
      outline: "none",
      boxShadow: "0 0 0 2px #334155",
    },

    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  }),
};

export const GitHubLoginButton: React.FC<Props> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`${styles.button}`}
      onClick={onClick}
      disabled={disabled}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.87.5 12.43c0 5.24 3.44 9.68 8.2 11.25.6.11.82-.27.82-.59v-2.1c-3.34.76-4.04-1.66-4.04-1.66-.55-1.43-1.34-1.8-1.34-1.8-1.09-.78.08-.77.08-.77 1.2.09 1.83 1.28 1.83 1.28 1.07 1.89 2.8 1.34 3.48 1.02.11-.8.42-1.34.76-1.65-2.66-.31-5.47-1.38-5.47-6.14 0-1.36.46-2.47 1.23-3.34-.12-.31-.53-1.57.12-3.27 0 0 1-.33 3.3 1.28a11.2 11.2 0 0 1 6 0c2.3-1.61 3.3-1.28 3.3-1.28.65 1.7.24 2.96.12 3.27.77.87 1.23 1.98 1.23 3.34 0 4.78-2.82 5.82-5.5 6.12.43.39.82 1.15.82 2.32v3.44c0 .32.22.7.82.59 4.77-1.57 8.2-6.01 8.2-11.25C23.5 5.87 18.27.5 12 .5Z" />
      </svg>
      <span>Continue with GitHub</span>
    </button>
  );
};
