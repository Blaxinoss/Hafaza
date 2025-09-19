import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform, TouchableOpacity, Text } from "react-native";
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
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#235374',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      contentStyle: {
        backgroundColor: '#235374'
      },
      animationTypeForReplace: 'push',
      animation: 'fade', // أو 'fade' أو 'flip'
    }}
    >
      {(!fontAdded && !error) &&
        <Text>Error font not found</Text>
      }




      <Stack.Screen
        name="index"
        options={{
          title: "الشاشه الرئيسية",
          headerStyle: { backgroundColor: "#11274c" }, // لون الخلفية
          headerTintColor: "#ffffff", // لون النص
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",

        }}
      />



      <Stack.Screen

        name="Sessions"
        options={{
          title: "الجلسات",
          headerStyle: { backgroundColor: '#0f1c2b' },
          contentStyle: {
            backgroundColor: '#235374' // ✅ منع الخلفية البيضاء عند الـ scroll
          },
        }}
      />


      <Stack.Screen

        name="AttendanceScreenDetails"
        options={{
          title: "حضور الطالب",
          headerStyle: { backgroundColor: '#0f1c2b' },
          contentStyle: {
            backgroundColor: '#235374' // ✅ منع الخلفية البيضاء عند الـ scroll
          },
        }}
      />




      <Stack.Screen
        name="AddPerson"
        options={{
          title: "إضافة أعضاء",
          headerStyle: {
            backgroundColor: '#235374', // ✅ نفس لون الخلفية للتناسق
          },
          headerTintColor: '#FFFFFF', // ✅ أبيض خالص
          headerTitleStyle: {
            fontWeight: 'bold', // ✅ عنوان بارز
            fontSize: 18,
            color: '#FFFFFF',
          },
          contentStyle: {
            backgroundColor: '#235374' // ✅ منع الخلفية البيضاء عند الـ scroll
          },

          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 15,
                padding: 8,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 8,
              }}
              onPress={() => {
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12 }}>⚙️</Text>
            </TouchableOpacity>
          ),
        }}
      />



    </Stack>
  );
}
