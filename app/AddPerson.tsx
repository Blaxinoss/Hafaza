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
  name:string;
  phone:string;
  age:number;
  _id:string;
  lastAttendance?:Date;
  photo?:string;
}


export default function AddPerson() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchWord,setSearchWord] = useState<string>('');

  useEffect(() => {
    fetchStudents();
  }, []);

  
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء جلب الطلاب');
    }
  };

  const filteredList = students.filter((std : Student)=>  std.name.toLowerCase().includes(searchWord.toLowerCase())
);


  const handleAddStudent = async () => {
    if (!name || !age || !phone) {
      Alert.alert('خطأ', 'من فضلك املأ جميع الحقول');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/students', {
        name,
        age: Number(age),
        phone,
      });

      Alert.alert('تمت الإضافة', 'تم إضافة الطالب بنجاح');
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('فشل', 'حدث خطأ أثناء إضافة الطالب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إضافة طالب جديد</Text>

      <TextInput
        style={styles.input}
        placeholder="الاسم"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="العمر"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="رقم الهاتف"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
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

  <View style={{ 
    width:'100%',
  flexDirection: 'row', 
  flexWrap: 'wrap', 
  justifyContent: 'flex-end', 
  gap: 8,  // ملاحظة: gap في RN لسه غير مدعوم رسمي، ممكن تستخدم margin بدلاً منه
  padding: 10,
}}>
      <TextInput
        style={styles.input}
        placeholder="🔍...أبحث عن شخص معين"
        value={searchWord}
onChangeText={(e) => setSearchWord(e)}
        keyboardType="numeric"
      />

  {filteredList && filteredList.length >0 && filteredList.map((item : Student) => (
    <View key={item._id} style={{
      width: '25%', // تقريبًا نص العرض - تقدر تعدل حسب الحاجة
      marginBottom: 12,
      padding: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    }}>
      <Text style={{ fontWeight: '600' }}>{item.name}</Text>
      <Text>العمر: {item.age}</Text>
      <Text>الهاتف: {item.phone}</Text>
    </View>
  ))}

 
</View>
 {filteredList.length == 0 && (
    <View>
      <Text style={{fontWeight:"bold",color:"#007bff"}}>لم تضف أي طلبة بعد</Text>
    </View>
  )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    textAlign:"right"
  },
  button: {
    width: '100%',
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  backText: {
    color: '#007bff',
    fontSize: 16,
    marginBottom:25
  },
});
