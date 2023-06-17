import { useFonts } from "expo-font";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";
import { SplashScreen, Stack } from "expo-router";

import config from "../tamagui.config";

export default function Layout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return <SplashScreen />;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme === "dark" ? "dark" : "light"}>
        <Stack
          screenOptions={{ headerLargeTitle: true, headerShadowVisible: false }}
        />
      </Theme>
    </TamaguiProvider>
  );
}
