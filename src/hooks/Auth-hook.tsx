import { useCallback, useEffect, useState } from "react";

export const useAuth = () => {
  const [isToken, setIsToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>();

  // @ts-ignore
  let logoutTimmer;
  // const login = useCallback(
  //   (
  //     uid: string | null,
  //     token: string | null,
  //     // @ts-ignore
  //     expirationDate?: Date
  //   ) => {
  //     setIsToken(token);
  //     setUserId(uid);
  //     const tokenExpirationDate =
  //       expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
  //     setTokenExpiration(tokenExpirationDate);
  //     localStorage.setItem(
  //       "userData",
  //       JSON.stringify({
  //         userId: uid,
  //         token: token,
  //         expiration: tokenExpirationDate.toISOString(),
  //       })
  //     );
  //   },
  //   []
  // );
  // const logout = useCallback(() => {
  //   setIsToken(null);
  //   setUserId(null);
  //   setTokenExpiration(null);
  //   localStorage.removeItem("userData");
  // }, []);

  // useEffect(() => {
  //   if (isToken && tokenExpiration) {
  //     const remainingTime = tokenExpiration.getTime() - new Date().getTime();
  //     logoutTimmer = setTimeout(logout, remainingTime);
  //   } else {
  //     // @ts-ignore
  //     clearTimeout(logoutTimmer);
  //   }
  // }, [isToken, logout, tokenExpiration]);

  // useEffect(() => {
  //   const storedDataString = localStorage.getItem("userData");
  //   if (storedDataString) {
  //     // Parse the JSON string into an object
  //     const storedData = JSON.parse(storedDataString);

  //     // Check if the required properties exist before using them
  //     if (
  //       storedData &&
  //       storedData.token &&
  //       storedData.userId &&
  //       storedData.exprationDate > new Date()
  //     ) {
  //       login(storedData.userId, storedData.token, storedData.exprationDate);
  //     }
  //   }
  // }, [login]);

  const login = useCallback(
    (
      uid: string | null,
      token: string | null,
      //@ts-ignore
      expirationDate?: Date
    ) => {
      setIsToken(token);
      setUserId(uid);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpiration(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setIsToken(null);
    setTokenExpiration(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (isToken && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();
      logoutTimmer = setTimeout(logout, remainingTime);
    } else {
      // @ts-ignore
      clearTimeout(logoutTimmer);
    }
  }, [isToken, logout, tokenExpiration]);

  useEffect(() => {
    // @ts-ignore
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { login, logout, isToken, userId };
};
