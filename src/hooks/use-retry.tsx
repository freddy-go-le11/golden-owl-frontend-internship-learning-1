import { useCallback, useEffect, useState } from "react";

import { SECOND_IN_MILLISECONDS } from "@/common/constants";
import { useCookies } from "react-cookie";

interface RetryOptions {
  maxFailedAttempts?: number; // Max failed attempts before blocking
  blockTime?: number; // Block time in seconds
  userKey: string; // Unique key to identify the user (e.g., user ID or session ID)
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

  // Get the remaining block time and blocked status from cookies
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
    const releaseTime = getCurrentTime() + blockTime; // Block until current time + blockTime
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
      startBlock(); // Block the user after reaching max failed attempts
    } else {
      setFailedAttempts((prev) => prev + 1);
    }
  }, [failedAttempts, maxFailedAttempts, startBlock]);

  useEffect(() => {
    // If already blocked, check the remaining time for the block
    if (isBlocked) {
      const intervalId = setInterval(() => {
        const currentTime = getCurrentTime();
        const releaseTime = parseInt(
          cookies[`blockTimeRemaining-${userKey}`] || "0"
        );

        if (releaseTime <= currentTime) {
          resetBlock(); // Unblock if the block time has passed
          clearInterval(intervalId); // Stop checking after unblock
        } else {
          const remainingTime = releaseTime - currentTime;
          setBlockTimeRemaining(remainingTime); // Update remaining block time
        }
      }, SECOND_IN_MILLISECONDS); // Run every 1 second

      // Cleanup the interval when the component unmounts or isBlocked changes
      return () => clearInterval(intervalId);
    }
  }, [isBlocked, cookies, resetBlock, userKey, getCurrentTime]);

  useEffect(() => {
    // If the page is refreshed or revisited, check if the user is still blocked
    const currentTime = getCurrentTime();
    if (
      cookies[`isBlocked-${userKey}`] === true &&
      cookies[`blockTimeRemaining-${userKey}`]
    ) {
      const releaseTime = parseInt(cookies[`blockTimeRemaining-${userKey}`]);
      if (releaseTime > currentTime) {
        setIsBlocked(true);
        setBlockTimeRemaining(releaseTime - currentTime); // Update remaining block time
      } else {
        resetBlock(); // Unblock if the time has passed
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
