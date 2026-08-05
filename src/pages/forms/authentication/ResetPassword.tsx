import * as Yup from "yup";
import View from "@/components/view";
import Text from "@/components/text";
import Input from "@/components/input";
import Button from "@/components/button";
// import Modal from "@/components/modal";
import { useAuth } from "@/actions/calls/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle } from "lucide-react";
import { commanButtonStyle } from "@/utils/helperFunctions";
import Modal from "@/components/Modal";

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPassword: React.FC<{}> = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [linkNotValidated, setLinkNotValidated] = useState<boolean>(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();
  const { verifyPassword, resetPasswordHandler } = useAuth();

  useEffect(() => {
    verifyPassword({ hash: params?.hash }, (success: boolean) => {
      if (success) {
        setLinkNotValidated(false);
      }
    });
  }, [params?.hash]);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const validateField = async (name: string, value: string) => {
    try {
      const values = {
        password,
        confirmPassword,
        [name]: value,
      };

      await resetPasswordSchema.validateAt(name, values);

      setFormErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setFormErrors((prev) => ({ ...prev, [name]: err.message }));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await resetPasswordSchema.validate(
        { password, confirmPassword },
        { abortEarly: false }
      );
      setFormErrors({});
      if (params?.hash) {
        setIsSubmitting(true);
        setIsSubmitted(true);
        resetPasswordHandler(
          {
            password,
            token: params?.hash,
            password_confirmation: confirmPassword,
          },
          (success: boolean) => {
            setIsSubmitting(false);
            setIsSubmitted(false);
            if (success) {
              setShowSuccessModal(true);
            }
          }
        );
      } else {
        //add toster here to show message for user.
      }
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) errors[error.path] = error.message;
        });
        setFormErrors(errors);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <View className="min-h-screen flex flex-col justify-center items-center p-4">
      <View className="text-center mb-6">
        <Text
          as="h1"
          className="text-[#005B63] text-3xl md:text-4xl"
          weight="font-bold"
        >
          {import.meta.env.VITE_HOSPITAL_NAME || "MedCare Hospital"}
        </Text>
        <Text as="p" className="text-text-light mt-1" weight="font-semibold">
          {import.meta.env.VITE_TYPE_OF_APPLICATION ||
            "Hospital Management System"}
        </Text>
      </View>

      <View className="bg-white rounded-lg border border-neutral-300 shadow-md w-full max-w-md p-6 md:p-8">
        {
          linkNotValidated ? (
            <View className="mb-6 p-4 bg-danger/10 rounded-md">
              <Text as="p" className="text-danger text-sm font-medium">
                Invalid or missing reset token. Please request a new password
                reset link.
              </Text>
            </View>
          ) : (
            // !isSubmitted && (
            <React.Fragment>
              <Text
                as="h2"
                className="text-2xl text-center text-text-DEFAULT mb-2"
                weight="font-bold"
              >
                Reset Your Password
              </Text>
              <Text as="p" className="text-text-light text-center mb-6">
                Please create a new secure password for your account
              </Text>

              {!params?.hash && (
                <View className="mb-6 p-4 bg-danger/10 rounded-md">
                  <Text as="p" className="text-danger text-sm font-medium">
                    Invalid or missing reset token. Please request a new
                    password reset link.
                  </Text>
                </View>
              )}

              <form onSubmit={handleSubmit}>
                {/* Password */}
                <View className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-text-DEFAULT mb-1"
                  >
                    New Password
                  </label>
                  <View className="relative">
                    {/* Left Icon */}
                    <View className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <KeyRound className="h-5 w-5 text-neutral-500 z-10" />
                    </View>

                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      disabled={linkNotValidated}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        validateField("password", e.target.value);
                      }}
                      className={`w-full p-3 pl-10 pr-10 border rounded-md transition ${
                        formErrors.password
                          ? "border-danger focus:ring-danger/30"
                          : "border-neutral-300 focus:ring-primary-300"
                      }`}
                      placeholder="Enter your new password"
                    />

                    {/* Right Icon */}
                    <Button
                      htmlType="button"
                      variant="ghost"
                      onPress={toggleShowPassword}
                      className="absolute inset-y-0 right-3 flex items-center pr-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-500" />
                      )}
                    </Button>
                  </View>

                  {formErrors.password && (
                    <Text as="p" className="mt-1 text-xs text-danger">
                      {formErrors.password}
                    </Text>
                  )}
                  <Text as="p" className="mt-1 text-xs text-text-lighter">
                    Password must be at least 8 characters and include
                    uppercase, lowercase, and numbers
                  </Text>
                </View>

                {/* Confirm Password */}
                <View className="mb-6">
                  <Text
                    as="label"
                    className="block text-sm font-medium text-text-DEFAULT mb-1"
                  >
                    Confirm Password
                  </Text>
                  <View className="relative">
                    {/* Left Icon */}
                    <View className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <KeyRound className="h-5 w-5 text-neutral-500" />
                    </View>

                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      disabled={linkNotValidated}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        validateField("confirmPassword", e.target.value);
                      }}
                      className={`w-full p-3 pl-10 pr-10 border rounded-md transition ${
                        password !== confirmPassword
                          ? "border-danger focus:ring-danger/30"
                          : formErrors.confirmPassword
                          ? "border-danger focus:ring-danger/30"
                          : "border-neutral-300 focus:ring-primary-300"
                      }`}
                      placeholder="Confirm your new password"
                    />

                    {/* Right Icon */}
                    <Button
                      htmlType="button"
                      variant="ghost"
                      onPress={toggleShowConfirmPassword}
                      className="absolute inset-y-0 right-3 flex items-center pr-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-500" />
                      )}
                    </Button>
                  </View>

                  {formErrors.confirmPassword && (
                    <Text as="p" className="mt-1 text-xs text-danger">
                      {formErrors.confirmPassword}
                    </Text>
                  )}
                </View>

                {/* Submit */}
                <Button
                  htmlType="submit"
                  variant="primary"
                  className="w-full !bg-[#005B63] hover:!bg-[#005B63]"
                  disabled={isSubmitting || !params?.hash}
                >
                  {isSubmitting ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            </React.Fragment>
            // )
          )
          // (
          //   <View className="text-center py-4">
          //     <View className="bg-accent-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
          //       <Check className="h-8 w-8 text-accent" />
          //     </View>
          //     <Text
          //       as="h3"
          //       className="text-xl font-medium text-text-DEFAULT mb-2"
          //       weight="font-bold"
          //     >
          //       Password Reset Successful
          //     </Text>
          //     <Text as="p" className="text-text-light mb-6">
          //       Your password has been reset successfully. You can now use your
          //       new password to log in.
          //     </Text>
          //     <Link to="/login">
          //       <Button variant="primary" className="w-full">
          //         Go to Login
          //       </Button>
          //     </Link>
          //   </View>
          // )
        }

        <View className="text-center mt-6">
          <Text as="p" className="text-text-light text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-[#005B63] font-medium hover:text-[#005B63]/80 transition"
            >
              Back to login
            </Link>
          </Text>
        </View>
      </View>

      <View className="mt-8 text-center text-text-lighter text-sm">
        © {new Date().getFullYear()}{" "}
        {import.meta.env.VITE_HOSPITAL_NAME || "MedCare Hospital"} Hospital
        Management System. All rights reserved.
      </View>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/login");
        }}
        title="Password Reset Successful!"
        size="sm"
        showCloseButton={false}
      >
        <View className="flex flex-col items-center justify-center p-6">
          <View className="mb-4 p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </View>
          <Text className="text-center text-gray-700 mb-6">
            Your password has been successfully reset. You can now log in with
            your new password.
          </Text>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/login");
            }}
            className={commanButtonStyle}
          >
            Go to Login
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default ResetPassword;
