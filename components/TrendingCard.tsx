import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

function mapGenres(genreIds: number[], genres: { id: number; name: string }[]) {
  return genreIds
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2) // show only first 2 genres
    .join(" • ");
}

export default function TrendingCard({
  movie,
  index,
  genres,
}: TrendingCardProps) {
  return (
    <Link
      href={{
        pathname: "/movies/[id]",
        params: { id: movie.movie_id.toString(), title: movie.title },
      }}
      asChild
    >
      <TouchableOpacity className="relative w-32 pl-2">
        <Image
          source={{
            uri:
              movie.poster_url ??
              "https://placehold.co/600x400/1a1a1a/ffffff.png",
          }}
          style={{ width: 100, height: 190, borderRadius: 8 }}
          contentFit="cover"
        />
        <View className="absolute rounded-full -left-1.5 bottom-[20px] ">
          <MaskedView
            maskElement={<Text className="text-6xl text-white">{index}</Text>}
          >
            <Image
              source={images.rankingGradient}
              style={{ width: 56, height: 56 }}
              contentFit="cover"
            />
          </MaskedView>
        </View>
        <View className="absolute flex-row p-1 rounded-md top-2 right-4 gap-x-1 bg-slate-400/30">
          <Image source={icons.star} style={{ width: 12, height: 12 }} />
          <Text className="text-xs text-white ">
            {movie.vote_average.toFixed(1)}
          </Text>
        </View>
        <View className="mt-2">
          <Text className="text-sm text-white" numberOfLines={1}>
            {movie.title}
          </Text>
          <Text className="text-xs text-light-300" numberOfLines={1}>
            {mapGenres(movie.genre_ids, genres)}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
