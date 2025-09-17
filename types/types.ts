
export interface StudentAttendance {
    _id: string; // هذا هو Attendance ID
    student: {
        _id: string; // Student ID
        name: string;
        // أي بيانات إضافية للطالب تحب تعرضها
        age?: number;
        phone?: string;
        sessions?: string[];
        lastAttendance?: string;
    };
    isPresent: boolean;
    evaluation?: "ممتاز" | "جيد جدًا" | "جيد" | "ضعيف";
    surahs?: { name: string; fromAya: number; toAya: number }[];
    notes?: string;
}
