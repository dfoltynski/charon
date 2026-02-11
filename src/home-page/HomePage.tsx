import { css } from "@emotion/css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History } from "../components/history/History";
import { API_URL, GITHUB_API_URL } from "../config";
import { useValidateGithubAccessToken } from "../login-page/hooks/useValidateGithubAccessToken";
import {
  GITHUB_ORGANIZATION_NAME,
  GITHUB_TOKEN,
} from "../utils/environment-variables";
import { useValidateBranchDebounced } from "./hooks/useValidateBranchDebounced";
import { useCookies } from "react-cookie";
import type { Environment } from "../utils/types";

const GREEN = "#32a852";

const styles = {
  page: css({
    minHeight: "100vh",
    padding: "56px 18px",
    color: "rgba(255,255,255,0.88)",
    display: "flex",
    justifyContent: "center",
  }),

  container: css({
    width: "100%",
    maxWidth: 1120,
  }),

  header: css({
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  }),

  title: css({
    fontSize: 34,
    fontWeight: 600,
    letterSpacing: -0.3,
    color: "rgba(255,255,255,0.92)",
  }),

  subtitle: css({
    marginTop: 6,
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
  }),

  statusPill: css({
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    whiteSpace: "nowrap",
  }),

  dot: css({
    width: 10,
    height: 10,
    borderRadius: 999,
    background: GREEN,
  }),

  hero: css({
    borderRadius: 16,
    padding: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
  }),

  grid: css({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
    "@media (min-width: 900px)": {
      gridTemplateColumns: "1.1fr 0.9fr",
      gap: 16,
      alignItems: "start",
    },
  }),

  stack: css({
    display: "grid",
    gap: 12,
  }),

  card: css({
    borderRadius: 14,
    padding: 14,
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.08)",
  }),

  cardTitle: css({
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.62)",
    letterSpacing: 0.2,
    marginBottom: 10,
  }),

  // Form controls
  control: css({
    height: 54,
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",

    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    "&:focus-within": {
      borderColor: "rgba(255,255,255,0.18)",
    },
  }),

  selectWrap: css({
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  }),

  select: css({
    width: "100%",
    height: "100%",
    padding: "0 54px 0 16px",
    background: "transparent",
    color: "rgba(255,255,255,0.92)",
    border: "none",
    outline: "none",
    fontSize: 16,
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
  }),

  input: css({
    width: "100%",
    height: "100%",
    padding: "0 16px",
    background: "transparent",
    color: "rgba(255,255,255,0.92)",
    border: "none",
    outline: "none",
    fontSize: 16,
    "&::placeholder": {
      color: "rgba(255,255,255,0.35)",
    },
  }),

  rightIconBox: css({
    position: "absolute",
    right: 0,
    top: 0,
    width: 54,
    height: "100%",
    display: "grid",
    placeItems: "center",
    borderLeft: "1px solid rgba(255,255,255,0.06)",
    pointerEvents: "none",
    background:
      "linear-gradient(to left, rgba(255,255,255,0.05), rgba(255,255,255,0))",
  }),

  arrow: css({
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: "7px solid rgba(255,255,255,0.75)",
    transform: "translateY(2px)",
  }),

  helper: css({
    marginTop: 8,
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
  }),

  invalid: css({
    borderColor: "rgba(214,69,69,0.75)",
  }),

  valid: css({
    borderColor: "rgba(50,168,82,0.75)",
  }),

  // Env toggle
  envGrid: css({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  }),

  envBtn: css({
    height: 54,
    borderRadius: 12,
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.78)",

    transition:
      "transform 0.05s ease, background 0.15s ease, border 0.15s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.10)",
    },
    "&:active": {
      transform: "translateY(1px)",
    },
  }),

  envActive: css({
    background: `linear-gradient(180deg, ${GREEN}, #2c944a)`,
    borderColor: "rgba(50,168,82,0.95)",
    color: "#fff",
  }),

  // Deploy
  deploy: css({
    height: 58,
    borderRadius: 14,
    width: "100%",
    background: `linear-gradient(180deg, ${GREEN}, #2c944a)`,
    color: "#fff",
    border: "1px solid rgba(50,168,82,0.9)",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    transition: "transform 0.05s ease, filter 0.15s ease",
    "&:hover": {
      filter: "brightness(1.02)",
    },
    "&:active": {
      transform: "translateY(1px)",
      filter: "brightness(0.98)",
    },
    "&:focus": {
      outline: "none",
    },
  }),

  historyWrap: css({
    marginTop: 18,
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
  const [environment, setEnvironment] = useState<Environment>("preview");
  const [invalidBranch, setInvalidBranch] = useState(false);
  const [validBranch, setValidBranch] = useState(false);
  const isPreview = environment === "preview";
  const [branch, setBranch] = useState<string>("");
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();
  const isTokenValid = useValidateGithubAccessToken();
  const [cookies] = useCookies(["access_token", "token_type"]);
  const validateBranchDebounced = useValidateBranchDebounced({
    branch,
    selectedProject,
    setInvalidBranch,
    setValidBranch,
    wait: 500,
  });

  const updateBranch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setBranch(next);
    validateBranchDebounced.current?.(next);
  };

  const deploy = async () => {
    await axios.post(
      `${API_URL}/deploy`,
      {
        branchName: branch,
        projectName: selectedProject,
        environment,
      },
      {
        headers: {
          Authorization: `${cookies.token_type} ${cookies.access_token}`,
        },
      },
    );
  };

  if (!isTokenValid) {
    navigate("/login");
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios<GithubRepositories[]>(
          `${GITHUB_API_URL}/users/${GITHUB_ORGANIZATION_NAME}/repos`,
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
        setSelectedProject(res.data[0].name);
      } catch (_e) {
        setHasError(true);
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    validateBranchDebounced.current?.(branch);
  }, [branch, selectedProject, validateBranchDebounced]);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (hasError) {
    return <>An error has occured... Check configuration</>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>Deploy</div>
            <div className={styles.subtitle}>
              Pick a project, set a branch, choose an environment — then ship.
            </div>
          </div>

          <div className={styles.statusPill}>
            <span className={styles.dot} />
            {isPreview ? "Preview" : "Staging"}
          </div>
        </div>

        <div className={styles.hero}>
          <div className={styles.grid}>
            {/* Left: Inputs */}
            <div className={styles.stack}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Project</div>
                <div className={styles.control}>
                  <div className={styles.selectWrap}>
                    <select
                      className={styles.select}
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      {projects.map((p: GithubRepositories) => (
                        <option key={p.full_name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <div className={styles.rightIconBox}>
                      <div className={styles.arrow} />
                    </div>
                  </div>
                </div>
                <div className={styles.helper}>
                  This determines which repo/app will be deployed.
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Branch</div>
                <div
                  className={`${styles.control} ${
                    invalidBranch ? styles.invalid : ""
                  } ${validBranch ? styles.valid : ""}`}
                >
                  <input
                    type="text"
                    placeholder="branch-name"
                    value={branch}
                    onChange={updateBranch}
                    className={styles.input}
                  />
                </div>
                <div className={styles.helper}>
                  Use an existing branch name (validated live).
                </div>
              </div>
            </div>

            {/* Right: Environment + Deploy */}
            <div className={styles.stack}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Environment</div>
                <div className={styles.envGrid}>
                  <div
                    className={`${styles.envBtn} ${
                      isPreview ? styles.envActive : ""
                    }`}
                    onClick={() => setEnvironment("preview")}
                  >
                    Preview
                  </div>
                  <div
                    className={`${styles.envBtn} ${
                      !isPreview ? styles.envActive : ""
                    }`}
                    onClick={() => setEnvironment("staging")}
                  >
                    Staging
                  </div>
                </div>
                <div className={styles.helper}>
                  Preview is safer. Staging is closer to prod.
                </div>
              </div>

              <button className={styles.deploy} onClick={deploy}>
                Deploy
              </button>
            </div>
          </div>
        </div>

        <div className={styles.historyWrap}>
          <History environment={environment} />
        </div>
      </div>
    </div>
  );
};
