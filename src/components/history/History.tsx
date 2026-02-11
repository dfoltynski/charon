import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import axios from "axios";
import type { Environment, HistoryData } from "../../utils/types";
import { useCookies } from "react-cookie";
import { css } from "@emotion/css";

interface HistoryProps {
  environment: Environment;
}

interface HistoryResponse {
  history: HistoryData[];
  count: number;
}

const GREEN = "#32a852";

const styles = {
  historySection: css({
    marginTop: 18,
  }),

  tableCard: css({
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow:
      "0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
  }),

  tableInner: css({
    overflowX: "auto",
  }),

  table: css({
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 15,
    minWidth: 860,
    textAlign: "left",
    color: "rgba(255,255,255,0.88)",
  }),

  thead: css({
    position: "sticky",
    top: 0,
    zIndex: 1,
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(6px)",
  }),

  th: css({
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 0.25,
    color: "rgba(255,255,255,0.60)",
    padding: "14px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
  }),

  tr: css({
    "& td": {
      padding: "12px 18px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      whiteSpace: "nowrap",
      maxWidth: 320,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    "&:last-of-type td": {
      borderBottom: "none",
    },

    "&:hover td": {
      background: "rgba(255,255,255,0.04)",
    },
  }),

  tdMuted: css({
    color: "rgba(255,255,255,0.78)",
  }),

  sha: css({
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 14,
    letterSpacing: 0.2,
    color: "rgba(255,255,255,0.86)",
  }),

  envBadge: css({
    display: "inline-flex",
    alignItems: "center",
    height: 26,
    padding: "0 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
  }),

  pages: css({
    display: "flex",
    gap: 10,
    marginTop: 12,
  }),

  pageBtn: css({
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    userSelect: "none",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.80)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
    transition: "transform 0.05s ease, background 0.15s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.10)",
    },
    "&:active": {
      transform: "translateY(1px)",
    },
  }),

  activePage: css({
    background: `linear-gradient(180deg, ${GREEN}, #2c944a)`,
    borderColor: "rgba(50,168,82,0.95)",
    color: "#fff",
    boxShadow: "0 16px 32px rgba(0,0,0,0.40), 0 0 0 2px rgba(50,168,82,0.18)",
  }),
};

const RES_PER_PAGE = 5;

export const History = ({ environment }: HistoryProps) => {
  const [cookies] = useCookies(["access_token", "token_type"]);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGES_NUMBER = Math.ceil(count / RES_PER_PAGE);

  useEffect(() => {
    (async () => {
      const history = await axios.get<HistoryResponse>(
        `${API_URL}/history?environment=${environment}&page=${currentPage}&limit=${RES_PER_PAGE}`,
        {
          headers: {
            Authorization: `${cookies.token_type} ${cookies.access_token}`,
          },
        },
      );

      setHistory(history.data.history);
      setCount(history.data.count);
    })();
  }, [setHistory, cookies, environment, currentPage]);

  return (
    <div className={styles.historySection}>
      <div className={styles.tableCard}>
        <div className={styles.tableInner}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>User</th>
                <th className={styles.th}>Environment</th>
                <th className={styles.th}>Commit</th>
                <th className={styles.th}>Project</th>
                <th className={styles.th}>Time</th>
              </tr>
            </thead>

            <tbody>
              {history.map((h: HistoryData, i: number) => (
                <tr key={i} className={styles.tr}>
                  <td className={styles.tdMuted}>{h.name}</td>

                  <td>
                    <span className={styles.envBadge}>{h.environment}</span>
                  </td>

                  <td className={styles.sha}>{h.commitsha}</td>

                  <td className={styles.tdMuted}>{h.projectname}</td>

                  <td className={styles.tdMuted}>{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.pages}>
        {[...Array(PAGES_NUMBER)].map((_, i) => {
          const page = i + 1;
          return (
            <div
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`${styles.pageBtn} ${
                currentPage === page ? styles.activePage : ""
              }`}
            >
              {page}
            </div>
          );
        })}
      </div>
    </div>
  );
};
