import { getTrendingMovies } from "@/services/appwrite";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

type TrendingIndexesContextType = {
  trendingIndexes: { movie_id: number; index: number }[];
};

export const TrendingIndexesContext = createContext<TrendingIndexesContextType>(
  { trendingIndexes: [] }
);

export default function TrendingIndexesContextProvider({ children }: any) {
  const { data: trendingMovies = [] } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: getTrendingMovies,
  });

  const trendingIndexes =
    trendingMovies?.map((movie, index) => ({
      movie_id: movie.movie_id,
      index: index + 1,
    })) ?? [];

  const value: TrendingIndexesContextType = {
    trendingIndexes,
  };

  return (
    <TrendingIndexesContext.Provider value={value}>
      {children}
    </TrendingIndexesContext.Provider>
  );
}
