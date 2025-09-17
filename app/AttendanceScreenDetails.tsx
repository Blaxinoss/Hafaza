import { useRoute, RouteProp } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import React from 'react';

type RootStackParamList = {
    AttendanceScreenDetails: { attendanceId: string };
};

type AttendanceRouteProp = RouteProp<RootStackParamList, 'AttendanceScreenDetails'>;

const AttendanceScreenDetails: React.FC = () => {
    const route = useRoute<AttendanceRouteProp>();
    const { attendanceId } = route.params;

    const [evaluation, setEvaluation] = useState<string>('');
    const [surahs, setSurahs] = useState<{ name: string; fromAya: string; toAya: string }[]>([]);
    const [notes, setNotes] = useState<string>('');
    const evaluationOptions = ['ممتاز', 'جيد جدًا', 'جيد', 'ضعيف'];

    // جلب بيانات الحضور عند فتح الشاشة
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/attendance/attendance/${attendanceId}`);
                setEvaluation(res.data.attendance.evaluation || '');
                setSurahs(
                    res.data.attendance.surahs.map((s: any) => ({
                        ...s,
                        fromAya: s.fromAya?.toString() || '',
                        toAya: s.toAya?.toString() || '',
                    }))
                );
                setNotes(res.data.attendance.notes || '');

            } catch (err) {
                console.error(err);
            }
        };
        fetchAttendance();
    }, [attendanceId]);

    const handleSurahChange = (index: number, field: 'name' | 'fromAya' | 'toAya', value: string) => {
        setSurahs(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
    };

    const handleAddSurah = () => setSurahs(prev => [...prev, { name: '', fromAya: '', toAya: '' }]);

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:3000/api/attendance/attendance/${attendanceId}`, {
                evaluation,
                notes,
                surahs: surahs.map(s => ({ ...s, fromAya: Number(s.fromAya), toAya: Number(s.toAya) }))
            });
            alert('تم حفظ البيانات بنجاح');
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الحفظ');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>التقييم</Text>
            {evaluationOptions.map(opt => (
                <TouchableOpacity
                    key={opt}
                    style={[styles.option, evaluation === opt && styles.selectedOption]}
                    onPress={() => setEvaluation(opt)}
                >
                    <Text style={evaluation === opt ? styles.selectedText : styles.optionText}>{opt}</Text>
                </TouchableOpacity>
            ))}

            <Text style={styles.label}>السور المحفوظة</Text>
            {surahs.map((s, index) => (
                <View key={index} style={styles.surahRow}>
                    <TextInput placeholder="من آية" style={styles.input} keyboardType="numeric" value={s.fromAya} onChangeText={text => handleSurahChange(index, 'fromAya', text)} />
                    <TextInput placeholder="إلى آية" style={styles.input} keyboardType="numeric" value={s.toAya} onChangeText={text => handleSurahChange(index, 'toAya', text)} />
                    <TextInput placeholder="اسم السورة" style={styles.input} value={s.name} onChangeText={text => handleSurahChange(index, 'name', text)} />
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
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
        flex: 1,
    },
    surahRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    addButton: {
        color: '#007bff',
        marginBottom: 20,
        fontSize: 16,
    },
    option: {
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 5,
    },
    selectedOption: {
        backgroundColor: '#007bff',
    },
    optionText: {
        color: '#000',
    },
    selectedText: {
        color: '#fff',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    saveText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
