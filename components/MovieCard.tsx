import { icons } from "@/constants/icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function MovieCard({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie | MovieDetails) {
  return (
    <Link
      href={{ pathname: "/movies/[id]", params: { id: id.toString(), title } }}
      asChild
    >
      <TouchableOpacity className="w-[30%]">
        <Image
          source={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png"
          }
          style={{ width: 100, height: 190, borderRadius: 8 }}
          contentFit="cover"
        />
        <Text className="mt-2 text-sm text-white" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row gap-x-1">
            <Image source={icons.star} style={{ width: 12, height: 12 }} />
            <Text className="text-xs text-white ">
              {vote_average.toFixed(1)}
            </Text>
          </View>
          <Text className="text-xs text-light-300">
            {release_date?.split("-")[0]}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
