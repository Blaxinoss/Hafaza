import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Session {
  _id: string;
  date: Date;
  presentCount: number;
}

type RootStackParamList = {
  SessionListScreen: undefined;
  SessionAttendance: { sessionId: string, onUpdateCount: (id: string, becamePresent: boolean) => void };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SessionAttendance'>;

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [studentsCount, setStudentsCount] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp>();

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://192.168.1.106:3000/api/sessions');
      setSessions(res.data.sessions);
      setStudentsCount(res.data.studentCurrentCount);
      console.log(res.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('فشل في تحميل الجلسات');
    } finally {
      setLoading(false);
    }
  };

  const updatePresentCount = (sessionId: string, becamePresent: boolean) => {
    setSessions(prev =>
      prev.map(s => s._id === sessionId
        ? { ...s, presentCount: s.presentCount + (becamePresent ? 1 : -1) }
        : s
      )
    );
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const renderSessionItem = ({ item }: { item: Session }) => {
    const attendancePercentage = studentsCount ? Math.round((item.presentCount / studentsCount) * 100) : 0;
    const isHighAttendance = attendancePercentage >= 70;

    return (
      <TouchableOpacity
        style={[
          styles.sessionCard,
          isHighAttendance ? styles.highAttendanceCard : styles.lowAttendanceCard
        ]}
        onPress={() =>
          navigation.navigate('SessionAttendance', {
            sessionId: item._id ?? '',
            onUpdateCount: updatePresentCount
          })
        }
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={20} color="#235374" />
            <Text style={styles.sessionDate}>
              {new Date(item.date).toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>

          <View style={styles.attendanceContainer}>
            <View style={[
              styles.attendanceBadge,
              isHighAttendance ? styles.goodAttendance : styles.lowAttendance
            ]}>
              <Text style={styles.attendancePercentage}>
                {attendancePercentage}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.attendanceInfo}>
            <Ionicons
              name="people"
              size={16}
              color={isHighAttendance ? "#2ECC71" : "#E74C3C"}
            />
            <Text style={styles.attendanceText}>
              {item.presentCount}/{studentsCount} حاضر
            </Text>
          </View>

          <Ionicons name="chevron-back" size={16} color="#235374" />
        </View>
      </TouchableOpacity>
    );
  };

  const sessionAdding = async () => {
    try {
      setLoading(true);
      const date = new Date();
      const result = await axios.post('http://192.168.1.106:3000/api/sessions', { date });

      if (!result || !result.data) {
        Alert.alert('خطأ', 'فشل في إنشاء الجلسة');
      } else {
        Alert.alert('نجح', 'تم إنشاء الجلسة بنجاح');
        fetchSessions();
      }
    } catch (error: any) {
      console.error('Error adding session:', error);
      Alert.alert('خطأ', error.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>


      <TouchableOpacity
        style={styles.addButton}
        onPress={sessionAdding}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>إضافة جلسة جديدة</Text>

          </>
        )}
      </TouchableOpacity>
      <Text style={styles.subtitle}>
        إجمالي الطلاب: {studentsCount || 0}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#B8E6E3" />
      <Text style={styles.emptyTitle}>لا توجد جلسات بعد</Text>
      <Text style={styles.emptySubtitle}>ابدأ بإضافة جلسة جديدة</Text>
    </View>
  );

  if (loading && sessions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#235374" />
          <Text style={styles.loadingText}>جاري تحميل الجلسات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item._id}
        renderItem={renderSessionItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}

        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#235374',
  },

  headerContainer: {
    backgroundColor: '#235374',
    paddingBottom: 24,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#B8E6E3',
    textAlign: 'center',
    marginTop: 15,
  },

  addButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 200,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  flatListContent: {
    paddingBottom: 20,
  },

  sessionCard: {

    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  highAttendanceCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },

  lowAttendanceCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
  },

  attendanceContainer: {
    alignItems: 'flex-end',
  },

  attendanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },

  goodAttendance: {
    backgroundColor: '#E8F8F5',
  },

  lowAttendance: {
    backgroundColor: '#FDEDEC',
  },

  attendancePercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  attendanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  attendanceText: {
    fontSize: 14,
    color: '#5D6D7E',
    marginLeft: 6,
    fontWeight: '500',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#B8E6E3',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B8E6E3',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    color: '#B8E6E3',
    textAlign: 'center',
    opacity: 0.8,
  },

  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#E74C3C',
    padding: 12,
    borderRadius: 8,
  },

  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});