import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Edit, Trash2, Clock } from "lucide-react";
import dayjs from "dayjs";
import { TIME_FORMAT } from "@/utils/urls/frontend";
// import useColors from "@/utils/custom-hooks/use-colors";

export interface NoteData {
  id: string;
  time: string;
  category: string;
  priority: "Normal" | "High" | "Critical";
  patientId?: string;
  ward?: string;
  room?: string;
  bed?: string;
  documentedBy: string;
  [key: string]: any; // Allow additional fields
}

export interface NoteCardProps {
  note: NoteData;
  renderContent?: (note: NoteData) => React.ReactNode;
  onEdit?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showContext?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  renderContent,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  className = "",
  style = {},
  //   showContext = true,
}) => {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      //   case "Critical":
      //     return {
      //       border: "border-l-4 border-red-600 dark:border-red-600",
      //       bg: "bg-red-50 dark:bg-slate-800",
      //       badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      //       vitalsBox: "bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600",
      //       priorityText: "text-red-600 dark:text-red-400",
      //     };
      //   case "High":
      //     return {
      //       border: "border-l-4 border-orange-600 dark:border-orange-600",
      //       bg: "bg-orange-50 dark:bg-slate-800",
      //       badge:
      //         "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      //       vitalsBox: "bg-orange-100 dark:bg-orange-900/30 border-orange-500 dark:border-orange-600",
      //       priorityText: "text-orange-500 dark:text-orange-300",
      //     };
      default:
        return {
          border: "border-l-4 border-slate-500 dark:border-slate-600",
          bg: "bg-white dark:bg-slate-800",
          //   badge:
          //     "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
          vitalsBox:
            "bg-slate-100 dark:bg-slate-700/50 border border-2 border-slate-500 dark:border-slate-600",
          //   priorityText: "text-slate-600 dark:text-slate-400",
        };
    }
  };

  const styles = getPriorityStyles(note.priority);

  return (
    <View
      className={`${styles.bg} ${styles.border} rounded-lg shadow-sm  p-4 space-y-4 ${className}`}
      style={style}
    >
      {/* Metadata Row */}
      <View className="flex flex-wrap items-center justify-between gap-2">
        <View className="flex items-center gap-3 flex-wrap">
          <View className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            <Text className="text-sm font-medium">
              {note.datetime
                ? dayjs(note.datetime).format(`DD-MM-YYYY ${TIME_FORMAT}`)
                : "N/A"}
            </Text>
          </View>
          {/* <View className={`px-2 py-1 rounded text-xs font-semibold ${styles.badge}`}>
            {note.category}
          </View> */}
          {/* <View className="flex items-center gap-1">
            {note.priority !== "Normal" && (
              <AlertCircle className={`h-4 w-4 text ${styles.priorityText}`} />
            )}
            <Text className={`text-xs font-semibold ${styles.priorityText}`}>
              {note.priority}
            </Text>
          </View> */}
        </View>

        {/* Actions */}
        <View className="flex items-center gap-2">
          {canEdit && onEdit && (
            <Button
              variant="ghost"
              onPress={() => onEdit(note.id)}
              className="px-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {canDelete && onDelete && (
            <Button
              variant="ghost"
              onPress={() => onDelete(note.id)}
              className="px-2 text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </View>
      </View>

      {/* Context Row */}
      {/* {showContext && (note.patientId || note.ward || note.room || note.bed) && (
        <View className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
          {note.patientId && (
            <Text>
              <span className="font-semibold">Patient:</span> {note.patientId}
            </Text>
          )}
          {note.ward && (
            <Text>
              <span className="font-semibold">Ward:</span> {note.ward}
            </Text>
          )}
          {note.room && (
            <Text>
              <span className="font-semibold">Room:</span> {note.room}
            </Text>
          )}
          {note.bed && (
            <Text>
              <span className="font-semibold">Bed:</span> {note.bed}
            </Text>
          )}
        </View>
      )} */}

      {/* Content Section */}
      <View className="border-t border-slate-200 dark:border-slate-700 pt-4">
        {renderContent ? (
          renderContent(note)
        ) : (
          <Text className="text-sm text-slate-700 dark:text-slate-300">
            {note.content || "No content available"}
          </Text>
        )}
      </View>

      {/* Footer */}
      <View className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          Documented by {""}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {note.documentedBy}
          </span>
        </Text>
      </View>
    </View>
  );
};

export default NoteCard;
