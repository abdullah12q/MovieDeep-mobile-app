import Header from "@/components/Header";
import MoviesList from "@/components/MoviesList";
import { icons } from "@/constants/icons";
import useDebounce from "@/hooks/useDebounce";
import { getMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import SearchBar from "../../components/SearchBar";

export default function Search() {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: movies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movies", debouncedSearchTerm],
    queryFn: () => getMovies(debouncedSearchTerm || undefined),
  });

  useEffect(() => {
    async function updatingSearchCount() {
      if (debouncedSearchTerm && movies?.length > 0) {
        await updateSearchCount(debouncedSearchTerm, movies[0]);
      }
    }

    updatingSearchCount();
  }, [debouncedSearchTerm, movies]);

  let content;

  if (isLoading) {
    content = (
      <ActivityIndicator size="large" color="#0000ff" className="my-3" />
    );
  }

  if (isError) {
    const errorMessage = error?.message || "Failed to fetch movies";
    content = (
      <Text className="px-5 my-3 text-red-500">
        The error is: {errorMessage}
      </Text>
    );
  }

  if (!isLoading && !isError && debouncedSearchTerm && movies.length > 0) {
    content = (
      <Text className="text-xl text-white">
        Search results for:{" "}
        <Text className="text-accent">{debouncedSearchTerm}</Text>
      </Text>
    );
  }

  return (
    <Header>
      <MoviesList
        data={movies}
        ListHeader={
          <>
            <Image
              source={icons.logo}
              className="self-center w-12 h-10 mt-20 mb-5"
            />

            <View className="my-5">
              <SearchBar
                placeholder="Search throw 1M+ movies online"
                value={searchTerm}
                onChangeText={(enteredSearchTerm) =>
                  setSearchTerm(enteredSearchTerm)
                }
              />
            </View>

            {content}
          </>
        }
        ListEmpty={
          !isLoading && debouncedSearchTerm.trim() ? (
            <Text className="text-center text-white ">
              No results for:{" "}
              <Text className="text-accent">{debouncedSearchTerm}</Text>
            </Text>
          ) : null
        }
      />
    </Header>
  );
}
