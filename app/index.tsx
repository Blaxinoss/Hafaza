import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import back from '../assets/images/Background.jpg';

export default function HomeScreen(): JSX.Element {
  const router = useRouter();

  return (
    <>
      <View style={styles.container}>
        <ImageBackground source={back} style={styles.background} resizeMode="cover">
          <View style={styles.overlay} />
          <View style={styles.textWrapper}>
            <Text style={styles.header}>مرحبا بكم في <Text style={styles.mainWord}>حفظة</Text> </Text>

            <Text style={styles.para}>«خَيْرُكُمْ مَنْ تَعَلّمَ الْقُرْآنَ وَعَلّمَهُ»</Text>
          </View>
        </ImageBackground>

        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => router.push("/AttendanceScreen")}>
            <Ionicons style={styles.icon} name="document-attach" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/AddPerson")}>
            <Ionicons style={styles.icon} name="person-add" size={32} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen with an overlay
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent overlay for better contrast
  },
  container: {
    flex: 1, // Ensures the entire screen is filled
  },
  background: {
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: 750,
    position: "absolute",
  },
  textWrapper: {
    alignItems: "center", // Centers text horizontally
    justifyContent: "center", // Centers text vertically
    zIndex: 1,
    gap: "10px"
  },
  header: {
    color: 'white', // Use white text for high contrast against dark overlay
    fontSize: 28,
    fontFamily: "MainFont",
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for clarity
    textShadowOffset: { width: 1, height: 1 }, // Adds a subtle shadow to the text
    textShadowRadius: 3, // Radius of shadow
  },
  para: {
    color: 'gold',
    fontSize: 14, // Slightly larger for readability
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Adds shadow to paragraph text
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  mainWord: {
    color: '#eeff12',
    fontSize: 28, // Slightly larger for readability
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Adds shadow to paragraph text
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#11274c", // Black background for bottom container
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around", // Space icons evenly
    alignItems: "center",
    zIndex: 2, // Ensures the bottom container is above the background
  },
  icon: {
    marginBottom: 10, // Adds space from the bottom of the container
  },
});
