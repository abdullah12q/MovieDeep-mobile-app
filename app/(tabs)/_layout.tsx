import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import { Image, ImageBackground, Text, View } from "react-native";

function TabIcon({ focused, icon, title }: any) {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="ml-2 text-secondary">{title}</Text>
      </ImageBackground>
    );
  }

  return (
    <View className="items-center justify-center mt-4 rounded-full size-full">
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-primary">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#0f0d23",
            borderRadius: 100,
            marginHorizontal: 10,
            marginBottom: 36,
            height: 52,
            overflow: "hidden",
            position: "absolute",
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.home} title="Home" />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.search} title="Search" />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.save} title="Saved" />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.person} title="Profile" />
            ),
          }}
        /> */}
      </Tabs>
    </View>
  );
}
