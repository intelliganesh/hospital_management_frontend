import * as Yup from "yup";
import { Mail } from "lucide-react";
import Text from "@/components/text";
import View from "@/components/view";
import Input from "@/components/input";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/button";
import { useAuth } from "@/actions/calls/auth";
import { commanButtonStyle } from "@/utils/helperFunctions";

// Yup validation schema
const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPasswordHandler } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sendEmailHandler();
  };

  const sendEmailHandler = async () => {
    try {
      await emailSchema.validate({ email }, { abortEarly: false });
      setFormError(null);
      forgotPasswordHandler({ email }, (success: boolean) => {
        if (success) {
          setIsSubmitted(true);
          setIsSubmitting(false);
        }
      });
    } catch (err: any) {
      setIsSubmitting(false);
      if (err instanceof Yup.ValidationError) {
        setFormError(err.message);
      }
    }
  };

  return (
    <View className="min-h-screen flex flex-col justify-center items-center p-4 dark:bg-background">
      {/* Header bg-secondary */}
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

      {/* Forgot Password Card */}
      <View className=" rounded-lg border border-neutral-300 shadow-md w-full max-w-md p-6 md:p-8">
        {/* <View className="flex items-center justify-between mb-6">
          <Link 
            to="/login" 
            className="text-text-light flex items-center hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <Text as="span" weight="font-normal">Back to login</Text>
          </Link>
        </View> */}

        <Text
          as="h2"
          className="text-2xl font-bold text-center text-text-DEFAULT mb-2 dark:text-white"
          weight="font-bold"
        >
          Reset Password
        </Text>
        <Text
          as="p"
          className="text-text-light text-center mb-6"
          weight="font-normal"
        >
          Enter your email and we'll send you instructions to reset your
          password
        </Text>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <View className="mb-6">
              <Text
                as="label"
                className="block text-sm font-medium text-text-DEFAULT mb-1 dark:text-white"
              >
                Email
              </Text>
              <View className="relative">
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className={`w-full p-3 pl-10 border dark:text-white rounded-md transition ${
                    formError
                      ? "border-danger focus:ring-danger/30"
                      : "border-neutral-300 focus:ring-primary-300"
                  }`}
                  placeholder="your.email@example.com"
                  leftIcon={
                    <Mail className="w-6 h-6 absolute left-1 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  }
                />
              </View>
              {formError && (
                <Text as="p" className="mt-1 text-xs text-danger">
                  {formError}
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <Button
              htmlType="submit"
              variant="primary"
              className={
                commanButtonStyle + " w-full flex items-center justify-center"
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <View className="text-center py-4">
            <View className="bg-accent-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-accent" />
            </View>
            <Text
              as="h3"
              className="text-xl font-medium text-text-DEFAULT mb-2"
              weight="font-bold"
            >
              Check your email
            </Text>
            <Text as="p" className="text-text-light mb-6" weight="font-normal">
              We've sent a password reset link to
              <br />
              <span className="font-medium text-text-DEFAULT">{email}</span>
            </Text>
            <Button
              variant="primary"
              className="w-full"
              onPress={sendEmailHandler}
            >
              Resend email
            </Button>
          </View>
        )}

        <View className="text-center mt-6">
          <Text as="p" className="text-text-light text-sm" weight="font-normal">
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

      {/* Footer */}
      <View className="mt-8 text-center text-text-lighter text-sm">
        © {new Date().getFullYear()}{" "}
        {import.meta.env.VITE_HOSPITAL_NAME || "MedCare Hospital"} Hospital
        Management System. All rights reserved.
      </View>
    </View>
  );
};

export default ForgotPassword;
