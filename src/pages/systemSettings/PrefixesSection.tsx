import Input from "@/components/input";
import { useSelector } from "react-redux";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { RootState } from "@/actions/store";
import useForm from "@/utils/custom-hooks/use-form";
import View from "@/components/view";
import Text from "@/components/text";
import SingleSelector from "@/components/SingleSelector";

interface PrefixesProps {
  errorsOpdPrefix: string;
  errorsIpdPrefix: string;
  errorsTestPrefix: string;
  errorsInvoicePrefix: string;
  errorsPatientPrefix: string;
  errorsPaymentPrefix: string;
  errorsVoucherPrefix: string;
  // errorsFindingsPrefix: string;
  errorsHospitalPrefix: string;
  errorsAppointmentPrefix: string;
  errorsInvoiceStartNumber: string;
  errorsInvoiceStatus: string;
  errorsVoucherStartNumber: string;
  errorsVoucherStatus: string;
  errorsWardPrefix: string;
  errorsRoomPrefix: string;
  errorsBedPrefix: string;
}

const PrefixesSection: React.FC<PrefixesProps> = ({
  errorsIpdPrefix,
  errorsOpdPrefix,
  errorsTestPrefix,
  errorsPatientPrefix,
  errorsPaymentPrefix,
  errorsInvoicePrefix,
  errorsHospitalPrefix,
  // errorsFindingsPrefix,
  errorsAppointmentPrefix,
  errorsInvoiceStartNumber,
  errorsInvoiceStatus,
  errorsVoucherPrefix,
  errorsVoucherStartNumber,
  errorsVoucherStatus,
  errorsWardPrefix,
  errorsRoomPrefix,
  errorsBedPrefix,
}) => {
  const settingsData = useSelector(
    (state: RootState) => state.systemSettings.settings
  );
  const { values, handleChange } = useForm(settingsData);
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>System Prefixes</CardTitle>
        <CardDescription>
          Configure prefixes for various system identifiers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <View className="space-y-2">
            <Text as="label" className="text-sm font-medium">
              Hospital ID Prefix{" "}
              <Text as="span" className="text-red-500">
                *
              </Text>
            </Text>
            <Input
              id="hospital_prefix"
              name="hospital_prefix"
              placeholder="HOS"
              error={errorsHospitalPrefix}
              value={values?.hospital_prefix}
              onChange={handleChange}
            />

            <p className="text-xs text-text-light">
              Used for hospital identifiers
            </p>
          </View>
          <View className="space-y-2">
            <Text as="label" className="text-sm font-medium">
              Ward ID Prefix{" "}
              <Text as="span" className="text-red-500">
                *
              </Text>
            </Text>
            <Input
              id="ward_prefix"
              name="ward_prefix"
              placeholder="WAD"
              error={errorsWardPrefix}
              value={values?.ward_prefix}
              onChange={handleChange}
            />

            <p className="text-xs text-text-light">
              Used for ward identifiers
            </p>
          </View>
          <View className="space-y-2">
            <Text as="label" className="text-sm font-medium">
              Room ID Prefix{" "}
              <Text as="span" className="text-red-500">
                *
              </Text>
            </Text>
            <Input
              id="room_prefix"
              name="room_prefix"
              placeholder="ROM"
              error={errorsRoomPrefix}
              value={values?.room_prefix}
              onChange={handleChange}
            />

            <p className="text-xs text-text-light">
              Used for room identifiers
            </p>
          </View>
          <View className="space-y-2">
            <Text as="label" className="text-sm font-medium">
              Bed ID Prefix{" "}
              <Text as="span" className="text-red-500">
                *
              </Text>
            </Text>
            <Input
              id="bed_prefix"
              name="bed_prefix"
              placeholder="BED"
              error={errorsBedPrefix}
              value={values?.bed_prefix}
              onChange={handleChange}
            />

            <p className="text-xs text-text-light">
              Used for bed identifiers
            </p>
          </View>

          <View className="space-y-z">
            <View className="space-y-2">
              <Text as="label" className="text-sm font-medium">
                Patient ID Prefix{" "}
                <Text as="span" className="text-red-500">
                  *
                </Text>
              </Text>
              <Input
                id="patient_prefix"
                name="patient_prefix"
                placeholder="PAT"
                error={errorsPatientPrefix}
                value={values?.patient_prefix}
                onChange={handleChange}
              />
              {/* <Text as="p" className="text-xs text-text-light">
                Used for patient identifiers
              </Text> */}
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-2">
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Patient Id Start From
                </Text>
                <Input
                  type="number"
                  id="patient_start_number"
                  name="patient_start_number"
                  placeholder="Enter Patient Start Number"
                  // error={errorsPatientStartNumber}
                  value={values?.patient_start_number}
                  onChange={handleChange}
                />
              </View>
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Patient Id Status
                </Text>
                <SingleSelector
                  id="patient_status"
                  name="patient_status"
                  placeholder="Select Patient Status"
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  // error={errorsPatientStatus}
                  value={values?.patient_status ? true : false}
                  onChange={handleChange}
                />
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <View className="space-y-2">
              <Text as="label" className="text-sm font-medium">
                IPD Prefix{" "}
                <Text as="span" className="text-red-500">
                  *
                </Text>
              </Text>
              <Input
                id="ipd_prefix"
                name="ipd_prefix"
                placeholder="IPD"
                error={errorsIpdPrefix}
                value={values?.ipd_prefix}
                onChange={handleChange}
              />
              {/* <Text as="p" className="text-xs text-text-light">
              For inpatient department
            </Text> */}
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  IPD Start From
                </Text>
                <Input
                  type="number"
                  id="ipd_start_number"
                  name="ipd_start_number"
                  placeholder="Enter IPD Start Number"
                  // error={errorsIPDStartNumber}
                  value={values?.ipd_start_number}
                  onChange={handleChange}
                />
              </View>
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  IPD Status
                </Text>
                <SingleSelector
                  id="ipd_status"
                  name="ipd_status"
                  placeholder="Select IPD Status"
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  // error={errorsIPDStatus}
                  value={values?.ipd_status ? true : false}
                  onChange={handleChange}
                />
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <View className="space-y-2">
              <Text as="label" className="text-sm font-medium">
                OPD Prefix{" "}
                <Text as="span" className="text-red-500">
                  *
                </Text>
              </Text>
              <Input
                id="opd_prefix"
                name="opd_prefix"
                placeholder="OPD-"
                error={errorsOpdPrefix}
                value={values?.opd_prefix}
                onChange={handleChange}
              />
              {/* <Text as="p" className="text-xs text-text-light">
              For outpatient department
            </Text> */}
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  OPD Id Start From
                </Text>
                <Input
                  type="number"
                  id="opd_start_number"
                  name="opd_start_number"
                  placeholder="Enter OPD Start Number"
                  // error={errorsPatientStartNumber}
                  value={values?.opd_start_number}
                  onChange={handleChange}
                />
              </View>
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  OPD Id Status
                </Text>
                <SingleSelector
                  id="opd_status"
                  name="opd_status"
                  placeholder="Select OPD Status"
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  // error={errorsPatientStatus}
                  value={values?.opd_status ? true : false}
                  onChange={handleChange}
                />
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <View className="space-y-2">
              <Text as="label" className="text-sm font-medium">
                Appointment Prefix{" "}
                <Text as="span" className="text-red-500">
                  *
                </Text>
              </Text>
              <Input
                id="appointment_prefix"
                name="appointment_prefix"
                placeholder="APT"
                error={errorsAppointmentPrefix}
                value={values?.appointment_prefix}
                onChange={handleChange}
              />
              {/* <Text as="p" className="text-xs text-text-light">
              For appointments
            </Text> */}
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Appointment Id Start From
                </Text>
                <Input
                  type="number"
                  id="appointment_start_number"
                  name="appointment_start_number"
                  placeholder="Enter Appointment Start Number"
                  // error={errorsPatientStartNumber}
                  value={values?.appointment_start_number}
                  onChange={handleChange}
                />
              </View>
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Appointment Id Status
                </Text>
                <SingleSelector
                  id="appointment_status"
                  name="appointment_status"
                  placeholder="Select Appointment Status"
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  // error={errorsPatientStatus}
                  value={values?.appointment_status ? true : false}
                  onChange={handleChange}
                />
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <View className="space-y-2">
              <Text as="label" className="text-sm font-medium">
                Payment Prefix{" "}
                <Text as="span" className="text-red-500">
                  *
                </Text>
              </Text>
              <Input
                id="payment_prefix"
                name="payment_prefix"
                placeholder="PAY"
                error={errorsPaymentPrefix}
                value={values?.payment_prefix}
                onChange={handleChange}
              />
              {/* <Text as="p" className="text-xs text-text-light">
              For payment receipts
            </Text> */}
            </View>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Payment Id Start From
                </Text>
                <Input
                  type="number"
                  id="payment_start_number"
                  name="payment_start_number"
                  placeholder="Enter Payment Start Number"
                  // error={errorsPatientStartNumber}
                  value={values?.payment_start_number}
                  onChange={handleChange}
                />
              </View>
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Payment Id Status
                </Text>
                <SingleSelector
                  id="payment_status"
                  name="payment_status"
                  placeholder="Select Payment Status"
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  // error={errorsPatientStatus}
                  value={values?.payment_status ? true : false}
                  onChange={handleChange}
                />
              </View>
            </View>
          </View>

          {/* <View className="space-y-2">
            <Text as="label" className="text-sm font-medium">
              Findings Prefix
            </Text>
            <Input
              id="findings_prefix"
              name="findings_prefix"
              placeholder="FIN"
              error={errorsFindingsPrefix}
              value={values?.findings_prefix}
              onChange={handleChange}
            />
            <Text as="p" className="text-xs text-text-light">
              For findings
            </Text>
          </View> */}

          <View className="space-y-2">
            <View className="space-y-2">
              <Text as="label" className="text-sm font-medium">
                Test Prefix{" "}
                <Text as="span" className="text-red-500">
                  *
                </Text>
              </Text>
              <Input
                id="test_prefix"
                name="test_prefix"
                placeholder="TES"
                error={errorsTestPrefix}
                value={values?.test_prefix}
                onChange={handleChange}
              />
              {/* <Text as="p" className="text-xs text-text-light mt-2">
              For medical tests
            </Text> */}
            </View>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Test Id Start From
                </Text>
                <Input
                  type="number"
                  id="test_start_number"
                  name="test_start_number"
                  placeholder="Enter Test Start Number"
                  // error={errorsPatientStartNumber}
                  value={values?.test_start_number}
                  onChange={handleChange}
                />
              </View>
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Test Id Status
                </Text>
                <SingleSelector
                  id="test_status"
                  name="test_status"
                  placeholder="Select Test Status"
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  // error={errorsPatientStatus}
                  value={values?.test_status ? true : false}
                  onChange={handleChange}
                />
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <View className="space-y-2">
              <Text as="label" className="text-sm font-medium">
                Invoice Prefix{" "}
                <Text as="span" className="text-red-500">
                  *
                </Text>
              </Text>
              <Input
                id="invoice_prefix"
                name="invoice_prefix"
                placeholder="INV"
                error={errorsInvoicePrefix}
                value={values?.invoice_prefix}
                onChange={handleChange}
              />
              {/* <Text as="p" className="text-xs text-text-light">
              For invoices
            </Text> */}
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Invoice Start Number
                </Text>
                <Input
                  type="number"
                  id="invoice_start_number"
                  name="invoice_start_number"
                  placeholder="Enter Invoice Start Number"
                  error={errorsInvoiceStartNumber}
                  value={values?.invoice_start_number}
                  onChange={handleChange}
                />

                {/* <Text as="p" className="text-xs text-text-light">
                  For Invoice
                </Text> */}
              </View>
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Invoice Status
                </Text>
                <SingleSelector
                  id="invoice_status"
                  name="invoice_status"
                  placeholder="Select Invoice Status"
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  error={errorsInvoiceStatus}
                  value={values?.invoice_status ? true : false}
                  onChange={handleChange}
                />
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <View className="space-y-2">
              <Text as="label" className="text-sm font-medium">
                Voucher Prefix{" "}
                <Text as="span" className="text-red-500">
                  *
                </Text>
              </Text>
              <Input
                id="voucher_prefix"
                name="voucher_prefix"
                placeholder="VOU"
                error={errorsVoucherPrefix}
                value={values?.voucher_prefix}
                onChange={handleChange}
              />
              {/* <Text as="p" className="text-xs text-text-light">
              For invoices
            </Text> */}
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Voucher Start Number
                </Text>
                <Input
                  type="number"
                  id="voucher_start_number"
                  name="voucher_start_number"
                  placeholder="Enter Voucher Start Number"
                  error={errorsVoucherStartNumber}
                  value={values?.voucher_start_number}
                  onChange={handleChange}
                />

                {/* <Text as="p" className="text-xs text-text-light">
                  For Invoice
                </Text> */}
              </View>
              <View className="space-y-2">
                <Text as="label" className="text-sm font-medium">
                  Voucher Status
                </Text>
                <SingleSelector
                  id="voucher_status"
                  name="voucher_status"
                  placeholder="Select Voucher Status"
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  error={errorsVoucherStatus}
                  value={values?.voucher_status ? true : false}
                  onChange={handleChange}
                />
              </View>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default PrefixesSection;
