import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { GITHUB_API_URL } from "../../config";

export const useValidateGithubAccessToken = () => {
  const [cookies] = useCookies(["access_token", "token_type"]);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${GITHUB_API_URL}/user`, {
        headers: {
          Authorization: `${cookies.token_type} ${cookies.access_token}`,
        },
      });

      if (res.status === 200) {
        setIsTokenValid(true);
        return;
      }
      setIsTokenValid(false);
    })();
  }, [cookies.access_token, cookies.token_type]);

  return isTokenValid;
};
