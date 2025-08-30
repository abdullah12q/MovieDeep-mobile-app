import { images } from "@/constants/images";
import { Image, View } from "react-native";

export default function Header({ children }: any) {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full" />
      {children}
    </View>
  );
}
