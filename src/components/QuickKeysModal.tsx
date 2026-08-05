import React from "react";
import { X, Command, Keyboard } from "lucide-react";
import Text from "./text";
import Button from "./button";
import View from "./view";

interface QuickKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: "Alt + P", description: "Go to Patients" },
  { key: "Alt + A", description: "Go to Appointments" },
  { key: "Alt + H", description: "Go to Dashboard" },
  { key: "Alt + N", description: "New Appointment" },
  { key: "Shift + ?", description: "Show this Help" },
  { key: "Esc", description: "Close Modal" },
];

const QuickKeysModal: React.FC<QuickKeysModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200">
      <div className="w-full max-w-md scale-100 transform overflow-hidden rounded-2xl bg-white dark:bg-card p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 dark:border-slate-700">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Keyboard className="h-6 w-6" />
            <Text as="h3" className="text-xl font-bold">
              Keyboard Shortcuts
            </Text>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-2"
          >
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-3">
          {SHORTCUTS.map((shortcut) => (
            <View
              key={shortcut.key}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <Text className="font-medium text-slate-600 dark:text-slate-300">
                {shortcut.description}
              </Text>
              <div className="flex items-center gap-1">
                {shortcut.key.split(" ").map((key, index) => (
                  <React.Fragment key={index}>
                    {key !== "+" && (
                      <kbd className="min-w-[1.5rem] rounded-md border border-slate-200 bg-white px-2 py-1 text-center text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                        {key}
                      </kbd>
                    )}
                    {key === "+" && (
                      <span className="text-slate-400 dark:text-slate-600">
                        +
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </View>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <Command className="h-3 w-3" />
          <span>Pro tip: Use shortcuts to navigate faster</span>
        </div>
      </div>
    </div>
  );
};

export default QuickKeysModal;
