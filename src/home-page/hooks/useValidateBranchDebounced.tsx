import axios from "axios";
import { useEffect, useRef } from "react";
import { debounce } from "../../utils/debounce";
import { GITHUB_ORGANIZATION_NAME } from "../../utils/environment-variables";

interface UseValidateBranchDebouncedParams {
  selectedProject: string;
  branch: string;
  wait: number;
  setInvalidBranch: (state: boolean) => void;
}

export const useValidateBranchDebounced = ({
  selectedProject,
  branch,
  wait,
  setInvalidBranch,
}: UseValidateBranchDebouncedParams) => {
    console.log("useValidateBranchDebounced", selectedProject, branch, wait, setInvalidBranch);
    
  const latest = useRef({ selectedProject, branch });

  useEffect(() => {
    latest.current = { selectedProject, branch };
  }, [selectedProject, branch]);

  const debounceFnRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    debounceFnRef.current = debounce(
      async (branch: string) => {
        try {
          const res = await axios(
            `https://api.github.com/repos/${GITHUB_ORGANIZATION_NAME}/${selectedProject}/branches/${branch}`,
          );
          if (res.status !== 200) {
            setInvalidBranch(true);
          } else {
            setInvalidBranch(false);
          }
        } catch (_e) {
          setInvalidBranch(true);
        }
      }, wait
    );
    return () => {
        debounceFnRef.current?.cancel();
    }
  }, [wait, setInvalidBranch, selectedProject]);

  return debounceFnRef;
};
