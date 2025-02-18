import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Student = {
    id: Number,
    name: String,
    isPresent: Boolean | null,
};

const initialStudent: Student[] = [
    { id: 1, name: "Mahmouid", isPresent: null }
];


const AttendanceScreen: React.FC = () => {
    const [attendanceList, setAttendanceList] = useState<Student[]>(initialStudent);


    const markAttendance = (id: Number, status: Boolean) => {
        const updatedList = attendanceList.map((student: Student) => {
            return student.id === id ? { ...student, isPresent: status } : student
        })
        setAttendanceList(updatedList);
    }

    const handleSave = () => {
        console.log("Attendance saved:", attendanceList);
        // هنا يمكن إرسال البيانات للسيرفر أو حفظها باستخدام AsyncStorage
    };

    return (
        <View>
            <Text>Attendance Management</Text>
            <FlatList data={attendanceList} keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.studentContainer}>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    item.isPresent === true && styles.presentButton,
                                ]}
                                onPress={() => markAttendance(item.id, true)}
                            >
                                <Text style={styles.buttonText}>حاضر</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    item.isPresent === false && styles.absentButton,
                                ]}
                                onPress={() => markAttendance(item.id, false)}
                            >
                                <Text style={styles.buttonText}>غائب</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <Button title="حفظ الحضور" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    studentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    studentName: {
        fontSize: 18,
    },
    buttonsContainer: {
        flexDirection: "row",
    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    buttonText: {
        fontSize: 16,
    },
    presentButton: {
        backgroundColor: "#d4edda",
        borderColor: "#28a745",
    },
    absentButton: {
        backgroundColor: "#f8d7da",
        borderColor: "#dc3545",
    },
});

export default AttendanceScreen;