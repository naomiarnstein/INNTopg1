import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import ErrorBoundary from "react-native-error-boundary";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ActionSheetProvider>
        <GestureHandlerRootView>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: "#fff",
              },
            }}
          >
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="index"
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="read-story/[uid]"
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="search"
            />
          </Stack>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </ErrorBoundary>
  );
}
