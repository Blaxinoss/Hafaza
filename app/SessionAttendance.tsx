import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { StudentAttendance } from '../types/types';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack'; // <-- مهم

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    SessionAttendance: { sessionId: string, onUpdateCount: (id: string, becamePresent: boolean) => void };
    SessionListScreen: undefined;
    AttendanceScreenDetails: { attendanceId: string }
};

type SessionAttendanceRouteProp = RouteProp<RootStackParamList, 'SessionAttendance'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AttendanceScreenDetails'>;

const SessionAttendance: React.FC = () => {
    const route = useRoute<SessionAttendanceRouteProp>();
    const { sessionId, onUpdateCount } = route.params;
    const navigation = useNavigation<NavigationProp>();
    // باقي الكود زي ما هو

    const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/attendance/session/${sessionId}`);
                setAttendances(response.data.attendances);
                setLoading(false);
            } catch (error) {
                console.log(error)
            }
        };
        fetchAttendance();
    }, [sessionId])


    const toggleAttendance = (attendanceId: string) => {
        setAttendances(prev =>
            prev.map(attendance =>
                attendance._id === attendanceId
                    ? { ...attendance, isPresent: !attendance.isPresent }
                    : attendance
            )
        );
    };

    const handleSaveAbsents = async (attendanceId: string, isPresent: boolean) => {
        try {
            const res = await axios.patch(
                `http://localhost:3000/api/attendance/attendance/${attendanceId}`,
                { isPresent: isPresent }
            );

            setAttendances(prev =>
                prev.map(att => att._id === attendanceId ? { ...att, isPresent: res.data.attendance.isPresent } : att)
            );
            onUpdateCount(sessionId, res.data.attendance.isPresent);

        } catch (error) {
            console.log("error while saving the absence", error);
        }
    };



    if (loading) return <Text className="text-center mt-10">جاري التحميل...</Text>;

    return (
        <FlatList
            data={attendances}
            keyExtractor={item => item.student._id}
            renderItem={({ item }) => (
                <View className="p-4 mb-4 bg-white rounded-lg shadow">
                    <Text className="text-lg font-bold mb-3">{item.student.name}</Text>

                    <View className="flex-row items-center justify-between">
                        {/* حالة الحضور */}
                        <TouchableOpacity
                            className={`px-4 py-2 rounded-full ${item.isPresent ? 'bg-green-500' : 'bg-red-500'}`}
                            onPress={() => {
                                const newStatus = !item.isPresent;
                                toggleAttendance(item._id);
                                handleSaveAbsents(item._id, newStatus);
                            }}
                        >
                            <Text className="text-white font-semibold">{item.isPresent ? 'حاضر' : 'غائب'}</Text>
                        </TouchableOpacity>

                        {/* زر التفاصيل */}
                        <TouchableOpacity
                            className="px-4 py-2 bg-blue-500 rounded-lg shadow-md"
                            onPress={() => navigation.navigate('AttendanceScreenDetails', { attendanceId: item._id })}
                        >
                            <Text className="text-white font-semibold">تفاصيل</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    );
};

export default SessionAttendance;


