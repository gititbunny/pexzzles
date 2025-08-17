import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const AppContext = createContext(null);

const LS_NAME = "pexzzles:name";
const LS_SETTINGS = "pexzzles:settings";
const LS_SCOREBOARD = "pexzzles:scoreboard";

export function AppProvider({ children }) {
  const [name, setName] = useState(localStorage.getItem(LS_NAME) || "");
  const [settings, setSettings] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(LS_SETTINGS)) || {
          grid: 4,
          lastKeyword: "",
        }
      );
    } catch {
      return { grid: 4, lastKeyword: "" };
    }
  });
  const [scoreboard, setScoreboard] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_SCOREBOARD)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_NAME, name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LS_SCOREBOARD, JSON.stringify(scoreboard));
  }, [scoreboard]);

  const value = useMemo(
    () => ({
      name,
      setName,
      settings,
      setSettings,
      scoreboard,
      setScoreboard,
    }),
    [name, settings, scoreboard]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
