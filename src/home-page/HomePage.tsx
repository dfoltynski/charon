import { css } from "@emotion/css";
import axios from "axios";
import { useEffect, useState } from "react";
import { History } from "../components/history/History";
import { debounce } from "../utils/debounce";
import {
  GITHUB_ORGANIZATION_NAME,
  GITHUB_TOKEN,
} from "../utils/environment-variables";

const styles = {
  projectSelectorContainer: css({
    backgroundColor: "#666",
    height: "40px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
  }),

  selectWrap: css({
    position: "relative",
    width: "250px",
    height: "40px",
  }),

  arrowBox: css({
    position: "absolute",
    right: 0,
    top: 0,
    width: "40px",
    height: "40px",
    background: "#666",
    pointerEvents: "none",
  }),

  arrow: css({
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-35%)",
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: "5px solid white",
    pointerEvents: "none",
    zIndex: 2,
  }),

  select: css({
    width: "100%",
    height: "40px",
    padding: "0 50px 0 10px",
    background: "#666",
    color: "#fff",
    border: "none",
    outline: "none",
    borderRadius: 0,
    boxSizing: "border-box",
    fontSize: "14px",

    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",

    "&:hover": {
      background: "#666",
    },

    "&:focus": {
      boxShadow: "0 0 0 2px rgba(255,255,255,0.12)",
    },
  }),

  buttons: css({
    display: "flex",
    padding: "10px",
    justifyContent: "space-between",
    fontSize: 24,
  }),
  environment: css({
    padding: "10px",
  }),
  active: css({
    transition: "0.2s ease-in-out",
    backgroundColor: "#32a852",
  }),

  branchSelectorContainer: css({
    margin: "10px 0",
  }),
  branchInput: css({
    width: "100%",
    height: "40px",
    padding: "0 50px 0 10px",
    background: "#666",
    color: "#fff",
    border: "1px solid #666",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "14px",

    "&:focus": {
      boxShadow: "0 0 0 2px rgba(255,255,255,0.12)",
    },
  }),

  branchInvalid: css({
    border: "1px solid #d64545",
    boxShadow: "0 0 0 1px rgba(214,69,69,0.6)",
  }),

  deployButton: css({
    height: "40px",
    padding: "0 16px",
    backgroundColor: "#32a852",
    color: "#fff",
    border: "none",
    outline: "none",
    fontSize: "14px",
    cursor: "pointer",
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "&:hover": {
      backgroundColor: "#2c944a",
    },

    "&:active": {
      backgroundColor: "#257d3f",
    },

    "&:focus": {
      boxShadow: "0 0 0 2px rgba(255,255,255,0.12)",
    },
  }),
};

interface GithubRepositories {
  name: string;
  full_name: string;
  url: string;
}

export const HomePage = () => {
  const [projects, setProjects] = useState<GithubRepositories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [environment, setEnvironment] = useState<string>("");
  const [invalidBranch, setInvalidBranch] = useState(false);
  const isPreview = environment === "preview";
  const [branch, setBranch] = useState<string>("");
  const [hasError, setHasError] = useState(false);

  const updateBranch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setBranch(next);
    if (next.length > 0) validateBranchDebounced(next);
  };

  const validateBranchDebounced = debounce(async (branch: string) => {
    try {
      const res = await axios(
        `https://api.github.com/repos/${GITHUB_ORGANIZATION_NAME}/${selectedProject}/branches/${branch}`,
      );
      console.log("asdasd", res.status);
      if (res.status !== 200) {
        setInvalidBranch(true);
      } else {
        setInvalidBranch(false);
      }
    } catch (_e) {
      setInvalidBranch(true);
    }
  }, 500);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios<GithubRepositories[]>(
          `https://api.github.com/users/${GITHUB_ORGANIZATION_NAME}/repos`,
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );

        setProjects(
          res.data.map((repo) => ({
            name: repo.name,
            full_name: repo.full_name,
            url: repo.url,
          })),
        );
        setIsLoading(false);
        setHasError(false);
      } catch (_e) {
        setHasError(true);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (hasError) {
    return <>An error has occured... Check configuration</>;
  }

  return (
    <>
      <div className={styles.projectSelectorContainer}>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.full_name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <div className={styles.arrowBox} />
          <div className={styles.arrow} />
        </div>
      </div>
      <div
        className={`${invalidBranch && styles.branchInvalid} ${styles.projectSelectorContainer} ${styles.branchSelectorContainer} `}
      >
        <div className={styles.selectWrap}>
          <input
            type="text"
            placeholder="branch-name"
            value={branch}
            onChange={updateBranch}
            className={styles.branchInput}
          />
          <div className={styles.arrowBox} />
        </div>
      </div>
      <div className={styles.buttons}>
        <div
          className={`${styles.environment} ${isPreview && styles.active}`}
          onClick={() => setEnvironment("preview")}
        >
          Preview
        </div>
        <div
          className={`${styles.environment} ${!isPreview && styles.active}`}
          onClick={() => setEnvironment("staging")}
        >
          Staging
        </div>
      </div>
      <button className={styles.deployButton}>Deploy!</button>

      <History />
    </>
  );
};
