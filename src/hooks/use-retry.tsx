import { useCallback, useEffect, useState } from "react";

import { SECOND_IN_MILLISECONDS } from "@/common/constants";
import { useCookies } from "react-cookie";

interface RetryOptions {
  maxFailedAttempts?: number;
  blockTime?: number;
  userKey: string;
}

interface UseRetryReturn {
  isBlocked: boolean;
  blockTimeRemaining: number;
  failedAttempts: number;
  resetBlock: () => void;
  handleFailedAttempt: () => void;
}

const useRetry = ({
  maxFailedAttempts = 3,
  blockTime = 60,
  userKey,
}: RetryOptions): UseRetryReturn => {
  const [cookies, setCookie, removeCookie] = useCookies([
    `blockTimeRemaining-${userKey}`,
    `isBlocked-${userKey}`,
  ]);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const getCurrentTime = useCallback(() => Math.floor(Date.now() / 1000), []);

  const blockTimeRemainingFromCookie = cookies[`blockTimeRemaining-${userKey}`]
    ? parseInt(cookies[`blockTimeRemaining-${userKey}`])
    : 0;
  const isBlockedFromCookie = cookies[`isBlocked-${userKey}`] === true;

  const [isBlocked, setIsBlocked] = useState(isBlockedFromCookie);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(
    blockTimeRemainingFromCookie
  );

  const startBlock = useCallback(() => {
    setIsBlocked(true);
    const releaseTime = getCurrentTime() + blockTime;
    setBlockTimeRemaining(blockTime);
    setCookie(`isBlocked-${userKey}`, "true", { path: "/" });
    setCookie(`blockTimeRemaining-${userKey}`, releaseTime.toString(), {
      path: "/",
    });
  }, [blockTime, getCurrentTime, setCookie, userKey]);

  const resetBlock = useCallback(() => {
    setIsBlocked(false);
    setFailedAttempts(0);
    removeCookie(`isBlocked-${userKey}`, { path: "/" });
    removeCookie(`blockTimeRemaining-${userKey}`, { path: "/" });
  }, [removeCookie, userKey]);

  const handleFailedAttempt = useCallback(() => {
    if (failedAttempts + 1 >= maxFailedAttempts) {
      startBlock();
    } else {
      setFailedAttempts((prev) => prev + 1);
    }
  }, [failedAttempts, maxFailedAttempts, startBlock]);

  useEffect(() => {
    if (isBlocked) {
      const intervalId = setInterval(() => {
        const currentTime = getCurrentTime();
        const releaseTime = parseInt(
          cookies[`blockTimeRemaining-${userKey}`] || "0"
        );

        if (releaseTime <= currentTime) {
          resetBlock();
          clearInterval(intervalId);
        } else {
          const remainingTime = releaseTime - currentTime;
          setBlockTimeRemaining(remainingTime);
        }
      }, SECOND_IN_MILLISECONDS);

      return () => clearInterval(intervalId);
    }
  }, [isBlocked, cookies, resetBlock, userKey, getCurrentTime]);

  useEffect(() => {
    const currentTime = getCurrentTime();
    if (
      cookies[`isBlocked-${userKey}`] === true &&
      cookies[`blockTimeRemaining-${userKey}`]
    ) {
      const releaseTime = parseInt(cookies[`blockTimeRemaining-${userKey}`]);
      if (releaseTime > currentTime) {
        setIsBlocked(true);
        setBlockTimeRemaining(releaseTime - currentTime);
      } else {
        resetBlock();
      }
    }
  }, [cookies, getCurrentTime, resetBlock, userKey]);

  return {
    isBlocked,
    blockTimeRemaining,
    failedAttempts,
    resetBlock,
    handleFailedAttempt,
  };
};

export default useRetry;
