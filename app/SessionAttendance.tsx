import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StudentAttendance } from '../types/types';
import { baseUrl } from "../context/constants";


type RootStackParamList = {
    SessionAttendance: {
        sessionId: string;
        onUpdateCount: (id: string, becamePresent: boolean) => void;
    };
    SessionListScreen: undefined;
    AttendanceScreenDetails: { attendanceId: string, name: string, handleSaveAbsents: (attendanceId: string, isPresent: boolean) => void };
};

type SessionAttendanceRouteProp = RouteProp<RootStackParamList, 'SessionAttendance'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AttendanceScreenDetails'>;

const SessionAttendance: React.FC = () => {
    const route = useRoute<SessionAttendanceRouteProp>();
    const { sessionId, onUpdateCount } = route.params;
    const navigation = useNavigation<NavigationProp>();

    const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 📌 تحميل بيانات الحضور
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(
                    `${baseUrl}/api/attendance/session/${sessionId}`
                );
                setAttendances(response.data.attendances);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [sessionId]);

    // 📌 تحديث الحالة في السيرفر
    const handleSaveAbsents = async (attendanceId: string, isPresent: boolean) => {
        try {
            const res = await axios.patch(
                `${baseUrl}/api/attendance/attendance/${attendanceId}`,
                { isPresent }
            );

            setAttendances(prev =>
                prev.map(att =>
                    att._id === attendanceId
                        ? { ...att, isPresent: res.data.attendance.isPresent }
                        : att
                )
            );

            // تحديث عداد الجلسة
            onUpdateCount(sessionId, res.data.attendance.isPresent);
        } catch (error) {
            console.error('Error while saving the absence:', error);
        }
    };

    // 📌 عرض أثناء التحميل
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#235374" />
                <Text className="mt-3 text-gray-600">جاري تحميل الحضور...</Text>
            </View>
        );
    }

    // 📌 عرض القائمة
    return (
        <FlatList
            data={attendances}
            keyExtractor={item => item._id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
                <View className="items-center mt-20">
                    <Ionicons name="people-outline" size={64} color="#B8E6E3" />
                    <Text className="mt-4 text-lg font-semibold text-gray-600">
                        لا يوجد حضور مسجل
                    </Text>
                </View>
            }
            renderItem={({ item }) => (
                <View style={{ backgroundColor: '#e7f2f8' }} className="p-5 mb-4 rounded-2xl shadow-md border border-gray-100 ">

                    <View className='flex items-end'>
                        {/* اسم الطالب */}
                        <Text className="text-lg font-bold text-gray-800 mb-2">
                            {item.student.name}
                        </Text>

                        {/* بيانات إضافية لو متاحة */}
                        {item.student.phone && (
                            <Text className="text-sm text-gray-500 mb-1">
                                الهاتف: {item.student.phone}
                            </Text>
                        )}

                    </View>

                    <View className="flex-row items-center justify-between mt-3">
                        {/* حالة الحضور */}
                        <TouchableOpacity
                            className={`flex-row items-center px-4 py-2 rounded-full ${item.isPresent ? 'bg-green-600' : 'bg-red-600'
                                }`}
                            onPress={() => {
                                const newStatus = !item.isPresent;
                                handleSaveAbsents(item._id, newStatus);
                            }}
                        >
                            <Ionicons
                                name={item.isPresent ? 'checkmark-circle' : 'close-circle'}
                                size={20}
                                color={item.isPresent ? '#f1f1f1' : '#535252'}
                            />
                            <Text
                                className={`ml-2 font-semibold ${item.isPresent ? 'text-slate-800' : 'text-white-500'}`}
                            >
                                {item.isPresent ? 'حاضر' : 'غائب'}
                            </Text>
                        </TouchableOpacity>

                        {/* زر التفاصيل */}
                        <TouchableOpacity
                            className="flex-row items-center px-4 py-2 bg-blue-500 rounded-lg shadow-md"
                            onPress={() =>
                                navigation.navigate('AttendanceScreenDetails', {
                                    attendanceId: item._id,
                                    name: item.student.name,
                                    handleSaveAbsents,
                                })
                            }
                        >
                            <Ionicons name="information-circle" size={18} color="#fff" />
                            <Text className="ml-2 text-white font-semibold">تفاصيل</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    );
};

export default SessionAttendance;
