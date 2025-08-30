import Header from "@/components/Header";
import MoviesList from "@/components/MoviesList";
import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/api";
import { SavedContext } from "@/store/savedContext";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Saved() {
  const { ids } = useContext(SavedContext);

  const {
    data: savedMovies,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["savedMovies", ids],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getSavedMovies(ids);
    },
  });

  return (
    <Header>
      <View className="flex-1">
        <MoviesList
          data={savedMovies}
          ListHeader={
            <>
              <Image
                source={icons.logo}
                className="self-center w-12 h-10 mt-20"
              />
              <Text className="mt-5 mb-3 text-lg text-white">Saved Movies</Text>
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
          ListEmpty={
            savedMovies?.length === 0 && (
              <View className="items-center justify-center flex-1">
                <Text className="mb-2 text-sm text-light-200">
                  No saved movies yet!{" "}
                </Text>
                <Text className="text-sm text-accent">
                  Start saving your favorite movies now.{" "}
                </Text>
              </View>
            )
          }
        />
      </View>
    </Header>
  );
}
