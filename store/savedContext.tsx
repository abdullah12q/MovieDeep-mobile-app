import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

type SavedContextType = {
  ids: string[];
  saveMovie: (id: string) => void;
  unsaveMovie: (id: string) => void;
};

export const SavedContext = createContext<SavedContextType>({
  ids: [],
  saveMovie: () => {},
  unsaveMovie: () => {},
});

export default function SavedContextProvider({ children }: any) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadSavedIds() {
      try {
        const stored = await AsyncStorage.getItem("saved");
        if (stored) {
          setSavedIds(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error loading saved ids:", err);
      }
    }
    loadSavedIds();
  }, []);

  useEffect(() => {
    async function saveIds() {
      try {
        await AsyncStorage.setItem("saved", JSON.stringify(savedIds));
      } catch (err) {
        console.error("Error saving saved ids:", err);
      }
    }
    if (savedIds.length >= 0) {
      saveIds();
    }
  }, [savedIds]);

  function saveMovie(id: string) {
    setSavedIds((current) => {
      if (current.includes(id)) return current;
      return [...current, id];
    });
  }

  function unsaveMovie(id: string) {
    setSavedIds((current) => current.filter((movieId) => movieId !== id));
  }

  const value: SavedContextType = {
    ids: savedIds,
    saveMovie,
    unsaveMovie,
  };

  return (
    <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
  );
}
