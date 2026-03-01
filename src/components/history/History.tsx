import { css } from "@emotion/css";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { API_URL } from "../../config";

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
    flexWrap: "wrap",
    alignItems: "center",
  }),

  pageBtn: css({
    height: 40,
    padding: "0 14px",
    borderRadius: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    cursor: "pointer",
    userSelect: "none",

    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.86)",

    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
    transition:
      "transform 0.06s ease, background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",

    "&:hover": {
      background: "rgba(255,255,255,0.10)",
      borderColor: "rgba(255,255,255,0.14)",
    },

    "&:active": {
      transform: "translateY(1px)",
    },

    "&:focus-visible": {
      outline: "none",
      boxShadow:
        "0 10px 24px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,255,255,0.18)",
      borderColor: "rgba(255,255,255,0.22)",
    },
  }),

  primaryBtn: css({
    background: `linear-gradient(180deg, ${GREEN}, #2c944a)`,
    borderColor: "rgba(50,168,82,0.95)",
    color: "#fff",
    boxShadow: "0 16px 32px rgba(0,0,0,0.40), 0 0 0 2px rgba(50,168,82,0.18)",

    "&:hover": {
      background: `linear-gradient(180deg, #3ad46b, ${GREEN})`,
      borderColor: "rgba(58,212,107,0.95)",
    },

    "&:focus-visible": {
      boxShadow: "0 16px 32px rgba(0,0,0,0.40), 0 0 0 3px rgba(50,168,82,0.25)",
    },
  }),

  disabledPage: css({
    cursor: "not-allowed",
    opacity: 0.55,
    background: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.08)",
    boxShadow: "none",
    transform: "none",

    "&:hover": {
      background: "rgba(255,255,255,0.04)",
      borderColor: "rgba(255,255,255,0.08)",
    },

    "&:active": {
      transform: "none",
    },
  }),
};
const RES_PER_PAGE = 5;

export type HistoryData = {
  id: string;
  environment: string;
  name: string | null;
  time: string;
  commitsha: string | null;
  projectname: string | null;
};

export type HistoryResponse = {
  history: HistoryData[];
  nextCursor: string | null;
  hasMore: boolean;
};

type HistoryProps = {
  environment: string;
};

export const History = ({ environment }: HistoryProps) => {
  const [cookies] = useCookies(["access_token", "token_type"]);

  const [history, setHistory] = useState<HistoryData[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [browsingOlder, setBrowsingOlder] = useState(false);

  const authHeader = useMemo(() => {
    const t = cookies.token_type;
    const a = cookies.access_token;
    return t && a ? `${t} ${a}` : "";
  }, [cookies.token_type, cookies.access_token]);

  const fetchFirstPage = useCallback(async () => {
    const res = await axios.get<HistoryResponse>(
      `${API_URL}/history?environment=${encodeURIComponent(environment)}&limit=${RES_PER_PAGE}`,
      {
        headers: { Authorization: authHeader },
      },
    );

    setHistory(res.data.history);
    setNextCursor(res.data.nextCursor);
    setHasMore(res.data.hasMore);
    setBrowsingOlder(false);
  }, [authHeader, environment]);

  const fetchNextPage = useCallback(async () => {
    if (!nextCursor) return;

    const res = await axios.get<HistoryResponse>(
      `${API_URL}/history?environment=${encodeURIComponent(environment)}&limit=${RES_PER_PAGE}&cursor=${encodeURIComponent(nextCursor)}`,
      {
        headers: { Authorization: authHeader },
      },
    );

    setHistory((prev) => [...prev, ...res.data.history]);
    setNextCursor(res.data.nextCursor);
    setHasMore(res.data.hasMore);
    setBrowsingOlder(true);
  }, [authHeader, environment, nextCursor]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFirstPage();
  }, [fetchFirstPage]);

  useEffect(() => {
    if (browsingOlder) return;

    const interval = setInterval(() => {
      fetchFirstPage();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchFirstPage, browsingOlder]);

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
              {history.map((h, i) => (
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
        <div
          className={styles.pageBtn}
          onClick={fetchFirstPage}
          role="button"
          tabIndex={0}
        >
          Refresh
        </div>

        <div
          className={`${styles.pageBtn} ${styles.primaryBtn} ${
            !hasMore ? styles.disabledPage : ""
          }`}
          onClick={() => {
            if (!hasMore) return;
            fetchNextPage();
          }}
          role="button"
          tabIndex={0}
          aria-disabled={!hasMore}
        >
          {hasMore ? "Load more" : "No more"}
        </div>

        {browsingOlder && (
          <div
            className={styles.pageBtn}
            onClick={fetchFirstPage}
            role="button"
            tabIndex={0}
          >
            Back to latest
          </div>
        )}
      </div>
    </div>
  );
};
