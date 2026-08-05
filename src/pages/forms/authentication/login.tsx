import React, { useState } from "react";
import Input from "@/components/input";
import Button from "@/components/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DASHBOARD_URL } from "@/utils/urls/frontend";
import { FORGOT_PASSWORD_URL } from "@/utils/urls/frontend";
import { useAuth } from "@/actions/calls/auth";
import { LoginDetails } from "@/interfaces/dashboard";
import View from "@/components/view";
import Text from "@/components/text";
import * as Yup from "yup";
import {  Mail, Lock, Eye, EyeOff } from "lucide-react";
import ImageComponent from "@/components/ui/ImageComponent";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { loginHandler } = useAuth();

  const [loginData, setLoginData] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const validationForm = Yup.object({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
        "Must include uppercase, lowercase, number, special character, and be at least 6 characters"
      )
      .required("Password is required"),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let loginFormObj: Partial<LoginDetails> = {};

    try {
      await validationForm.validate(loginData, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      for (let [key, value] of formData.entries()) {
        if (typeof value === "string") {
          loginFormObj[key as keyof LoginDetails] = value;
        }
      }
      loginHandler(loginFormObj, (success: boolean) => {
        if (success) {
          navigate(DASHBOARD_URL);
          // window.location.reload();
        } else {
          setIsSubmitting(false);
          // toast({
          //   title: "Error!",
          //   description: response?.error || "Email or password is incorrect",
          //   variant: "destructive",
          // });
        }
      });
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
    <View className="min-h-screen bg-[#F8FAFC] dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Login Card */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Left Side - Hospital Info */}
        <View className="bg-[#005B63] text-white p-8 md:w-5/12 flex flex-col justify-center items-center text-center">
          <View className="bg-white/30 p-4 rounded-full mb-6">
            <ImageComponent src="/hospitalLogo.png"/>
          </View>
          <Text as="h1" className="text-2xl font-bold mb-2">
            {import.meta.env.VITE_HOSPITAL_NAME}
          </Text>
          <Text className="text-teal-100 mb-6">
            {import.meta.env.VITE_TYPE_OF_APPLICATION}
          </Text>
          <View className="w-16 h-1 bg-teal-300 mb-6 rounded-full"></View>
          {/* <View className="flex items-center space-x-2 text-blue-100">
            <Stethoscope className="w-5 h-5" />
            <Text className="text-sm">Advanced Healthcare Management System</Text>
          </View> */}
        </View>

        {/* Right Side - Login Form */}
        <View className="p-8 md:w-7/12">
          <View className="text-center mb-8">
            <Text as="h2" className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 dark:text-gray-300">
              Sign in to access your account
            </Text>
          </View>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <View className="space-y-2">
              <Text as="label" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email Address
              </Text>
              <View className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 z-10" />
                </div>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005B63] focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="you@example.com"
                  // error={errors.email}
                  
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View className="space-y-2">
              <View className="flex items-center justify-between">
                <Text as="label" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Password
                </Text>
                <Link
                  to={FORGOT_PASSWORD_URL}
                  className="text-sm font-medium text-[#005B63] hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </View>
              <View className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 z-10" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005B63] focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="••••••••"
                  // error={errors.password}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Login Button */}
            <View>
              <Button
                htmlType="submit"
                variant="primary"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white !bg-[#005B63] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in to your account'
                )}
              </Button>
            </View>
          </form>

          {/* Footer */}
          <View className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {import.meta.env.VITE_HOSPITAL_NAME}. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
