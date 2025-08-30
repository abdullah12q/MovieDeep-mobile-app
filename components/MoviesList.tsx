import { FlatList } from "react-native";
import MovieCard from "./MovieCard";

export default function MoviesList({ data, ListHeader, ListEmpty }: any) {
  return (
    <FlatList
      className="px-5"
      data={data}
      renderItem={({ item }) => <MovieCard {...item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      columnWrapperStyle={{
        justifyContent: "flex-start",
        gap: 16,
        marginVertical: 16,
      }}
      contentContainerStyle={{ paddingBottom: 128, flexGrow: 1 }}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={ListEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
}
