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

const styles = {
  wrap: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }),

  table: css({
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 14,
    minWidth: 800,
    textAlign: "center",
  }),

  thead: css({
    position: "sticky",
    top: 0,
    zIndex: 1,
  }),

  th: css({
    fontWeight: 600,
    padding: "12px 14px",
    borderBottom: "1px solid rgba(0,0,0,0.12)",
    whiteSpace: "nowrap",
  }),

  tr: css({
    "&:nth-of-type(even) td": {
      background: "rgba(0,0,0,0.02)",
    },
    "&:hover td": {
      background: "rgba(0,0,0,0.06)",
    },
  }),

  td: css({
    padding: "12px 14px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    whiteSpace: "nowrap",
    maxWidth: 240,
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),

  sha: css({
    fontFamily: "monospace",
    fontSize: 13,
  }),

  pages: css({
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  }),

  page: css({
    padding: "6px 10px",
    border: "1px solid rgba(0,0,0,0.2)",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      background: "rgba(0,0,0,0.06)",
    },
  }),

  activePage: css({
    background: "#111",
    color: "#fff",
    borderColor: "#111",
  }),
  historySection: css({
    marginTop: 18,
  }),

  tableCard: css({
    overflow: "hidden",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
  }),

  tableHeaderBar: css({
    height: 54,
    background: "rgba(255,255,255,0.92)",
    borderBottom: "1px solid rgba(0,0,0,0.15)",
  }),

  tdMuted: css({
    color: "rgba(255,255,255,0.75)",
  }),

  ellipsis: css({
    maxWidth: 280,
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),

  pageBtn: css({
    width: 44,
    height: 44,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    userSelect: "none",
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.85)",
    transition: "all 0.15s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.08)",
    },
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
                <td className={`${styles.tdMuted} ${styles.ellipsis}`}>
                  {h.name}
                </td>

                <td className={styles.tdMuted}>{h.environment}</td>

                <td className={styles.sha}>{h.commitsha}</td>

                <td className={styles.tdMuted}>{h.projectname}</td>

                <td className={styles.tdMuted}>{h.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
