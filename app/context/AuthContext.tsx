"use client";
import { createContext, useEffect, useState } from "react";

import { destroyCookie, parseCookies, setCookie } from "nookies";
import api from "../lib/axios";

const AuthContext = createContext({} as any);
const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [userCollections, setUserCollections] = useState(null);
  const [activeUserCollection, setActiveUserCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function initApp() {
      const { "daily_scripts.accessToken": access_token } = parseCookies();
      if (access_token) {
        api.defaults.headers["Authorization"] = `Bearer ${access_token}`;
        const userResponse = await getUser();
        const userCollecionsResponse = await getUserCollections();

        setUser(userResponse);
        setUserCollections(userCollecionsResponse);

        const firstId =
          userCollecionsResponse.length > 0
            ? userCollecionsResponse[0].id
            : null;
        setActiveUserCollection(firstId);

        setLoading(false);
      }
      setLoading(false);
    }
    initApp();
  }, []);

  async function signIn(access_token: string) {
    try {
      api.defaults.headers["Authorization"] = `Bearer ${access_token}`;

      setCookie(null, "daily_scripts.accessToken", access_token, {
        maxAge: 30000,
        path: "/",
      });

      const userResponse = await getUser();
      if (!userResponse) {
        return false;
      }
      setUser(userResponse);

      const userCollecionsResponse = await getUserCollections();
      if (!userCollecionsResponse) {
        return false;
      }
      setUserCollections(userCollecionsResponse);

      const firstId =
        userCollecionsResponse.length > 0 ? userCollecionsResponse[0].id : null;
      setActiveUserCollection(firstId);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function getUser() {
    const { data } = await api.get("/user");
    return data;
  }

  async function getUserCollections() {
    const { data } = await api.get("/user/collections");
    return data;
  }

  async function logout() {
    const { "daily_scripts.accessToken": access_token } = parseCookies();

    if (access_token) {
      destroyCookie(null, "daily_scripts.accessToken", { path: "/" });
      api.defaults.headers["Authorization"] = null;
      setUser(null);
    }

    return;
  }

  const values = {
    user,
    userCollections,
    activeUserCollection,
    loading,
    setActiveUserCollection,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
