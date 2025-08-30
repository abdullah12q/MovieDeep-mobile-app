import Header from "@/components/Header";
import MoviesList from "@/components/MoviesList";
import { icons } from "@/constants/icons";
import { getGenres, getMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import TrendingCard from "../../components/TrendingCard";

export default function Index() {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries();

  const {
    data: trendingMovies = [],
    isPending: isTrendingPending,
    isError: isTrendingError,
    error: trendingError,
  } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getTrendingMovies();
    },
  });

  const {
    data: movies,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies(),
  });

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const genres = genresData?.genres ?? [];

  return (
    <Header>
      <MoviesList
        data={movies}
        ListHeader={
          <>
            <Image
              source={icons.logo}
              className="self-center w-12 h-10 mt-20"
            />
            <View>
              <Text className="mt-5 mb-3 text-lg text-white">
                Trending Movies
              </Text>
              {isTrendingPending ? (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className="self-center mt-10"
                />
              ) : isError ? (
                <Text className="px-5 my-3 text-red-500">
                  The error is: {trendingError?.message}
                </Text>
              ) : (
                !isTrendingPending &&
                !isTrendingError &&
                trendingMovies?.length > 0 && (
                  <FlatList
                    className="mb-4 "
                    data={trendingMovies}
                    renderItem={({ item, index }) => (
                      <TrendingCard
                        movie={item}
                        index={index + 1}
                        genres={genres}
                      />
                    )}
                    keyExtractor={(item) => item.movie_id.toString()}
                    horizontal
                    contentContainerStyle={{ gap: 15 }}
                    showsHorizontalScrollIndicator={false}
                  />
                )
              )}
            </View>
            <Text className="mt-5 mb-3 text-lg text-white">Latest Movies</Text>
            {isPending ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="self-center mt-10"
              />
            ) : isError ? (
              <Text className="px-5 my-3 text-red-500">
                The error is: {error?.message}
              </Text>
            ) : null}
          </>
        }
      />
    </Header>
  );
}
