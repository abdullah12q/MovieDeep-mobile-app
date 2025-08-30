import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchBar({
  onPress,
  placeholder,
  value = "",
  onChangeText = () => {},
}: SearchBarProps) {
  return (
    <View className="flex-row items-center px-5 rounded-full h-14 bg-dark-200">
      <Image source={icons.search} resizeMode="contain" tintColor="#ab8bff" />
      <TextInput
        className="flex-1 ml-3 text-white"
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#a8b5db"
        cursorColor="#ab8bff"
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons name="close-circle" size={22} color="#ab8bff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
