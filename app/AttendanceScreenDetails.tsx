import { useRoute, RouteProp } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager } from 'react-native';
import axios from 'axios';
import React from 'react';

type RootStackParamList = {
    AttendanceScreenDetails: { attendanceId: string, name: string, handleSaveAbsents: (attendanceId: string, isPresent: boolean) => void };
};

type AttendanceRouteProp = RouteProp<RootStackParamList, 'AttendanceScreenDetails'>;

const AttendanceScreenDetails: React.FC = () => {
    const route = useRoute<AttendanceRouteProp>();
    const { attendanceId, name, handleSaveAbsents } = route.params;

    const [evaluation, setEvaluation] = useState<string>('');
    const [surahs, setSurahs] = useState<{ name: string; fromAya: string; toAya: string }[]>([]);
    const [notes, setNotes] = useState<string>('');

    const evaluationOptions = [
        { label: 'ممتاز', color: '#2ecc71' }, // أخضر
        { label: 'جيد جدًا', color: '#3498db' }, // أزرق
        { label: 'جيد', color: '#ecc527' }, // أصفر
        { label: 'ضعيف', color: '#e74c3c' }, // أحمر
    ];

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get(`https://hafaza-xleq.vercel.app/api/attendance/attendance/${attendanceId}`);
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
        setSurahs(prev => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    };

    const handleAddSurah = () => setSurahs(prev => [...prev, { name: '', fromAya: '', toAya: '' }]);

    const handleSave = async () => {
        try {
            await axios.put(`https://hafaza-xleq.vercel.app/api/attendance/attendance/${attendanceId}`, {
                evaluation,
                notes,
                surahs: surahs.map(s => ({ ...s, fromAya: Number(s.fromAya), toAya: Number(s.toAya) })),
            });
            // handleSaveAbsents(attendanceId, true)
            alert('تم حفظ البيانات بنجاح');
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الحفظ');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label2}>{name}</Text>

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
        backgroundColor: '#143d6b', // خلفية فاتحة هادية
        flex: 1,
        direction: I18nManager.isRTL ? 'rtl' : 'ltr', // من اليمين لليسار
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
        paddingHorizontal: 14, // بادينج يمين وشمال
        paddingVertical: 8,    // بادينج فوق وتحت
        borderRadius: 12,      // راوندد // ياخد عرض على قد النص
        alignSelf: 'center'
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
