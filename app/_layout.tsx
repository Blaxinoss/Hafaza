import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import '../global.css'
export default function RootLayout() {

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
          headerStyle: { backgroundColor: "#11274c"}, // لون الخلفية
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
        name="Sessions"
        options={{ title: "سيشنز" }}
      />
      <Stack.Screen
        name="AddPerson"
        options={{ title: "إضافة أعضاء" }}
      />
    </Stack>
  );
}
