import axios from "axios";
import { useEffect, useRef } from "react";
import { debounce } from "../../utils/debounce";
import { GITHUB_ORGANIZATION_NAME } from "../../utils/environment-variables";
import { GITHUB_API_URL } from "../../config";

interface UseValidateBranchDebouncedParams {
  selectedProject: string;
  branch: string;
  wait: number;
  setInvalidBranch: (state: boolean) => void;
  setValidBranch: (state: boolean) => void;
}

export const useValidateBranchDebounced = ({
  selectedProject,
  branch,
  wait,
  setInvalidBranch,
  setValidBranch,
}: UseValidateBranchDebouncedParams) => {
  const latest = useRef({ selectedProject, branch });

  useEffect(() => {
    latest.current = { selectedProject, branch };
  }, [selectedProject, branch]);

  const debounceFnRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    debounceFnRef.current = debounce(async (branch: string) => {
      try {
        console.log(branch.length <= 0, branch.length, branch);
        if (branch.length <= 0) {
          setInvalidBranch(false);
          setValidBranch(false);
          return;
        }
        const res = await axios(
          `${GITHUB_API_URL}/repos/${GITHUB_ORGANIZATION_NAME}/${selectedProject}/branches/${branch}`,
        );
        if (res.status !== 200) {
          setInvalidBranch(true);
          setValidBranch(false);
        } else {
          setInvalidBranch(false);
          setValidBranch(true);
        }
      } catch (_e) {
        setInvalidBranch(true);
        setValidBranch(false);
      }
    }, wait);
    return () => {
      debounceFnRef.current?.cancel();
    };
  }, [wait, setInvalidBranch, selectedProject, setValidBranch]);

  return debounceFnRef;
};
