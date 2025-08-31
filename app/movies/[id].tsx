import { icons } from "@/constants/icons";
import { getMovieDetails, getMovieTrailers } from "@/services/api";
import { SavedContext } from "@/store/savedContext";
import { TrendingIndexesContext } from "@/store/trendingIndexesContext";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import {
  Link,
  RelativePathString,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useContext, useLayoutEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function formatRuntime(minutes?: number | null): string {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m` : ""}`.trim();
}

function formatDate(date?: string): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrencyCompact(amount?: number | null): string {
  if (!amount || amount === 0) return "N/A";

  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
}

export default function MovieDeatils() {
  const { id, title } = useLocalSearchParams();
  const navigation = useNavigation();

  const { ids, saveMovie, unsaveMovie } = useContext(SavedContext);
  const { trendingIndexes } = useContext(TrendingIndexesContext);

  const movieIsSaved = ids.includes(id as string);

  const trendingIndex = trendingIndexes.find(
    (t) => t.movie_id === Number(id)
  )?.index;

  const { data: movie, isPending } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id as string),
  });

  const { data: trailers } = useQuery({
    queryKey: ["trailers", id],
    queryFn: () => getMovieTrailers(id as string),
  });

  const trailer =
    trailers?.results.find((t: any) => {
      if (t.type !== "Trailer" || t.site !== "YouTube") return false;

      const name = t.name.toLowerCase();

      if (name.includes("official trailer")) return true;

      if (name.includes("main trailer")) return true;

      if (name.includes("official") && name.includes("trailer")) return true;

      return false;
    }) ||
    trailers?.results.find(
      (t: any) => t.type === "Trailer" && t.site === "YouTube"
    );

  const toggleSave = useCallback(() => {
    if (movieIsSaved) {
      unsaveMovie(id as string);
    } else {
      saveMovie(id as string);
    }
  }, [movieIsSaved, id, saveMovie, unsaveMovie]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
      headerRight: () => {
        return (
          <TouchableOpacity onPress={toggleSave}>
            <Image
              source={movieIsSaved ? icons.saved : icons.save}
              tintColor="white"
              style={{
                width: 20,
                height: 20,
                marginRight: 12,
              }}
            />
          </TouchableOpacity>
        );
      },
    });
  }, [title, navigation, toggleSave, movieIsSaved]);

  let content;

  if (isPending) {
    content = (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        className="self-center mt-10"
      />
    );
  }

  if (!isPending && movie) {
    content = (
      <>
        <Image
          source={{
            uri: movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png",
          }}
          contentFit="fill"
          style={{ width: "100%", height: 400 }}
        />

        <View className="items-start justify-center px-5 mt-5">
          {trailer && (
            <TouchableOpacity
              className="absolute -top-12 right-5"
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  `https://www.youtube.com/watch?v=${trailer?.key}`
                )
              }
            >
              <Image source={icons.play} style={{ width: 50, height: 50 }} />
            </TouchableOpacity>
          )}
          <View>
            <Text className="text-2xl text-white">{movie?.title} </Text>
            <Text className="mt-2 text-sm text-light-200">
              {movie?.release_date.split("-")[0]}
              {"   •   "}
              {formatRuntime(movie?.runtime)}
            </Text>
          </View>

          <View className="flex-row gap-x-[10px]">
            <View className="flex-row items-center pl-[10px] pr-2 py-2 my-4 rounded-[4px] gap-x-[5px] bg-dark-100">
              <Image source={icons.star} style={{ width: 12, height: 12 }} />
              <Text className="text-sm text-light-300">
                <Text className="text-white">
                  {movie?.vote_average.toFixed(1)}
                </Text>
                /10 ({movie?.vote_count.toLocaleString()} votes){" "}
              </Text>
            </View>
            {trendingIndex && (
              <View className="flex-row items-center pl-[10px] pr-2 py-2 my-4 rounded-[4px] gap-x-[4px] bg-dark-100">
                <Image
                  source={icons.trending}
                  style={{ width: 12, height: 12 }}
                />
                <Text className="text-sm text-light-200">{trendingIndex}</Text>
              </View>
            )}
          </View>

          <View className="gap-1 my-2">
            <Text className="text-sm text-light-200">Overview</Text>
            <Text className="text-sm text-white">{movie?.overview} </Text>
          </View>

          <View className="flex-row justify-between w-full pr-5 my-2">
            <View className="gap-1">
              <Text className="text-sm text-light-200">Status</Text>
              <Text className="text-sm text-white">{movie?.status} </Text>
            </View>
            <View className="gap-1">
              <Text className="text-sm text-light-200">Release Date </Text>
              <Text className="text-sm text-white">
                {formatDate(movie?.release_date)}{" "}
              </Text>
            </View>
          </View>

          <View className="gap-1 my-2">
            <Text className="text-sm text-light-200">Genres</Text>
            <View className="flex-row gap-x-2">
              <FlatList
                data={movie?.genres}
                renderItem={({ item }) => (
                  <View className="items-center py-[6px] px-[10px] rounded-[4px] bg-dark-100">
                    <Text className="text-sm text-white">{item.name} </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                contentContainerStyle={{ gap: 8 }}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>

          <View className="flex-row justify-between w-full my-2 pr-7">
            <View className="gap-1">
              <Text className="text-sm text-light-200">Budget</Text>
              <Text className="text-sm text-white">
                {formatCurrencyCompact(movie?.budget)}{" "}
              </Text>
            </View>
            <View className="gap-1">
              <Text className="text-sm text-light-200">Revenue</Text>
              <Text className="text-sm text-white">
                {formatCurrencyCompact(movie?.revenue)}{" "}
              </Text>
            </View>
          </View>

          {movie?.tagline && (
            <View className="gap-1 my-2">
              <Text className="text-sm text-light-200">Tagline</Text>
              <Text className="text-sm text-white">{movie?.tagline} </Text>
            </View>
          )}

          <View className="gap-1 my-2">
            <Text className="text-sm text-light-200">Production Companies</Text>
            <View className="flex-row flex-wrap">
              {movie?.production_companies.map((company, index) => (
                <Text className="text-sm text-white" key={company.id}>
                  {company.name}{" "}
                  {index < movie.production_companies.length - 1 ? " •  " : ""}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{ paddingBottom: movie?.homepage ? 70 : 10 }}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
      {movie?.homepage && (
        <Link
          href={`${movie?.homepage}` as RelativePathString}
          asChild
          className="absolute left-0 right-0 flex-row items-center justify-center py-4 mx-5 rounded-lg bg-accent bottom-4"
        >
          <TouchableOpacity>
            <Text className="text-sm text-white">Visit Homepage </Text>
            <Image
              source={icons.arrow}
              style={{
                width: 16,
                height: 16,
                marginLeft: 4,
                tintColor: "white",
              }}
            />
          </TouchableOpacity>
        </Link>
      )}
    </SafeAreaView>
  );
}
