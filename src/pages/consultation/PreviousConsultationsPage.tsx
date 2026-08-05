import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/button";
import View from "@/components/view";
import Text from "@/components/text";
import BouncingLoader from "@/components/BouncingLoader";
import { useConsultation } from "@/actions/calls/consultation";
import { LoadingStatus } from "@/interfaces";
import {
  CONSULTATION_EDIT_URL,
  CONSULTATION_TABLE_URL,
} from "@/utils/urls/frontend";

interface ConsultationDateItem {
  appointment_date: string;
  appointment_time: string;
  appointment_id: string;
  appointment_number?: string;
}

interface ReportPreview {
  html?: string;
  url?: string;
}

const PreviousConsultationsPage: React.FC = () => {
  const { patientId: patientIdParam, consultationId } = useParams<{
    patientId: string;
    consultationId: string;
  }>();
  const navigate = useNavigate();
  const patientId = patientIdParam || "";
  const {
    consultationDatesHandler,
    consultationReportPreviewHandler,
    cleanUp,
  } = useConsultation();

  const [consultations, setConsultations] = useState<ConsultationDateItem[]>(
    [],
  );
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [reportPreview, setReportPreview] = useState<ReportPreview | null>(
    null,
  );
  const [datesLoading, setDatesLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [, setDatesError] = useState(false);
  const [reportError, setReportError] = useState(false);

  const sortedConsultations = useMemo(
    () =>
      [...consultations].sort((a, b) =>
        dayjs(`${b.appointment_date} ${b.appointment_time}`).diff(
          dayjs(`${a.appointment_date} ${a.appointment_time}`),
        ),
      ),
    [consultations],
  );

  const selectedConsultation = sortedConsultations.find(
    (item) => item.appointment_id === selectedAppointmentId,
  );

  useEffect(() => {
    if (!patientId) {
      setDatesLoading(false);
      setDatesError(true);
      return;
    }

    consultationDatesHandler(
      patientId,
      (success, data) => {
        if (success) {
          const dates = (data as any)?.dates || [];
          setConsultations(dates);
          setDatesError(false);
        } else {
          setDatesError(true);
        }
      },
      (status: LoadingStatus) => {
        setDatesLoading(status === "pending");
      },
    );

    return () => {
      cleanUp();
    };
  }, [patientId]);

  useEffect(() => {
    if (!selectedAppointmentId && sortedConsultations[0]?.appointment_id) {
      setSelectedAppointmentId(sortedConsultations[0].appointment_id);
    }
  }, [selectedAppointmentId, sortedConsultations]);

  useEffect(() => {
    if (!selectedAppointmentId) return;

    setReportLoading(true);
    setReportError(false);
    setReportPreview(null);

    consultationReportPreviewHandler(selectedAppointmentId, (success, data) => {
      console.log("Report preview response:", success, data);
      console.log(data?.data.html.includes("<script"), "scriprt");
      const preview = data?.data as ReportPreview | undefined;
      console.log("Preview:", preview);
      if (success && (preview?.html || preview?.url)) {
        setReportPreview(preview);
      } else {
        setReportError(true);
      }
      setReportLoading(false);
    });
  }, [selectedAppointmentId]);

  const formatConsultationDate = (item: ConsultationDateItem) =>
    dayjs(`${item.appointment_date} ${item.appointment_time}`).format(
      "DD MMM YYYY [·] hh:mm A",
    );

  const reportSrcDoc = reportPreview?.html
    ? `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body {
        margin: 0;
        min-height: 100%;
        background: #f8fafc;
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
      }
      .preview-shell {
        width: min(100%, 920px);
        min-height: 100vh;
        margin: 0 auto;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
      }
      @media print {
        body { background: #ffffff; }
        .preview-shell { width: 100%; box-shadow: none; }
      }
    </style>
  </head>
  <body>
    <main class="preview-shell">${reportPreview.html}</main>
  </body>
</html>`
    : "";

  return (
    <View className="container mx-auto px-4 py-6 md:px-6 md:py-8 space-y-6">
      <View className="fixed top-4 left-0 w-full z-50">
        <BouncingLoader isLoading={datesLoading || reportLoading} />
      </View>

      <View className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <View>
          <View className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-10 w-10 p-0"
              onPress={() => navigate(-1)}
              title="Go back"
            >
              <ArrowLeft size={18} />
            </Button>
            <View>
              <Text as="h1" className="text-2xl font-bold text-slate-900">
                Previous Consultations
              </Text>
              <Text className="text-sm text-muted-foreground">
                Review consultation reports for this patient.
              </Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            disabled={!consultationId}
            onPress={() =>
              consultationId &&
              navigate(
                `${CONSULTATION_TABLE_URL}${CONSULTATION_EDIT_URL}/${consultationId}`,
              )
            }
          >
            Edit Latest Consultation
          </Button>
          <Button variant="outline" onPress={() => navigate(-1)}>
            Back
          </Button>
        </View>
      </View>

      <View className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar size={18} className="text-primary" />
              Consultation Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {datesLoading ? (
              <View className="p-6 text-sm text-muted-foreground">
                Loading consultations...
              </View>
            ) : // ) : datesError ? (
            //   <View className="p-6 text-sm text-red-600">
            //     Unable to load previous consultations.
            //   </View>
            sortedConsultations.length === 0 ? (
              <View className="p-6 text-sm text-muted-foreground">
                No previous consultations found.
              </View>
            ) : (
              <View className="max-h-[320px] overflow-y-auto lg:max-h-[calc(100vh-260px)]">
                {sortedConsultations.map((item) => {
                  const isActive =
                    item.appointment_id === selectedAppointmentId;

                  return (
                    <button
                      key={item.appointment_id}
                      type="button"
                      aria-expanded={isActive}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() =>
                        setSelectedAppointmentId(item.appointment_id)
                      }
                      className={`w-full border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 ${
                        isActive
                          ? "bg-primary-50 text-primary border-l-4 border-l-primary shadow-sm"
                          : "bg-card hover:bg-primary-50/60"
                      }`}
                    >
                      <Text className="text-sm font-semibold">
                        {formatConsultationDate(item)}
                      </Text>
                      <Text className="mt-1 text-xs text-muted-foreground">
                        Appointment {item.appointment_number || "N/A"}
                      </Text>
                    </button>
                  );
                })}
              </View>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[620px] overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText size={18} className="text-primary" />
              Consultation Report Preview
            </CardTitle>
            {selectedConsultation && (
              <Text className="text-sm text-muted-foreground">
                {formatConsultationDate(selectedConsultation)}
              </Text>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {reportLoading ? (
              <View className="flex min-h-[480px] items-center justify-center text-sm text-muted-foreground">
                Loading report preview...
              </View>
            ) : reportError ? (
              <View className="flex min-h-[480px] flex-col items-center justify-center gap-2 text-center">
                <FileText size={36} className="text-slate-300" />
                <Text className="font-semibold text-slate-700">
                  Report preview unavailable
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Select another consultation or try again later.
                </Text>
              </View>
            ) : reportPreview?.html ? (
              <iframe
                title="Consultation report preview"
                srcDoc={reportSrcDoc}
                sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                className="h-[78vh] min-h-[620px] w-full bg-slate-50"
              />
            ) : reportPreview?.url ? (
              <iframe
                title="Consultation report preview"
                src={reportPreview.url}
                sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                className="h-[78vh] min-h-[620px] w-full bg-slate-50"
              />
            ) : (
              <View className="flex min-h-[480px] items-center justify-center text-sm text-muted-foreground">
                Select a consultation to preview the report.
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </View>
  );
};

export default PreviousConsultationsPage;
