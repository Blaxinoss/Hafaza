import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type AttendanceEntry = {
  studentId: string;
  sessionId: string;
  evaluation?: 'ممتاز' | 'جيد جدًا' | 'جيد' | 'ضعيف';
  notes?: string;
        isPresent:boolean;

  surahs?: {
    name: string;
    fromAya: number;
    toAya: number;
  }[];
};
type Evaluation = 'ممتاز' | 'جيد جدًا' | 'جيد' | 'ضعيف';


type RootStackParamList = {
  AttendanceScreen: { updatedAttendance?: AttendanceEntry; sessionId: string } | undefined;
  AttendanceScreenDetails: {
    sessionId: string;
    studentId: string;
    isPresent: boolean;
    updateAttendance?: (updated: AttendanceEntry) => void;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'AttendanceScreenDetails'>;

const evaluationOptions = ['ممتاز', 'جيد جدًا', 'جيد', 'ضعيف'] as const;

const AttendanceScreenDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { studentId, sessionId ,isPresent} = route.params;

const [evaluation, setEvaluation] = useState<Evaluation | undefined>(undefined);
  const [notes, setNotes] = useState('');
const [surahs, setSurahs] = useState([{ name: '', fromAya: '', toAya: '' }]);



useEffect(() => {
  // Reset fields on student change
  setEvaluation(undefined);
  setNotes('');
  setSurahs([{ name: '', fromAya: '', toAya: '' }]);
  console.log(sessionId)
}, [studentId]);

  const handleAddSurah = () => {
    setSurahs([...surahs, { name: '', fromAya: '', toAya: '' }]);
  };

const handleSurahChange = (
  index: number,
  field: 'name' | 'fromAya' | 'toAya',
  value: string
) => {
  const updated = [...surahs];
  updated[index][field] = value;
  setSurahs(updated);
};

const handleSave = () => {
  const parsedSurahs = surahs
    .filter((s) => s.name.trim())
    .map((s) => ({
      name: s.name,
      fromAya: Number(s.fromAya),
      toAya: Number(s.toAya),
    }));

  const result = {
    studentId,
    sessionId,
    evaluation,
    isPresent,
    notes,
    surahs: parsedSurahs,
  };

  console.log('📦 Saved data:', result);
  if (route.params?.updateAttendance) {
    route.params.updateAttendance(result);
  }
  navigation.goBack();
};
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>التقييم</Text>
      {evaluationOptions.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.option,
            evaluation === opt && styles.selectedOption,
          ]}
          onPress={() => setEvaluation(opt)}
        >
          <Text style={evaluation === opt ? styles.selectedText : styles.optionText}>
            {opt}
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
      value={s.toAya}
      onChangeText={(text) => handleSurahChange(index, 'toAya', text)}
    />
     <TextInput
      placeholder="من آية"
      style={styles.input}
      keyboardType="numeric"
      value={s.fromAya}
      onChangeText={(text) => handleSurahChange(index, 'fromAya', text)}
    />
       <TextInput
      placeholder="اسم السورة"
      style={styles.input}
      value={s.name}
      onChangeText={(text) => handleSurahChange(index, 'name', text)}
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
