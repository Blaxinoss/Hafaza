import { useRouter } from "expo-router";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  name: string;
  phone: string;
  age: number;
  _id: string;
  lastAttendance?: Date;
  photo?: string;
}

export default function AddPerson() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchWord, setSearchWord] = useState<string>('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://hafaza-xleq.vercel.app/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء جلب الطلاب');
    }
  };

  const filteredList = students.filter((std: Student) =>
    std.name.toLowerCase().includes(searchWord.toLowerCase())
  );

  const handleAddStudent = async () => {
    if (!name || !age || !phone) {
      Alert.alert('خطأ', 'من فضلك املأ جميع الحقول');
      return;
    }

    setLoading(true);

    try {
      await axios.post('https://hafaza-xleq.vercel.app/api/students', {
        name,
        age: Number(age),
        phone,
      });

      Alert.alert('تمت الإضافة', 'تم إضافة الطالب بنجاح');

      // Clear form after successful addition
      setName('');
      setAge('');
      setPhone('');

      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('فشل', 'حدث خطأ أثناء إضافة الطالب');
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View className="" style={styles.headerContainer}>
      <Text style={styles.title}>إضافة طالب جديد</Text>

      <TextInput
        style={styles.input}
        placeholder="الاسم"
        value={name}
        placeholderTextColor="#999"
        onChangeText={setName}
        textAlign="right"
      />

      <TextInput
        style={styles.input}
        placeholder="العمر"
        value={age}
        onChangeText={setAge}
        placeholderTextColor="#999"
        keyboardType="numeric"
        textAlign="right"
      />

      <TextInput
        style={styles.input}
        placeholder="رقم الهاتف"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        textAlign="right"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddStudent}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>إضافة</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.backText}>رجوع إلى الصفحة الرئيسية</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 أبحث عن شخص معين"
        value={searchWord}
        onChangeText={setSearchWord}
        placeholderTextColor="#999"
        textAlign="right"
      />

    </View>
  );

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.studentCard}>
      <Text style={styles.studentName}>{item.name}</Text>
      <Text style={styles.studentInfo}>العمر: {item.age}</Text>
      <Text style={styles.studentInfo}>الهاتف: {item.phone}</Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>لم تضف أي طلبة بعد</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item._id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        renderItem={renderStudent}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        columnWrapperStyle={filteredList.length > 0 ? styles.row : undefined}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#235374", // ✅ لون جميل ومتناسق
  },
  headerContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#235374", // ✅ متطابق مع Container
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF', // ✅ أبيض خالص أوضح
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF', // ✅ أبيض خالص بدلاً من #f5f5f5
    padding: 12,
    borderRadius: 12, // ✅ زيادة نعومة الحواف
    marginBottom: 12,
    textAlign: "right",
    writingDirection: 'rtl',
    borderWidth: 1,
    borderColor: '#E1E8ED', // ✅ لون حد أنعم
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // ظل خفيف للـ inputs
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#F8FBFF', // ✅ أزرق فاتح جداً ومريح للعين
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "right",
    borderWidth: 2, // ✅ زيادة سُمك الحد قليلاً
    borderColor: '#4A90E2', // ✅ أزرق أكثر حيوية من #007bff
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    width: '100%',
    backgroundColor: '#2ECC71', // ✅ أخضر أكثر حداثة من #28a745
    padding: 16, // ✅ زيادة الـ padding قليلاً
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // ظل للزر
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5, // ✅ تباعد خفيف بين الحروف
  },
  backText: {
    color: '#FFB74D', // ✅ برتقالي أكثر نعومة من #ff8800
    fontSize: 16,
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontWeight: '500', // ✅ وزن متوسط
  },
  listTitle: {
    writingDirection: 'rtl',
    width: '100%',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#B8E6E3', // ✅ لون متناسق أكثر مع الموضوع
  },
  flatListContent: {
    paddingBottom: 20,
    paddingTop: 10, // ✅ إضافة مساحة من فوق
  },
  row: {
    justifyContent: 'space-between', // ✅ توزيع أفضل من space-around
    paddingHorizontal: 15, // ✅ زيادة المساحة الجانبية
  },
  studentCard: {
    flex: 1,
    margin: 8, // ✅ زيادة المسافة بين الكروت
    padding: 16, // ✅ زيادة الـ padding الداخلي
    backgroundColor: '#FFFFFF', // ✅ أبيض خالص
    borderRadius: 16, // ✅ حواف أكثر نعومة
    borderWidth: 0, // ✅ إزالة الحد واعتماد على الظل فقط
    shadowColor: '#235374',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4, // ✅ ظل أقوى
    minHeight: 110, // ✅ زيادة الارتفاع قليلاً
    maxWidth: '46%', // ✅ تقليل العرض قليلاً للمساحات أفضل
  },
  studentName: {
    fontWeight: '700', // ✅ وزن أقوى للاسم
    fontSize: 17, // ✅ زيادة حجم الخط قليلاً
    marginBottom: 8, // ✅ زيادة المسافة
    textAlign: 'right',
    color: '#2C3E50', // ✅ لون أغمق وأوضح
  },
  studentInfo: {
    fontSize: 14,
    color: '#5D6D7E', // ✅ لون أكثر تناسقاً
    marginBottom: 4, // ✅ زيادة المسافة بين الأسطر
    textAlign: 'right',
    fontWeight: '400',
  },
  emptyContainer: {
    padding: 40, // ✅ زيادة الـ padding
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', // ✅ خلفية شفافة خفيفة
    borderRadius: 12,
    margin: 20,
  },
  emptyText: {
    fontWeight: "600",
    color: "#B8E6E3", // ✅ نفس لون العنوان للتناسق
    fontSize: 18, // ✅ زيادة حجم الخط
    textAlign: 'center',
    lineHeight: 24, // ✅ تحسين المسافة بين الأسطر
  },
});