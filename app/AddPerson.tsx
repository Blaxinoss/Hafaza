import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AddPerosn() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>تفاصيل الطلاب</Text>
      <Button title="رجوع إلى الصفحة الرئيسية" onPress={() => router.push("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
