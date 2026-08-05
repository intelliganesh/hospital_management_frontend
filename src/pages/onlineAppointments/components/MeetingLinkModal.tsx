import React, { useState } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import Modal from "@/components/Modal";
import { OnlineAppointment } from "@/types/onlineAppointment.types";
import { useOnlineAppointments } from "@/actions/calls/onlineAppointments";
import { toast } from "@/utils/custom-hooks/use-toast";
import { Wand2, Link as LinkIcon, CheckCircle } from "lucide-react";

interface MeetingLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: OnlineAppointment | null;
  onSuccess?: () => void;
}

type Mode = "auto" | "manual";

const MeetingLinkModal: React.FC<MeetingLinkModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}) => {
  const { onlineAppointmentGenerateLinkHandler, onlineAppointmentEditHandler } =
    useOnlineAppointments();

  const [mode, setMode] = useState<Mode>("auto");
  const [generatedLink, setGeneratedLink] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setMode("auto");
    setGeneratedLink("");
    setManualLink("");
    onClose();
  };

  const handleGenerate = async () => {
    if (!appointment) return;
    setIsGenerating(true);
    await onlineAppointmentGenerateLinkHandler(
      appointment.id,
      (success, data) => {
        if (success) {
          const link =
            (data as any)?.meeting_link ||
            (typeof data === "string" ? data : "");
          console.log("extracted link:", link);

          if (link) {
            setGeneratedLink(link);
            toast({
              title: "Link Generated and Sent!",
              description: "Meeting link generated and sent successfully.",
              variant: "success",
            });
            onSuccess?.();
            handleClose();
          } else {
            toast({
              title: "Error",
              description: "No link found in response.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to generate meeting link.",
            variant: "destructive",
          });
        }
        setIsGenerating(false);
      },
    );
  };

  const handleSubmit = async () => {
    if (!appointment) return;

    if (mode === "auto") {
      // Link is already saved by the generate API — just close and refresh
      onSuccess?.();
      handleClose();
      return;
    }

    // Manual mode — save via edit handler
    if (!manualLink.trim()) return;
    setIsSubmitting(true);
    await onlineAppointmentEditHandler(
      appointment.id,
      { meeting_link: manualLink.trim(), meeting_link_type: "manual" },
      (success) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Meeting link saved successfully.",
            variant: "success",
          });
          onSuccess?.();
          handleClose();
        } else {
          toast({
            title: "Error",
            description: "Failed to save meeting link.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      },
    );
  };

  const isSubmitDisabled =
    isSubmitting ||
    isGenerating ||
    (mode === "auto" && !generatedLink) ||
    (mode === "manual" && !manualLink.trim());

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Set Meeting Link"
      description="Auto-generate a meeting link or paste one manually."
      size="md"
      footer={
        mode === "manual" ? (
          <View className="flex justify-end gap-3 w-full">
            <Button
              variant="outline"
              onPress={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitDisabled}
              className="gap-2 flex flex-row items-center bg-primary hover:bg-primary/90 border-none text-white font-semibold h-10 px-5"
            >
              <CheckCircle size={16} /> Save Link
            </Button>
          </View>
        ) : undefined
      }
    >
      <View className="space-y-5">
        {/* Mode Selector */}
        <View className="grid grid-cols-2 gap-3">
          <View
            onClick={() => setMode("auto")}
            className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col gap-2 transition-all ${
              mode === "auto"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <View className="flex items-center gap-2">
              <Wand2
                size={18}
                className={mode === "auto" ? "text-primary" : "text-slate-400"}
              />
              <Text
                className={`font-semibold ${mode === "auto" ? "text-primary" : "text-slate-600"}`}
              >
                Auto Generate
              </Text>
            </View>
            <Text className="text-sm text-muted-foreground leading-snug">
              Generate a unique meeting link automatically via the system.
            </Text>
          </View>

          <View
            onClick={() => setMode("manual")}
            className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col gap-2 transition-all ${
              mode === "manual"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <View className="flex items-center gap-2">
              <LinkIcon
                size={18}
                className={
                  mode === "manual" ? "text-primary" : "text-slate-400"
                }
              />
              <Text
                className={`font-semibold ${mode === "manual" ? "text-primary" : "text-slate-600"}`}
              >
                Manual Entry
              </Text>
            </View>
            <Text className="text-sm text-muted-foreground leading-snug">
              Paste a Google Meet, Zoom, or any custom meeting link.
            </Text>
          </View>
        </View>

        {/* Auto Generate Section */}
        {mode === "auto" && (
          <View className="space-y-3 animate-in fade-in slide-in-from-top-1">
            <Button
              onPress={handleGenerate}
              loading={isGenerating}
              disabled={isGenerating}
              className="gap-2 flex flex-row items-center w-full justify-center border border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 font-semibold h-10"
              variant="outline"
            >
              <Wand2 size={15} />
              {isGenerating ? "Generating..." : "Generate and Send Link"}
            </Button>

            {/* {generatedLink && (
              <View className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                <Text className="text-[11px] font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-green-500" />
                  Generated Link
                </Text>
                <Input
                  value={generatedLink}
                  disabled
                  className="h-10 text-sm font-medium text-primary bg-muted border-border cursor-default"
                />
              </View>
            )} */}

            {!generatedLink && !isGenerating && (
              <Text className="text-sm text-amber-600 font-medium flex items-center gap-1">
                ⚠️ Click "Generate and Send Link" to create the meeting link.
              </Text>
            )}
          </View>
        )}

        {/* Manual Entry Section */}
        {mode === "manual" && (
          <View className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
            <Text className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
              <LinkIcon size={11} className="text-primary" />
              Meeting / Consultation Link
            </Text>
            <Input
              value={manualLink}
              onChange={(e) => setManualLink(e.target.value)}
              placeholder="e.g. https://meet.google.com/abc-defg-hij"
              className="h-10 text-sm border-border focus:ring-2 focus:ring-primary/20 bg-background font-medium text-primary"
            />
            {!manualLink.trim() && (
              <Text className="text-sm text-amber-600 font-semibold flex items-center gap-1">
                ⚠️ Link is required to save.
              </Text>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default MeetingLinkModal;
