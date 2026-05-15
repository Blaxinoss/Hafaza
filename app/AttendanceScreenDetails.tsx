import { useRoute, RouteProp } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager } from 'react-native';
import axios from 'axios';
import React from 'react';
import { baseUrl } from "../context/constants";

interface Teacher {
    _id: string;
    name: string;
    phone?: string;
}

type RootStackParamList = {
    AttendanceScreenDetails: { attendanceId: string, name: string, handleSaveAbsents: (attendanceId: string, isPresent: boolean) => void };
};

type AttendanceRouteProp = RouteProp<RootStackParamList, 'AttendanceScreenDetails'>;

const AttendanceScreenDetails: React.FC = () => {
    const route = useRoute<AttendanceRouteProp>();
    const { attendanceId, name } = route.params;

    const [evaluation, setEvaluation] = useState<string>('');
    const [surahs, setSurahs] = useState<{ name: string; fromAya: string; toAya: string }[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [teacherId, setTeacherId] = useState<string>('');

    const evaluationOptions = [
        { label: 'ممتاز', color: '#2ecc71' },
        { label: 'جيد جدًا', color: '#3498db' },
        { label: 'جيد', color: '#ecc527' },
        { label: 'ضعيف', color: '#e74c3c' },
    ];

    useEffect(() => {
        const fetchAttendanceAndTeachers = async () => {
            try {
                const [attendanceRes, teachersRes] = await Promise.all([
                    axios.get(`${baseUrl}/api/attendance/attendance/${attendanceId}`),
                    axios.get(`${baseUrl}/api/teachers`),
                ]);

                const attendance = attendanceRes.data.attendance;
                setEvaluation(attendance.evaluation || '');
                setSurahs(
                    attendance.surahs.map((s: any) => ({
                        ...s,
                        fromAya: s.fromAya?.toString() || '',
                        toAya: s.toAya?.toString() || '',
                    }))
                );
                setNotes(attendance.notes || '');
                setTeacherId(attendance.teacher?._id || '');
                setTeachers(teachersRes.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAttendanceAndTeachers();
    }, [attendanceId]);

    const handleSurahChange = (index: number, field: 'name' | 'fromAya' | 'toAya', value: string) => {
        setSurahs(prev => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    };

    const handleAddSurah = () => setSurahs(prev => [...prev, { name: '', fromAya: '', toAya: '' }]);

    const handleSave = async () => {
        if (!teacherId) {
            alert('من فضلك اختر المعلم المسؤول أولًا');
            return;
        }

        try {
            await axios.put(`${baseUrl}/api/attendance/attendance/${attendanceId}`, {
                teacherId,
                evaluation,
                notes,
                surahs: surahs.map(s => ({ ...s, fromAya: Number(s.fromAya), toAya: Number(s.toAya) })),
            });
            alert('تم حفظ البيانات بنجاح');
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الحفظ');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label2}>{name}</Text>

            <Text style={styles.label}>المعلم المسؤول</Text>
            {teachers.length === 0 && <Text style={styles.helperText}>لا يوجد معلمون. أضف معلمًا أولًا.</Text>}
            {teachers.map((teacher) => {
                const selected = teacher._id === teacherId;
                return (
                    <TouchableOpacity
                        key={teacher._id}
                        style={[styles.teacherOption, selected && styles.teacherOptionSelected]}
                        onPress={() => setTeacherId(teacher._id)}
                    >
                        <Text style={[styles.teacherName, selected && styles.teacherSelectedText]}>{teacher.name}</Text>
                        <Text style={[styles.teacherPhone, selected && styles.teacherSelectedText]}>{teacher.phone || '-'}</Text>
                    </TouchableOpacity>
                );
            })}

            <Text style={styles.label}>التقييم</Text>
            {evaluationOptions.map(opt => (
                <TouchableOpacity
                    key={opt.label}
                    style={[
                        styles.option,
                        { borderColor: opt.color },
                        evaluation === opt.label && { backgroundColor: opt.color },
                    ]}
                    onPress={() => setEvaluation(opt.label)}
                >
                    <Text style={evaluation === opt.label ? styles.selectedText : { color: opt.color, fontWeight: '600' }}>
                        {opt.label}
                    </Text>
                </TouchableOpacity>
            ))}

            <Text style={styles.label}>السور المحفوظة</Text>
            {surahs.map((s, index) => (
                <View key={index} style={styles.surahRow}>

                    <TextInput
                        placeholder="إلى آية"
                        style={styles.input}
                        keyboardType="numeric"
                        placeholderTextColor={"#979797"}
                        value={s.toAya}
                        onChangeText={text => handleSurahChange(index, 'toAya', text)}
                    />
                    <TextInput
                        placeholder="من آية"
                        style={styles.input}
                        keyboardType="numeric"
                        placeholderTextColor={"#979797"}
                        value={s.fromAya}
                        onChangeText={text => handleSurahChange(index, 'fromAya', text)}
                    />
                    <TextInput
                        placeholder="اسم السورة"
                        style={styles.input}
                        placeholderTextColor={"#979797"}
                        value={s.name}
                        onChangeText={text => handleSurahChange(index, 'name', text)}
                    />
                </View>
            ))}
            <TouchableOpacity onPress={handleAddSurah}>
                <Text style={styles.addButton}>+ إضافة سورة</Text>
            </TouchableOpacity>

            <Text style={styles.label}>ملاحظات</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                value={notes}
                onChangeText={setNotes}
                placeholder="اكتب أي ملاحظات هنا"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>حفظ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AttendanceScreenDetails;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#143d6b',
        flex: 1,
        direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'right',
        color: '#ffffff',
    },
    label2: {
        backgroundColor: '#3782d3b2',
        fontSize: 18,
        fontWeight: '900',
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        color: '#ffffff',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'center'
    },





    helperText: {
        color: '#ffd08a',
        textAlign: 'right',
        marginBottom: 8,
    },
    teacherOption: {
        borderWidth: 1,
        borderColor: '#8ab8e0',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        backgroundColor: '#ffffff',
    },
    teacherOptionSelected: {
        backgroundColor: '#2e86de',
        borderColor: '#2e86de',
    },
    teacherName: {
        textAlign: 'right',
        color: '#1f2d3d',
        fontWeight: '700',
    },
    teacherPhone: {
        textAlign: 'right',
        color: '#5D6D7E',
        marginTop: 4,
    },
    teacherSelectedText: {
        color: '#ffffff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        flex: 1,
        textAlign: 'right',
        backgroundColor: '#fff',
        elevation: 1,
    },
    surahRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    addButton: {
        color: '#3498db',
        marginBottom: 20,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'right',
    },
    option: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 2,
        marginBottom: 8,
        alignItems: 'center',
    },
    selectedText: {
        color: '#fff',
        fontWeight: '700',
    },
    saveButton: {
        backgroundColor: '#2ecc71',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        elevation: 2,
    },
    saveText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
