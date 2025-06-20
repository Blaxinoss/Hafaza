import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface Session {
  _id: string;
  date: Date;
  attendancesCreated?: number; // عدد الحضور لكل جلسة
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendancesCreatedCount,setAttendancesCreatedCount] = useState <number | 0>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message,setMessage] = useState<string |null>(null)
  const router = useRouter();

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/sessions');
      setSessions(res.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

const renderSessionItem = ({ item }: { item: Session }) => {
  return (
    <TouchableOpacity style={styles.sessionCard}>
      <Text style={styles.sessionDate}>
        📅 {new Date(item.date).toLocaleDateString()} - {attendancesCreatedCount}
      </Text>
    </TouchableOpacity>
  );
};

  const sessionAdding =async()=>{
    try{
      const date = new Date();
      const result = await axios.post('http://localhost:3000/api/sessions',{date});
   if (!result || !result.data) {
  console.log('No data received from session creation');
  setMessage("Session Failed to be created");
} else {
  console.log('Session creation response:', result.data);
  setMessage("Session Created Successfully");
  setAttendancesCreatedCount(result.data.attendancesCreated);
  fetchSessions();
}
    }catch(error : any){
   console.error('Error adding session:', error);
    setError(error.message || 'حدث خطأ غير متوقع');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>كل الجلسات</Text>
      <TouchableOpacity style={styles.addButton} onPress={sessionAdding}>
  <Text style={styles.addButtonText}>➕ إضافة جلسة جديدة</Text>
</TouchableOpacity>


      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item._id}
          renderItem={renderSessionItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}


      {message && (
        <View>
          <Text>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
  backgroundColor: '#007bff',
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
  alignItems: 'center',
},
addButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
  sessionCard: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  attendanceText: {
    fontSize: 16,
    color: '#555',
  },
});
