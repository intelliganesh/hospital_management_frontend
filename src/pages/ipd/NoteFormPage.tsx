import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import { toast } from "@/components/ui/use-toast";
import dayjs from "dayjs";

interface NoteFormData {
  category: string;
  priority: string;
  remark1: string;
  temperature?: string;
  bloodPressure?: string;
  pulse?: string;
  spo2?: string;
  content?: string;
  remark2: string;
}

const NoteFormPage: React.FC = () => {
  const { patientId, noteId } = useParams<{
    patientId: string;
    noteId?: string;
  }>();
  const navigate = useNavigate();
  const isEditMode = !!noteId;

  const [formData, setFormData] = useState<NoteFormData>({
    category: "",
    priority: "Normal",
    remark1: "",
    temperature: "",
    bloodPressure: "",
    pulse: "",
    spo2: "",
    content: "",
    remark2: "",
  });

  const categoryOptions = [
    { label: "Vitals", value: "Vitals" },
    { label: "Medication", value: "Medication" },
    { label: "Observation", value: "Observation" },
    { label: "Treatment", value: "Treatment" },
    { label: "General", value: "General" },
  ];

  const priorityOptions = [
    { label: "Normal", value: "Normal" },
    { label: "High", value: "High" },
    { label: "Critical", value: "Critical" },
  ];

  useEffect(() => {
    if (isEditMode && noteId) {
      // TODO: Fetch note data by ID and populate form
      // For now, using mock data
      setFormData({
        category: "Vitals",
        priority: "Normal",
        remark1: "Patient is stable",
        temperature: "98.6",
        bloodPressure: "120/80",
        pulse: "72",
        spo2: "98",
        content: "",
        remark2: "Continue monitoring",
      });
    }
  }, [isEditMode, noteId]);

  const handleFieldChange = (field: keyof NoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (!formData.remark1) {
      toast({
        title: "Validation Error",
        description: "Please enter Remark 1",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement API call to save note
      console.log("Form Data:", formData);

      toast({
        title: "Success!",
        description: isEditMode
          ? "Note updated successfully"
          : "Note added successfully",
        variant: "success",
      });

      navigate(`/ipd/patients/${patientId}/nurse-notes`);
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to save note",
        variant: "destructive",
      });
    }
  };

  return (
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 flex justify-center">
      <View className="w-full max-w-4xl space-y-6">
        {/* Page Header */}
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              {isEditMode ? "Edit Nurse Note" : "Add Nurse Note"}
            </Text>
            <Text
              as="p"
              className="text-slate-600 dark:text-slate-400 text-sm"
            >
              {dayjs().format("dddd, MMMM DD, YYYY")}
            </Text>
          </View>
          <Button
            variant="outline"
            onPress={() => navigate(`/ipd/patients/${patientId}/nurse-notes`)}
          >
            Cancel
          </Button>
        </View>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <View className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
            {/* Basic Information Section */}
            {/* <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Basic Information
              </Text>
              <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SingleSelector
                  id="category"
                  name="category"
                  label="Category *"
                  value={formData.category}
                  onChange={(value) => handleFieldChange("category", value)}
                  options={categoryOptions}
                  placeholder="Select Category"
                />
                <SingleSelector
                  id="priority"
                  name="priority"
                  label="Priority *"
                  value={formData.priority}
                  onChange={(value) => handleFieldChange("priority", value)}
                  options={priorityOptions}
                  placeholder="Select Priority"
                />
              </View>
            </View> */}

            {/* Remark 1 */}
            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Remark 1
              </Text>
              <textarea
                id="remark1"
                name="remark1"
                value={formData.remark1}
                onChange={(e) => handleFieldChange("remark1", e.target.value)}
                placeholder="Enter initial remarks..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </View>

            {/* Vitals Section - Always visible */}
            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Vitals
              </Text>
              <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="temperature"
                    name="temperature"
                    label="Temperature (°F)"
                    type="text"
                    value={formData.temperature}
                    onChange={(e) =>
                      handleFieldChange("temperature", e.target.value)
                    }
                    placeholder="e.g., 98.6"
                  />
                  <Input
                    id="bloodPressure"
                    name="bloodPressure"
                    label="Blood Pressure"
                    type="text"
                    value={formData.bloodPressure}
                    onChange={(e) =>
                      handleFieldChange("bloodPressure", e.target.value)
                    }
                    placeholder="e.g., 120/80"
                  />
                  <Input
                    id="pulse"
                    name="pulse"
                    label="Pulse (bpm)"
                    type="text"
                    value={formData.pulse}
                    onChange={(e) => handleFieldChange("pulse", e.target.value)}
                    placeholder="e.g., 72"
                  />
                  <Input
                    id="spo2"
                    name="spo2"
                    label="SpO₂ (%)"
                    type="text"
                    value={formData.spo2}
                    onChange={(e) => handleFieldChange("spo2", e.target.value)}
                    placeholder="e.g., 98"
                  />
              </View>
            </View>

            {/* General Content - Show for non-Vitals categories */}
            {formData.category && formData.category !== "Vitals" && (
              <View>
                <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                  Content
                </Text>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={(e) => handleFieldChange("content", e.target.value)}
                  placeholder="Enter detailed content..."
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </View>
            )}

            {/* Remark 2 */}
            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Remark 2
              </Text>
              <textarea
                id="remark2"
                name="remark2"
                value={formData.remark2}
                onChange={(e) => handleFieldChange("remark2", e.target.value)}
                placeholder="Enter additional remarks..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </View>

            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Nurse
              </Text>
              <SingleSelector
                id="nurse"
                name="nurse"
                label="This Note document by"
                // value={formData.nurse}
                // onChange={(value) => handleFieldChange("nurse", value)}
                options={[]}
                placeholder="Select Nurse"
              />
            </View>

            {/* Form Actions */}
            <View className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onPress={() =>
                  navigate(`/ipd/patients/${patientId}/nurse-notes`)
                }
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update Note" : "Save Note"}
              </Button>
            </View>
          </View>
        </form>
      </View>
    </View>
  );
};

export default NoteFormPage;
