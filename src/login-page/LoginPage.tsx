import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL, APP_URL, GITHUB_OAUTH_URL } from "../config";
import { GITHUB_CLIENT_ID } from "../utils/environment-variables";
import { GitHubLoginButton } from "./buttons/GithubLogin";
import { useValidateGithubAccessToken } from "./hooks/useValidateGithubAccessToken";

interface GithubOAuthResponse {
  access_token: string;
  token_type: string;
}

export const LoginPage = () => {
  const [hasError, setHasError] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);

  const [searchParams] = useSearchParams();
  const githubCode = searchParams.get("code");

  const [, setCookie] = useCookies(["access_token", "token_type"]);
  const navigate = useNavigate();

  const isTokenValid = useValidateGithubAccessToken();

  const exchangeGitHubCode = useMemo(
    () =>
      async (code: string): Promise<GithubOAuthResponse> => {
        const res = await axios.post(
          `${API_URL}/github/oauth/authorize`,
          { code, redirect_uri: `${APP_URL}/login` },
          { headers: { "Content-Type": "application/json" } },
        );
        return res.data;
      },
    [],
  );

  useEffect(() => {
    if (isTokenValid) {
      navigate("/manage", { replace: true });
    }
  }, [isTokenValid, navigate]);

  useEffect(() => {
    if (!githubCode) return;
    if (isTokenValid) return;

    let cancelled = false;

    (async () => {
      try {
        setIsExchanging(true);
        const { access_token, token_type } =
          await exchangeGitHubCode(githubCode);

        if (cancelled) return;

        setCookie("access_token", access_token, { path: "/", secure: true });
        setCookie("token_type", token_type, { path: "/", secure: true });

        setHasError(false);

        navigate("/login", { replace: true });
      } catch {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsExchanging(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [githubCode, isTokenValid, exchangeGitHubCode, setCookie, navigate]);

  const login = () => {
    try {
      const url = new URL(GITHUB_OAUTH_URL);
      url.searchParams.set("client_id", GITHUB_CLIENT_ID);
      url.searchParams.set("redirect_uri", `${APP_URL}/login`);
      window.location.assign(url.toString());
      setHasError(false);
    } catch {
      setHasError(true);
    }
  };

  if (hasError) return <h1>Error authorizing…</h1>;

  return <GitHubLoginButton onClick={login} disabled={isExchanging} />;
};
