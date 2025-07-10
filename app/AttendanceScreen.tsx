import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Student = {
  _id: string;
  name: string;
  age: number;
  lastAttendance: Date;
  phone: string;
  isPresent?: boolean;
};

type AttendanceEntry = {
  studentId: string;
  sessionId: string;
  isPresent: boolean;
  surahs?: {
    name: string;
    fromAya: number;
    toAya: number;
  }[];
  evaluation?: 'ممتاز' | 'جيد جدًا' | 'جيد' | 'ضعيف';
  notes?: string;
};

type SessionForm = {
  attendances: AttendanceEntry[];
};

type RootStackParamList = {
  SessionListScreen: {
    sessionId: string;
  };
  AttendanceScreen: {
    sessionId: string;
    updatedAttendance?: AttendanceEntry;
  };
  AttendanceScreenDetails: {
    sessionId: string;
    studentId: string;
    isPresent: boolean;
    updateAttendance?: (updated: AttendanceEntry) => void;
  };
};

type AttendanceListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AttendanceScreen: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const route = useRoute<RouteProp<RootStackParamList, 'AttendanceScreen'>>();
  const { sessionId: initialSessionId } = route.params;
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [sessionData, setSessionData] = useState<SessionForm>({
    attendances: [],
  });
  const navigation = useNavigation<AttendanceListNavigationProp>();

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

  useEffect(() => {
    if (route.params?.sessionId) {
      setSessionId(route.params.sessionId);
    }
  }, [route.params]);

  useEffect(() => {
    console.log('Session data updated:', sessionData);
  }, [sessionData]);

  const markAttendance = (id: string, status: boolean) => {
    setSessionData((prev) => {
      const existing = prev.attendances.find((a) => a.studentId === id);
      const updatedAttendances = [
        ...prev.attendances.filter((a) => a.studentId !== id),
        existing
          ? { ...existing, isPresent: status }
          : { studentId: id, sessionId, isPresent: status },
      ];
      return {
        ...prev,
        attendances: updatedAttendances,
      };
    });
  };

  const handleSave = async () => {
    console.log('Data to be sent to backend:', sessionData);
    try {
      const res = await axios.post('http://localhost:3000/api/attendance', sessionData);
      console.log('Session data saved:', res.data);
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  const mergedList = attendanceList.map((student) => {
    const attendance = sessionData.attendances.find((a) => a.studentId === student._id);
    return {
      ...student,
      isPresent: attendance?.isPresent ?? false,
    };
  });

  const filteredList = mergedList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.manageDiv}>
        <Text style={styles.md_header}>الأعضاء</Text>
        <View style={styles.headerRight}>
          <Text style={styles.memberCount}>{attendanceList.length} عضو</Text>
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
                    style={[styles.buttonText, item.isPresent === false && styles.absentButtonText]}
                  >
                    غائب
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('AttendanceScreenDetails', {
                      studentId: item._id,
                      sessionId,
                      isPresent: item.isPresent ?? false,
                      updateAttendance: (updated: AttendanceEntry) => {
                        setSessionData((prev) => {
                          const exists = prev.attendances.find((a) => a.studentId === updated.studentId);
                          console.log('Callback received:', updated);
                          const updatedList = exists
                            ? prev.attendances.map((a) =>
                                a.studentId === updated.studentId ? { ...a, ...updated } : a
                              )
                            : [...prev.attendances, updated];
                          return { ...prev, attendances: updatedList };
                        });
                      },
                    });
                  }}
                >
                  <Text style={styles.buttonText}>تفاصيل</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  manageDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  md_header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 16,
    color: '#666',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  studentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentName: {
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  presentButton: {
    backgroundColor: '#28a745',
  },
  presentButtonText: {
    color: '#fff',
  },
  absentButton: {
    backgroundColor: '#dc3545',
  },
  absentButtonText: {
    color: '#fff',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AttendanceScreen;