import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

type Student = {
  _id: string;
  name: string;
  age: number;
  lastAttendance: Date;
  phone: string;
  isPresent?: boolean;
};

type AttendanceEntry = {
  student: string;
  isPresent: boolean;
  surahs?: { name: string; ayasCount: number }[];
  evaluation?: 'ممتاز' | 'جيد جدًا' | 'جيد' | 'ضعيف';
  notes?: string;
};

type SessionForm = {
  date: Date;
  attendances: AttendanceEntry[];
};

const AttendanceScreen: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [sessionData, setSessionData] = useState<SessionForm>({
    date: new Date(),
    attendances: [],
  });

  const fetchStudents = async () => {
    try {
      const result = await axios.get('http://localhost:3000/api/students');
      if (result.status === 200 && result.data) {
        setAttendanceList(result.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const markAttendance = (id: string, status: boolean) => {
    setSessionData((prev) => {
      const existing = prev.attendances.find((a) => a.student === id);
      const newAttendances = existing
        ? prev.attendances.map((a) =>
            a.student === id ? { ...a, isPresent: status } : a
          )
        : [...prev.attendances, { student: id, isPresent: status }];
      return {
        ...prev,
        attendances: newAttendances,
      };
    });

    setAttendanceList((prevList) =>
      prevList.map((student) =>
        student._id === id ? { ...student, isPresent: status } : student
      )
    );
  };

  const handleSave = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/sessions', sessionData);
      console.log('Session saved:', res.data);
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  const filteredList = attendanceList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.manageDiv}>
        <Text style={styles.md_header}>الأعضاء</Text>
        <View style={styles.headerRight}>
         
          <Text style={styles.memberCount}>{attendanceList.length} عضو </Text>
        </View>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="... ابحث عن عضو"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#aaa"
      />

      {filteredList.length > 0 && (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.studentContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={
                    item.isPresent === true
                      ? 'checkmark-circle'
                      : item.isPresent === false
                      ? 'close-circle'
                      : 'ellipse-outline'
                  }
                  size={24}
                  color={
                    item.isPresent === true
                      ? '#28a745'
                      : item.isPresent === false
                      ? '#dc3545'
                      : '#ccc'
                  }
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.studentName}>{item.name}</Text>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, item.isPresent && styles.presentButton]}
                  onPress={() => markAttendance(item._id, true)}
                >
                  <Text
                    style={[styles.buttonText, item.isPresent && styles.presentButtonText]}
                  >
                    حاضر
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, item.isPresent === false && styles.absentButton]}
                  onPress={() => markAttendance(item._id, false)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      item.isPresent === false && styles.absentButtonText,
                    ]}
                  >
                    غائب
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save" size={20} color="white" />
        <Text style={styles.saveButtonText}>حفظ الحضور</Text>
      </TouchableOpacity>

    
    </View>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  manageDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  md_header: { fontSize: 20, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  md_button: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  md_button_text: { color: 'white', marginLeft: 5 },
  memberCount: { fontSize: 14, color: '#555' },
  searchBar: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  studentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: { fontSize: 16 },
  buttonsContainer: { flexDirection: 'row' },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  presentButton: { backgroundColor: '#28a745' },
  presentButtonText: { color: 'white' },
  absentButton: { backgroundColor: '#dc3545' },
  absentButtonText: { color: 'white' },
  buttonText: { color: '#000' },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', marginLeft: 8, fontSize: 16 },
});
