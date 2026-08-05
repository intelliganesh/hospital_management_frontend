import Button from "@/components/button";
import Input from "@/components/input";
import Text from "@/components/text";
import View from "@/components/view";
import { Test } from "@/interfaces/test";
import useForm from "@/utils/custom-hooks/use-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { useTest } from "@/actions/calls/test";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { clearTestDetailSlice } from "@/actions/slices/test";
import TipTapTextEditor from "@/components/TipTapTexteditor";
// import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";

const TestForm: React.FC<FormTypeProps> = ({
  formType = "add",
  // errorsDepartmentType,
  onModalSuccess,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addTestHandler, testEditHandler, testDetailHandler, cleanUp } =
    useTest();

  useEffect(() => {
    if (formType === "edit" && id) {
      testDetailHandler(
        id,
        () => {},
        [],
        (status) => {
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
      dispatch(clearTestDetailSlice());
    };
  }, [id, formType]);

  const testData = useSelector((state: any) => state.test.testDetailData);
  const { values, handleChange, handleTipTapChange } = useForm<Test | null>(
    testData
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let testFormObj: Partial<Test> = {};
    try {
      for (let [key, value] of formData.entries()) {
        testFormObj[key as keyof Test] = value as any;
      }
      await validationForm.validate(testFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addTestHandler(testFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Test Added successfully.",
              variant: "success",
            });
            if (onModalSuccess) {
              return onModalSuccess();
            }
            navigate(-1);
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to add Test",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        testEditHandler(id, testFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Test Updated successfully.",
              variant: "success",
            });
            if (onModalSuccess) {
              return onModalSuccess();
            }
            navigate(-1);
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Test",
            //   variant: "destructive",
            // });
          }
        });
      }
    } catch (error: any) {
      console.error("Validation Error:", error);
      setIsSubmitting(false);
      if (error.inner) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };
  return (
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4">
      <BouncingLoader isLoading={isLoading} />
      <View className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text
              as="h2"
              weight="font-bold"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
            >
              {formType === "add" ? "New Test" : "Edit Test"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the Test details
            </Text>
          </View>
          {!onModalSuccess && (
            <Button
              onPress={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              Back
            </Button>
          )}
        </View>
        <form onSubmit={handleSubmit}>
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <View>
              <Input
                required={true}
                id="test_name"
                name="test_name"
                label="Test Name"
                onChange={handleChange}
                error={errors?.test_name}
                value={values?.test_name}
                placeholder="Test Name"
              />
            </View>
            {/* <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 mb-4"> */}
            <View>
              <Input
                id="test_price"
                name="test_price"
                label="Test Amount"
                onChange={handleChange}
                error={errors?.test_price}
                value={values?.test_price}
                placeholder="Test Amount"
              />
            </View>
            <View>
              <Input
                id="tax_price"
                name="tax_price"
                label="Tax Amount"
                onChange={handleChange}
                error={errors?.tax_price}
                value={values?.tax_price}
                placeholder="Tax Amount"
              />
            </View>
          </View>

          {/* <View>
            <DepartmentType
              value={values?.department_type || ""}
              error={errors?.department_type}
              onChange={(value) => onSetHandler("department_type", value)}
              required={true}
            />
          </View> */}
          <View className="mt-4">
            <TipTapTextEditor
              name="test_description"
              label="Test Description"
              onChange={handleTipTapChange}
              areaHeight="h-24"
              error={errors?.test_description}
              value={values?.test_description}
              placeholder="Test Description"
            />
          </View>
          {/* </View> */}
          <View className="col-span-2 mt-6">
            <Button
              htmlType="submit"
              loading={isSubmitting}
              className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </View>
        </form>
      </View>
    </View>
  );
};
export default TestForm;
