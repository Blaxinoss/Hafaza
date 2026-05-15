import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { baseUrl } from '../context/constants';

interface Teacher {
    _id: string;
    name: string;
    phone: string;
}

export default function AddTeacher() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const hasSearchInput = name.trim().length > 0 || phone.trim().length > 0;

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/teachers`);
            setTeachers(response.data || []);
        } catch (error) {
            console.error('Error loading teachers:', error);
            Alert.alert('خطأ', 'تعذر تحميل قائمة المعلمين');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // const filteredTeachers = useMemo(() => {
    //     const nameQuery = name.trim().toLowerCase();
    //     const phoneQuery = phone.trim().toLowerCase();

    //     return teachers.filter((teacher) => {
    //         const matchesName = !nameQuery || teacher.name.toLowerCase().includes(nameQuery);
    //         const matchesPhone = !phoneQuery || teacher.phone.toLowerCase().includes(phoneQuery);
    //         return matchesName && matchesPhone;
    //     });
    // }, [teachers, name, phone]);

    const addTeacherIfNotExists = async () => {
        if (!name.trim() || !phone.trim()) {
            Alert.alert('خطأ', 'الاسم ورقم الهاتف مطلوبان');
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                // update
                const res = await axios.put(`${baseUrl}/api/teachers/${editingId}`, {
                    name: name.trim(),
                    phone: phone.trim(),
                });
                const updated = res.data;
                setTeachers((prev) => prev.map(t => t._id === updated._id ? updated : t));
                Alert.alert('نجاح', 'تم تحديث بيانات المعلم');
                setEditingId(null);
            } else {
                const response = await axios.post(`${baseUrl}/api/teachers/find-or-create`, {
                    name: name.trim(),
                    phone: phone.trim(),
                });

                const teacher = response.data?.teacher;
                const exists = Boolean(response.data?.exists);

                if (teacher) {
                    setTeachers((prev) => {
                        const hasTeacher = prev.some((t) => t._id === teacher._id);
                        return hasTeacher ? prev : [teacher, ...prev];
                    });
                }

                if (exists) {
                    Alert.alert('موجود مسبقًا', 'هذا المعلم موجود بالفعل');
                } else {
                    Alert.alert('نجاح', 'تمت إضافة المعلم بنجاح');
                }
            }
        } catch (error) {
            console.error('Error creating teacher:', error);
            Alert.alert('خطأ', 'فشل في إضافة المعلم');
        } finally {
            setLoading(false);
        }
    };

    const deleteTeacher = async (id: string) => {
        Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذا المعلم؟', [
            { text: 'إلغاء', style: 'cancel' },
            {
                text: 'حذف',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setLoading(true);
                        await axios.delete(`${baseUrl}/api/teachers/${id}`);
                        setTeachers((prev) => prev.filter(t => t._id !== id));
                        if (editingId === id) {
                            setEditingId(null);
                            setName('');
                            setPhone('');
                        }
                        Alert.alert('نجح', 'تم حذف المعلم');
                    } catch (err) {
                        console.error('Error deleting teacher:', err);
                        Alert.alert('خطأ', 'فشل في حذف المعلم');
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]);
    };

    const startEditing = (teacher: Teacher) => {
        setEditingId(teacher._id);
        setName(teacher.name);
        setPhone(teacher.phone);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setName('');
        setPhone('');
    };

    const renderTeacher = ({ item }: { item: Teacher }) => (
        <View style={styles.teacherCard}>
            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => startEditing(item)}
                    disabled={loading}
                >
                    <Ionicons name="create-outline" size={20} color="#235374" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => deleteTeacher(item._id)}
                    disabled={loading}
                >
                    <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
            </View>

            <Text style={styles.teacherName}>{item.name}</Text>
            <Text style={styles.teacherPhone}>{item.phone}</Text>
        </View>
    );

    return (
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>إدارة المعلمين</Text>

                <TextInput
                    style={styles.input}
                    placeholder="اسم المعلم"
                    placeholderTextColor="#89939E"
                    value={name}
                    onChangeText={setName}
                    textAlign="right"
                />

                <TextInput
                    style={styles.input}
                    placeholder="رقم الهاتف"
                    placeholderTextColor="#89939E"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    textAlign="right"
                />

                <View style={styles.actionsRow}>
                    <TouchableOpacity style={[styles.button, styles.searchButton]} onPress={fetchTeachers} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>تحديث</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.addButton]} onPress={addTeacherIfNotExists} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{editingId ? 'تحديث المعلم' : 'إضافة إذا غير موجود'}</Text>}
                    </TouchableOpacity>

                    {editingId && (
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#E74C3C' }]} onPress={cancelEditing} disabled={loading}>
                            <Text style={styles.buttonText}>إلغاء التعديل</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity onPress={() => router.push('/')}>
                    <Text style={styles.backText}>رجوع إلى الصفحة الرئيسية</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={teachers}
                keyExtractor={(item) => item._id}
                renderItem={renderTeacher}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {hasSearchInput ? 'لا توجد نتائج مطابقة' : 'لا يوجد معلمون بعد'}
                        </Text>
                    </View>
                }
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#235374',
    },
    headerContainer: {
        padding: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E1E8ED',
        padding: 12,
        marginBottom: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    button: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    searchButton: {
        backgroundColor: '#4A90E2',
    },
    addButton: {
        backgroundColor: '#2ECC71',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    backText: {
        color: '#FFB74D',
        fontSize: 16,
        marginTop: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    listContent: {
        paddingHorizontal: 14,
        paddingBottom: 20,
    },
    teacherCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 8,
        marginBottom: 8,
    },
    iconButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#F2F6FA',
    },
    teacherName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        textAlign: 'right',
    },
    teacherPhone: {
        marginTop: 6,
        color: '#5D6D7E',
        textAlign: 'right',
    },
    emptyContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: '#CFE4F5',
        fontSize: 16,
        fontWeight: '600',
    },
});
