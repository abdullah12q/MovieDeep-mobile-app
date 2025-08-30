import { icons } from "@/constants/icons";
import SavedContextProvider from "@/store/savedContext";
import TrendingIndexesContextProvider from "@/store/trendingIndexesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SavedContextProvider>
        <TrendingIndexesContextProvider>
          <View className="flex-1 bg-primary">
            <StatusBar barStyle="light-content" backgroundColor="#030014" />
            <Stack
              screenOptions={{
                animation: "fade",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="movies/[id]"
                options={{
                  headerStyle: { backgroundColor: "#0f0d23" },
                  headerTintColor: "white",
                  headerRight: () => (
                    <Image
                      source={icons.save}
                      tintColor="white"
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 12,
                      }}
                    />
                  ),
                }}
              />
            </Stack>
          </View>
        </TrendingIndexesContextProvider>
      </SavedContextProvider>
    </QueryClientProvider>
  );
}
