import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import PatientInfoCard from "@/components/Notes Components/PatientInfoCard";
import CustomDateSelector from "@/components/Notes Components/CustomDateSelector";
import NoteCard, { NoteData } from "@/components/Notes Components/NoteCard";
import { Plus } from "lucide-react";
import dayjs from "dayjs";
import {
  DOCTOR_NOTES_ADD_URL,
  IPD_PATIENTS_DETAILS_URL,
  IPD_PATIENTS_URL,
} from "@/utils/urls/frontend";

// Mock data - replace with actual API calls
const mockPatientData = {
  name: "John Doe",
  age: 45,
  gender: "Male",
  ipdNumber: "IPD-2024-001",
  ward: "General Ward",
  room: "Room 101",
  bed: "Bed A",
  consultant: "Dr. Sarah Johnson",
};

const mockNotes: NoteData[] = [
  {
    id: "1",
    time: "10:30 AM",
    category: "Vitals",
    priority: "Normal",
    patientId: "IPD-2024-001",
    ward: "General Ward",
    room: "Room 101",
    bed: "Bed A",
    documentedBy: "Doc Mary Wilson",
    remark1: "Patient is stable",
    temperature: "98.6°F",
    bloodPressure: "120/80",
    pulse: "72 bpm",
    spo2: "98%",
    remark2: "Continue monitoring",
  },
  {
    id: "2",
    time: "02:15 PM",
    category: "Medication",
    priority: "High",
    patientId: "IPD-2024-001",
    ward: "General Ward",
    room: "Room 101",
    bed: "Bed A",
    documentedBy: "Doc Lisa Anderson",
    remark1: "Administered prescribed medication",
    content: "Paracetamol 500mg - Oral",
    remark2: "Patient tolerated well",
  },
  {
    id: "3",
    time: "06:45 PM",
    category: "Observation",
    priority: "Critical",
    patientId: "IPD-2024-001",
    ward: "General Ward",
    room: "Room 101",
    bed: "Bed A",
    documentedBy: "Doc Jennifer Taylor",
    remark1: "Patient complained of chest pain",
    content: "Immediate attention required. Doctor notified.",
    remark2: "Monitoring closely",
  },
];

const DoctorNotesPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<NoteData[]>(mockNotes);
  const [groupedNotes, setGroupedNotes] = useState<Record<string, NoteData[]>>(
    {}
  );

  useEffect(() => {
    // Group notes by date
    const grouped = notes.reduce((acc, note) => {
      const dateKey = dayjs(selectedDate).format("YYYY-MM-DD");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(note);
      return acc;
    }, {} as Record<string, NoteData[]>);
    setGroupedNotes(grouped);
  }, [notes, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // TODO: Fetch notes for selected date
  };

  const handleAddNote = () => {
    navigate(
      `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${DOCTOR_NOTES_ADD_URL}`
    );
  };

  const handleEditNote = (noteId: string) => {
    navigate(`/ipd/patients/${patientId}/nurse-notes/edit/${noteId}`);
  };

  const handleDeleteNote = (noteId: string) => {
    // TODO: Implement delete confirmation and API call
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const patientDetails = [
    { label: "Patient Name", value: mockPatientData.name },
    {
      label: "Age | Gender",
      value: `${mockPatientData.age} | ${mockPatientData.gender}`,
    },
    { label: "IPD Number", value: mockPatientData.ipdNumber },
    {
      label: "Ward | Room | Bed",
      value: `${mockPatientData.ward} | ${mockPatientData.room} | ${mockPatientData.bed}`,
    },
    { label: "Consultant", value: mockPatientData.consultant },
  ];

  return (
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 flex justify-center">
      <View className="w-full max-w-7xl space-y-6">
        {/* Page Header */}
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              className="text-2xl font-bold text-slate-900 dark:text-white flex gap-2"
            >
              Doctor Notes for Patient{" "}
              <Text as="h1" weight="font-semibold" className="text-primary">
                {mockPatientData.name}
              </Text>
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              IPD Number: {mockPatientData.ipdNumber}
            </Text>
          </View>
          <Button variant="outline" onPress={() => navigate(-1)}>
            Back
          </Button>
        </View>

        {/* Patient Information Card */}
        <PatientInfoCard
          title="Patient Information"
          patientDetails={patientDetails}
          columns={3}
        />

        {/* Notes Toolbar */}
        <View className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <View className="flex flex-wrap items-center justify-between gap-4">
            <CustomDateSelector
              value={selectedDate}
              onChange={handleDateChange}
              onConfirm={handleDateChange}
              label="Filter by Date"
              className="flex-1"
            />
            <Button onPress={handleAddNote} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Note
            </Button>
          </View>
        </View>

        {/* Notes List Grouped by Date */}
        <View className="space-y-6">
          {Object.entries(groupedNotes).map(([date, dateNotes]) => (
            <View key={date} className="space-y-4">
              {/* Date Header */}
              <View className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                  {dayjs(date).format("dddd, MMMM DD, YYYY")}
                </Text>
                <Text className="text-sm text-slate-600 dark:text-slate-400">
                  Total Notes: {dateNotes.length}
                </Text>
              </View>

              {/* Notes for this date */}
              <View className="space-y-4">
                {dateNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    renderContent={(note) => (
                      <View className="space-y-4">
                        {/* Remark 1 */}
                        {note.remark1 && (
                          <View>
                            <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Remark 1
                            </Text>
                            <Text className="text-sm text-slate-700 dark:text-slate-300">
                              {note.remark1}
                            </Text>
                          </View>
                        )}

                        {/* Vitals Section */}
                        {note.category === "Vitals" && (
                          <View
                            className={`p-4 rounded-lg border-2 ${
                              note.priority === "Critical"
                                ? "bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600"
                                : note.priority === "High"
                                ? "bg-orange-100 dark:bg-orange-900/30 border-orange-500 dark:border-orange-600"
                                : "bg-slate-100 dark:bg-slate-700/50 border-slate-500 dark:border-slate-600"
                            }`}
                          >
                            <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
                              Vitals
                            </Text>
                            <View className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {note.temperature && (
                                <View>
                                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                                    Temperature
                                  </Text>
                                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {note.temperature}
                                  </Text>
                                </View>
                              )}
                              {note.bloodPressure && (
                                <View>
                                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                                    Blood Pressure
                                  </Text>
                                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {note.bloodPressure}
                                  </Text>
                                </View>
                              )}
                              {note.pulse && (
                                <View>
                                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                                    Pulse
                                  </Text>
                                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {note.pulse}
                                  </Text>
                                </View>
                              )}
                              {note.spo2 && (
                                <View>
                                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                                    SpO₂
                                  </Text>
                                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {note.spo2}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        )}

                        {/* General Content */}
                        {note.content && (
                          <View>
                            <Text className="text-sm text-slate-700 dark:text-slate-300">
                              {note.content}
                            </Text>
                          </View>
                        )}

                        {/* Remark 2 */}
                        {note.remark2 && (
                          <View>
                            <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Remark 2
                            </Text>
                            <Text className="text-sm text-slate-700 dark:text-slate-300">
                              {note.remark2}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Empty State */}
          {Object.keys(groupedNotes).length === 0 && (
            <View className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <Text className="text-slate-500 dark:text-slate-400">
                No notes found for the selected date.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default DoctorNotesPage;
