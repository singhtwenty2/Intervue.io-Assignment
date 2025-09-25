import { Users, UserX, Wifi, WifiOff } from "lucide-react";
import React from "react";
import type { Student } from "../../types";
import { Button } from "../common/Button";

interface StudentListProps {
    students: Student[];
    onRemoveStudent: (studentName: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
    students,
    onRemoveStudent,
}) => {
    const connectedStudents = students.filter((s) => s.isConnected);
    const disconnectedStudents = students.filter((s) => !s.isConnected);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users size={20} className="mr-2" />
                    Students ({students.length})
                </h3>
            </div>

            {students.length === 0 ? (
                <div className="text-center py-8">
                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No students have joined yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Share your poll ID to get started
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {connectedStudents.map((student) => (
                        <div
                            key={student.name}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <Wifi
                                        size={14}
                                        className="text-green-500"
                                    />
                                    <span className="font-medium">
                                        {student.name}
                                    </span>
                                </div>
                                {student.hasAnswered && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        Answered
                                    </span>
                                )}
                            </div>

                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => onRemoveStudent(student.name)}
                            >
                                <UserX size={14} />
                            </Button>
                        </div>
                    ))}

                    {disconnectedStudents.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                <WifiOff size={14} className="mr-1" />
                                Disconnected ({disconnectedStudents.length})
                            </h4>
                            {disconnectedStudents.map((student) => (
                                <div
                                    key={student.name}
                                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                            <WifiOff
                                                size={14}
                                                className="text-red-400"
                                            />
                                            <span className="font-medium text-gray-600">
                                                {student.name}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() =>
                                            onRemoveStudent(student.name)
                                        }
                                    >
                                        <UserX size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
