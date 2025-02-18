import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
export default function RootLayout(): JSX.Element {

  const [fontAdded, error] = useFonts({
    "MainFont": require('../assets/fonts/Lemonada-Bold.ttf')
  })

  useEffect(() => {
    if (fontAdded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontAdded, error]);



  console.log(Platform.select)
  return (
    <Stack>
      {(!fontAdded && !error) &&
        <text>Error font not found</text>
      }
      <Stack.Screen
        name="index"
        options={{
          title: "الشاشه الرئيسية",
          headerStyle: { backgroundColor: "#11274c", borderBottomColor: "none" }, // لون الخلفية
          headerTintColor: "#fff", // لون النص
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",

        }}
      />
      <Stack.Screen
        name="AttendanceScreen"
        options={{ title: "شاشة الغيابات" }}
      />
      <Stack.Screen
        name="AddPerson"
        options={{ title: "إضافة أعضاء" }}
      />
    </Stack>
  );
}
