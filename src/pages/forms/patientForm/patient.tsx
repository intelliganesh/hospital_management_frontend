import Text from "@/components/text";
import View from "@/components/view";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import SectionFour from "./SectionFour";
import Button from "@/components/button";
import SectionThree from "./SectionThree";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { validationSchema } from "./validationForm";
import { usePatient } from "@/actions/calls/patient";
import { useDispatch, useSelector } from "react-redux";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useNavigate, useParams } from "react-router-dom";
import { PatientInterface } from "@/interfaces/patients/index";
import { clearPatientDetailsSlice } from "@/actions/slices/patient";
import { PATIENT_DETAIL_URL } from "@/utils/urls/frontend";
import useForm from "@/utils/custom-hooks/use-form";
import { imageUpload } from "@/actions/calls/uesImage";
import { LoadingStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";
import dayjs from "dayjs";
import FileUploader from "./FileUploader";
import Modal from "@/components/Modal";

const PatientAdmissionForm: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
  patientId,
  iAmIn = "patient"
}) => {
  const { id } = useParams();
  const activePatientId = patientId || id;
  // console.log(id, "ID");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.authentication.tokenStatus);
  const {
    cleanUp,
    patientDetailHandler,
    editPatientHandler,
    addPatientHandler,
  } = usePatient();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pendingFormObj, setPendingFormObj] =
    useState<Partial<PatientInterface> | null>(null);
  const [originalCoreFields, setOriginalCoreFields] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_no?: string;
  }>({});

  useEffect(() => {
    if (formType === "add") {
      dispatch(clearPatientDetailsSlice()); // start fresh for new patient
    }
  }, [formType, dispatch]);

  useEffect(() => {
    if (formType === "edit" && activePatientId ) {
      // iAmIn === "ipdModal" && dispatch(clearPatientDetailsSlice());
      patientDetailHandler(
        activePatientId,
        () => {},
        [],
        (status: LoadingStatus) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
              ? true
              : status === "success" && false
          );
        }
      );
    }
    return () => {
      cleanUp();
      iAmIn === "patient" && dispatch(clearPatientDetailsSlice());
    };
  }, [activePatientId, formType]);

  // useEffect(() => {
  //   return () => {
  //     cleanUp();
  //     dispatch(clearPatientDetailsSlice());
  //   };
  // }, [dispatch, cleanUp]);
  const patientDetailData = useSelector(
    (state: any) => state.patient.patientDetailData
  );
  const patientDetail =
    formType === "add" ? {} : { ...patientDetailData, id_edited: true };
  const { values: formValues, onSetHandler } =
    useForm<PatientInterface>(patientDetail);

  useEffect(() => {
    if (formType === "edit" && patientDetailData) {
      setOriginalCoreFields({
        first_name: patientDetailData?.first_name ?? "",
        last_name: patientDetailData?.last_name ?? "",
        email: patientDetailData?.email ?? "",
        phone_no: patientDetailData?.phone_no ?? "",
      });
    }
  }, [formType, patientDetailData]);

  const hasCoreFieldChanged = (
    original: typeof originalCoreFields,
    current: Partial<PatientInterface>
  ) => {
    return (
      original.first_name !== current.first_name ||
      original.last_name !== current.last_name ||
      original.email !== current.email ||
      original.phone_no !== current.phone_no
    );
  };

  // Small helper to convert callback-based imageUpload to a Promise
  const uploadAsync = (payload: any) =>
    new Promise<boolean>((resolve) => {
      imageUpload(payload, (success: boolean) => resolve(success));
    });

  const proceedUpdate = (applyForAll: boolean) => {
    if (!pendingFormObj || !activePatientId) return;

    const payload = {
      ...pendingFormObj,
      update_patient_info: applyForAll, // ✅ REQUIRED FIELD
    };

    setShowUpdateModal(false);
    setIsSubmitting(true);

    editPatientHandler(activePatientId, payload, async (success: boolean, response: any) => {
      setIsSubmitting(false);

      if (success) {
        toast({
          title: "Success!",
          description: "Patient updated successfully.",
          variant: "success",
        });

        // 🔁 Existing upload logic (UNCHANGED)
        const IdProof = response?.data?.id;
        const attendantIdProof = response?.data?.attendant_id;
        const patientDocId = response?.data?.patient_id;

        if (patientDocId && formValues?.patient_document) {
          const docs =
            typeof formValues.patient_document === "string"
              ? formValues.patient_document
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              : formValues.patient_document;

          const docUploadPayload = {
            id: patientDocId,
            modal_type: "patient_documents",
            file_name: "document_path",
            folder_name: "patient_documents",
            image: docs.filter((x: any) => x instanceof File),
            oldImage: docs.filter((x: any) => typeof x === "string"),
          };

          await uploadAsync(docUploadPayload);
        }

        if (IdProof && formValues?.image) {
          await uploadAsync({
            id: response?.data?.id,
            modal_type: "patient_address_proof",
            file_name: "image",
            folder_name: "patient_address_image",
            image: formValues.image,
          });
        }

        if (attendantIdProof && formValues?.attendant_image) {
          await uploadAsync({
            id: response?.data?.attendant_id,
            modal_type: "patient_attendant_address_proof",
            file_name: "image",
            folder_name: "patient_attendant_address_image",
            image: formValues.attendant_image,
          });
        }

        if (onModalSuccess) {
          onModalSuccess();
        } else {
          navigate(-1);
        }
      }
    });
  };

  const proceedDirectUpdate = (payload: Partial<PatientInterface>) => {
  if (!activePatientId) return;

  setIsSubmitting(true);

  editPatientHandler(activePatientId, payload, async (success: boolean) => {
    setIsSubmitting(false);

    if (success) {
      toast({
        title: "Success!",
        description: "Patient updated successfully.",
        variant: "success",
      });

      if (onModalSuccess) {
        onModalSuccess();
      } else {
        navigate(-1);
      }
    }
  });
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let patientFormObj: Partial<PatientInterface> = {};

    for (let [key, value] of formData.entries()) {
      patientFormObj[key as keyof PatientInterface] = value as any;
    }
    if (formValues?.created_at) {
      // user may have changed the date in form
      const newDate = formData.get("created_at") as string; // YYYY-MM-DD

      if (newDate) {
        // take today's current time
        const currentTime = dayjs().format("HH:mm:ss");
        patientFormObj.created_at = `${newDate} ${currentTime}`;
      } else {
        // fallback if somehow no date came
        patientFormObj.created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      // If new, capture current datetime
      patientFormObj.created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
    }

    patientFormObj["consent"] =
      patientFormObj["consent" as keyof PatientInterface] === "true" ||
      patientFormObj["consent" as keyof PatientInterface] === "1"
        ? true
        : false;
    patientFormObj["attendant_consent"] =
      patientFormObj["attendant_consent" as keyof PatientInterface] ===
        "true" ||
      patientFormObj["attendant_consent" as keyof PatientInterface] === "1"
        ? true
        : false;
    const countryCode =
      patientFormObj["countryContactCode" as keyof PatientInterface] || "";
    const phoneNumber =
      patientFormObj["phone_no" as keyof PatientInterface] || "";
    patientFormObj["phone_no"] = `${countryCode} ${phoneNumber}`;

    const attendantCode =
      patientFormObj["attendantCountryContactCode" as keyof PatientInterface] ||
      "";
    const attendantPhone =
      patientFormObj[
        "attendant_with_patient_phone_no" as keyof PatientInterface
      ] || "";
    patientFormObj[
      "attendant_with_patient_phone_no"
    ] = `${attendantCode} ${attendantPhone}`;

    patientFormObj["image"] = formValues?.image;
    patientFormObj["patient_document"] = formValues?.patient_document;
    patientFormObj["attendant_image"] = formValues?.attendant_image;
    patientFormObj["id_edited"] =
      formValues?.id_value?.includes("X") && formValues?.id_value?.includes("x")
        ? false
        : formValues?.id_edited;

    patientFormObj["attendant_id_edited"] =
      formValues?.attendant_id_value?.includes("X") ||
      formValues?.attendant_id_value?.includes("x")
        ? false
        : formValues?.attendant_id_edited;

    try {
      await validationSchema.validate(patientFormObj, { abortEarly: false });
      setFormErrors({});
      setIsSubmitting(true);
      delete patientFormObj["image"];
      delete patientFormObj["patient_document"];
      delete patientFormObj["attendant_image"];
      delete patientFormObj["countryContactCode"];
      if (formType === "add") {
        // Add new patient
        addPatientHandler(
          patientFormObj,
          async (success: boolean, response: any) => {
            if (success) {
              navigate(PATIENT_DETAIL_URL + "/" + response?.data?.patient_id);

              toast({
                title: "Success!",
                description: "Patient registration submitted successfully.",
                variant: "success",
              });
              const IdProof = response?.data?.id;
              const attendantIdProof = response?.data?.attendant_id;
              const patientId = response?.data?.patient_id;

              if (patientId) {
                // 1️⃣ Upload Patient Documents (if any)
                if (formValues?.patient_document) {
                  const docs =
                    typeof formValues.patient_document === "string"
                      ? formValues.patient_document
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean)
                      : formValues.patient_document;

                  const docUploadPayload = {
                    id: patientId,
                    modal_type: "patient_documents",
                    file_name: "document_path",
                    folder_name: "patient_documents",

                    image: docs.filter((x: any) => x instanceof File),
                    oldImage: docs.filter((x: any) => typeof x === "string"),
                  };

                  const docSuccess = await uploadAsync(docUploadPayload);
                  if (docSuccess) {
                    toast({
                      title: "Success!",
                      description: "Documents uploaded successfully",
                      variant: "success",
                    });
                  }
                }
              }
              // 2️⃣ Upload Address Proof (if any)
              if (IdProof && formValues?.image) {
                const addrUploadPayload = {
                  id: response?.data?.id,
                  modal_type: "patient_address_proof",
                  file_name: "image",
                  folder_name: "patient_address_image",
                  image: formValues.image,
                };

                const addrSuccess = await uploadAsync(addrUploadPayload);

                if (addrSuccess) {
                  toast({
                    title: "Success!",
                    description: "Address proof uploaded successfully",
                    variant: "success",
                  });
                }
              }

              // 3) Attendant Address Proof Upload (only if attendant uploaded)
              if (attendantIdProof && formValues?.attendant_image) {
                const attAddrUploadPayload = {
                  id: response?.data?.attendant_id,
                  modal_type: "patient_attendant_address_proof",
                  file_name: "image",
                  folder_name: "patient_attendant_address_image",
                  image: formValues.attendant_image,
                };

                const attSuccess = await uploadAsync(attAddrUploadPayload);

                if (attSuccess) {
                  toast({
                    title: "Success!",
                    description:
                      "Attendant address proof uploaded successfully",
                    variant: "success",
                  });
                }
              }
              await patientDetailHandler(patientId, () => {});
            } else {
              setIsSubmitting(false);
              // toast({
              //   title: "Error!",
              //   description: response?.message || "Registration failed",
              //   variant: "destructive",
              // });
            }
          }
        );
      } else if (activePatientId) {
        // Edit existing patient
        // editPatientHandler(
        //   id,
        //   patientFormObj,
        //   async (success: boolean, response: any) => {
        //     if (success) {
        //       setIsSubmitting(false);
        //       toast({
        //         title: "Success!",
        //         description: "Patient updated successfully.",
        //         variant: "success",
        //       });
        //       const IdProof = response?.data?.id;
        //       const attendantIdProof = response?.data?.attendant_id;
        //       const patientDocId = response?.data?.patient_id;

        //       if (patientDocId) {
        //         // 1️⃣ Patient Documents
        //         if (formValues?.patient_document) {
        //           const docs =
        //             typeof formValues.patient_document === "string"
        //               ? formValues.patient_document
        //                   .split(",")
        //                   .map((x) => x.trim())
        //                   .filter(Boolean)
        //               : formValues.patient_document;

        //           const docUploadPayload = {
        //             id: patientDocId,
        //             modal_type: "patient_documents",
        //             file_name: "document_path",
        //             folder_name: "patient_documents",

        //             image: docs.filter((x: any) => x instanceof File),
        //             oldImage: docs.filter((x: any) => typeof x === "string"),
        //           };

        //           await uploadAsync(docUploadPayload);
        //         }
        //       }
        //       if (IdProof && formValues?.image) {
        //         const addrUploadPayload = {
        //           id: response?.data?.id,
        //           modal_type: "patient_address_proof",
        //           file_name: "image",
        //           folder_name: "patient_address_image",
        //           image: formValues.image,
        //         };

        //         const addrSuccess = await uploadAsync(addrUploadPayload);

        //         if (addrSuccess) {
        //           toast({
        //             title: "Success!",
        //             description: "Address proof uploaded successfully",
        //             variant: "success",
        //           });
        //         }
        //       }

        //       // 3) Attendant Address Proof Upload (only if attendant uploaded)
        //       if (attendantIdProof && formValues?.attendant_image) {
        //         const attAddrUploadPayload = {
        //           id: response?.data?.attendant_id,
        //           modal_type: "patient_attendant_address_proof",
        //           file_name: "image",
        //           folder_name: "patient_attendant_address_image",
        //           image: formValues.attendant_image,
        //         };

        //         const attSuccess = await uploadAsync(attAddrUploadPayload);

        //         if (attSuccess) {
        //           toast({
        //             title: "Success!",
        //             description:
        //               "Attendant address proof uploaded successfully",
        //             variant: "success",
        //           });
        //         }
        //       }

        //       navigate(-1);
        //     } else {
        //       setIsSubmitting(false);
        //       // toast({
        //       //   title: "Error!",
        //       //   description: response?.message || "Update failed",
        //       //   variant: "destructive",
        //       // });
        //     }
        //   }
        // );
        const isCoreChanged = hasCoreFieldChanged(
          originalCoreFields,
          patientFormObj
        );

        if (isCoreChanged) {
          // 🔔 Show modal only if core fields changed
          setIsSubmitting(false);
          setPendingFormObj(patientFormObj);
          setShowUpdateModal(true);
        } else {
          // 🚀 Direct submit (no popup)
          proceedDirectUpdate(patientFormObj);
        }
      } else {
        setIsSubmitting(false);
        toast({
          title: "Error!",
          description: "Patient ID is missing. Please reopen the edit form.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      if (err.inner) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          if (e.path) errors[e.path] = e.message;
        });
        setFormErrors(errors);

        formSubmissionFailMessage();
      }
    }
  };

  return (
    <>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Confirm Update"
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        description="Do you want these changes to apply for all the occurrences?"
      >
        <View className="flex justify-end gap-2">
          <Button variant="outline" onPress={() => proceedUpdate(false)}>
            No
          </Button>
          <Button variant="primary" onPress={() => proceedUpdate(true)}>
            Yes
          </Button>
        </View>
      </Modal>

      <View className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4">
        {/* Form View */}
        <View className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 w-full max-w-4xl p-6 md:p-8 mb-8">
          <View className="flex items-center justify-between mb-6">
            <View>
              <Text
                as="h2"
                weight="font-bold"
                className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
              >
                {formType === "add" ? "New Patient" : "Edit Patient"}
              </Text>
              <Text
                as="p"
                className="text-slate-600 dark:text-slate-400 text-sm"
              >
                Fill in the Patient details
              </Text>
            </View>
            {
              !onModalSuccess && (
                <Button
              onPress={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              Back
            </Button>
              )
            }
          </View>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <View className="space-y-4">
              <Text
                as="h3"
                className="text-lg border-b pb-2 mb-4"
                weight="font-bold"
              >
                Personal Information
              </Text>
              <SectionOne
                errorDOB={formErrors.dob}
                errorAge={formErrors.age}
                errorEmail={formErrors.email}
                errorPhoneNo={formErrors.phone_no}
                errorsGender={formErrors.gender}
                errorLastName={formErrors.last_name}
                errorFirstName={formErrors.first_name}
                errorMaritalStatus={formErrors.marital_status}
                errorsIdValue={formErrors.id_value}
                errorConsent={formErrors.consent}
                errorsRefferdBy={formErrors.referred_by_name}
                errorsAttendantIdProofForPan={
                  formErrors.attendant_id_proof_for_pan
                }
                errorsAttendantIdValue={formErrors.attendant_id_value}
                errorAttendantConsent={formErrors.attendant_consent}
                // errorImage={formErrors.image}
                errorsIdProofForPan={formErrors.id_proof_for_pan}
                errorAttendantWithPatientName={
                  formErrors.attendant_with_patient_name
                }
                errorAttendantWithPatientPhoneNo={
                  formErrors.attendant_with_patient_phone_no
                }
                setImage={onSetHandler}
                formType={formType}
              />
            </View>

            {/* Address Information Section */}
            <View className="space-y-4">
              <Text
                as="h3"
                className="text-lg font-bold border-b pb-2 mb-4"
                weight="font-bold"
              >
                Address Information
              </Text>
              <SectionTwo
                formType={formType}
                errorsCity={formErrors.city}
                errorsState={formErrors.state}
                errorsAddress={formErrors.address}
                errorsPinCode={formErrors.pincode}
                errorsCountry={formErrors.country}
                // errorAmountFor={formErrors.amount_for}
                // errorEnroleFees={formErrors.enroll_fees}
                // errorPaymentType={formErrors.payment_type}
              />
            </View>

            {/* Medical Information Section */}
            <View className="space-y-4">
              <Text
                as="h3"
                className="text-lg font-bold border-b pb-2 mb-4"
                weight="font-bold"
              >
                Medical Information
              </Text>
              <SectionThree
                errorBloodGroup={formErrors.blood_group}
                // errorRefferedBy={formErrors.referred_by}
                // errorReferredTo={formErrors.referred_to}
                errorInsuranceProvider={formErrors.insurance_provider}
                errorInsurancePolicyNo={formErrors.insurance_policy_no}
                // errorReferredByName={formErrors.referred_by_name}
                // errorReferredByPhoneNo={formErrors.referred_by_phone_no}
                // errorReferredByEmail={formErrors.referred_by_email}
                // errorReferredByHospitalName={
                //   formErrors.referred_by_hospital_name
                // }
                // errorRefferedByPhoneNo={formErrors.referred_by_phone_no}
              />
              <FileUploader
                name="patient_document"
                label="Upload Patient Documents"
                existingFiles={
                  formValues?.patient_document
                    ? Array.isArray(formValues.patient_document)
                      ? formValues.patient_document
                          .filter((x) => typeof x === "string") // Only pass URL strings
                          .join(",")
                      : typeof formValues.patient_document === "string"
                      ? formValues.patient_document
                      : ""
                    : undefined
                }
                maxSize={15 * 1024 * 1024}
                onChange={(fieldName, { combined }) => {
                  onSetHandler(fieldName, combined);
                }}
              />
            </View>

            {/* Status Information Section */}
            <View className="space-y-4">
              <Text
                as="h3"
                className="text-lg font-bold border-b pb-2 mb-4"
                weight="font-bold"
              >
                Status Information
              </Text>
              <SectionFour
                errorStatus={formErrors.status}
                // errorSurgeryStatus={formErrors.surgery_status}
                // errorPaymentStatus={formErrors.payment_status}
                errorReferralStatus={formErrors.referral_status}
                // errorAdmissionStatus={formErrors.admission_status}
                // errorTreatmentStatus={formErrors.treatment_status}
                // errorEmergencyStatus={formErrors.emergency_status}
              />
            </View>

            {/* Submit Button */}
            <View className="flex justify-end mt-8">
              <Button
                htmlType="submit"
                variant="primary"
                loading={isSubmitting}
                className="px-6 py-2 cursor-pointer sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </View>
          </form>
        </View>

        {/* Footer */}
        {!token && (
          <View className="mt-8 text-center text-text-lighter text-sm">
            <Text as="p" weight="font-light">
              © {new Date().getFullYear()} MedCare Hospital Management System.
              All rights reserved.
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default PatientAdmissionForm;
