import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import axios from "axios";
import type { Environment, HistoryData } from "../../utils/types";
import { useCookies } from "react-cookie";
import { css } from "@emotion/css";

interface HistoryProps {
  environment: Environment;
}

const styles = {
  table: css({
    position: "absolute",
    width: "100%",
    left: "50%",
    transform: "translateX(-50%)",

    "& tr": {
      display: "flex",
      justifyContent: "space-evenly",
      padding: "25px 25% 0 25%",
    },
  }),
};

export const History = ({ environment }: HistoryProps) => {
  const [cookies] = useCookies(["access_token", "token_type"]);
  const [history, setHistory] = useState<HistoryData[]>([]);
  useEffect(() => {
    (async () => {
      const history = await axios.get(
        `${API_URL}/history?environment=${environment}`,
        {
          headers: {
            Authorization: `${cookies.token_type} ${cookies.access_token}`,
          },
        },
      );

      setHistory(history.data.history);
    })();
  }, [setHistory, cookies, environment]);

  return (
    <table className={styles.table}>
      <tbody>
        {history.map((h) => (
          <tr>
            <td>{h.name}</td>
            <td>{h.environment}</td>
            <td>{h.branchname}</td>
            <td>{h.projectname}</td>
            <td>{h.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
