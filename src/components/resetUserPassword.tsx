// src/components/resetUserPassword.tsx
import * as yup from "yup";
import View from "@/components/view";
import Text from "@/components/text";
import Modal from "@/components/Modal";
import Input from "@/components/input";
import React, { useEffect, useState } from "react";
import Button from "@/components/button";
import { useUsers } from "@/actions/calls/user";
import { toast } from "@/utils/custom-hooks/use-toast";
import { KeyRound, Eye, EyeOff, RefreshCw } from "lucide-react";

interface ResetUserPasswordProps {
  role?: string;
  userId: string;
  userName?: string;
  // variant?: "default" | "primary" | "outline" | "ghost" | "link" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
}

const ResetUserPassword: React.FC<ResetUserPasswordProps> = ({
  role,
  userId,
  userName,
  // variant = "primary",
  //   size = 'md',
  className = "",
  showIcon = true,
  buttonText = "Reset Password",
}) => {
  const { updateUser, checkOldPassword } = useUsers();

  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const [disableNewPassword, setDisableNewPassword] = useState<boolean>(false);

  useEffect(() => {
    if (role === "Admin" || role === "Super Admin") {
      setDisableNewPassword(true);
    }
  }, [role]);

  const passwordSchema = yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setError("");
    setNewPassword("");
    setIsModalOpen(false);
    setShowPassword(false);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const toggleShowOldPassword = () => setShowOldPassword((prev) => !prev);

  const handleResetPassword = async () => {
    try {
      await passwordSchema.validate(newPassword, { abortEarly: false });
      setError("");
      setIsSubmitting(true);
      updateUser(userId, { password: newPassword }, (success, response) => {
        if (success) {
          closeModal();
          toast({
            title: "User Password Update",
            description: "User Password Updated Successfully!",
            variant: "success",
          });
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
          toast({
            title: "User Password Update",
            description: response?.error,
            variant: "destructive",
          });
        }
      });
    } catch (error: any) {
      setError(error.errors[0]);
      setIsSubmitting(false);
      toast({
        title: "User Password Update",
        description: "User Password Updated Failed!",
        variant: "destructive",
      });
    }
    //     if (newPassword.length > 0 && newPassword.length < 8) {
    //     setError('Password must be at least 8 characters long');
    //     return;
    //   } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
    //     setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    //     return;
    //   } else {
    //     setError("");
    //     setIsSubmitting(true)
    //   }

    // setIsSubmitting(true);

    // resetUserPassword(
    //   {
    //     user_id: userId,
    //     new_password: newPassword
    //   },
    //   (success: boolean) => {
    //     setIsSubmitting(false);

    //     if (success) {
    //       toast({
    //         title: 'Success',
    //         description: 'Password has been reset successfully',
    //         variant: 'success',
    //       });
    //       closeModal();
    //     } else {
    //       toast({
    //         title: 'Error',
    //         description: 'Failed to reset password. Please try again.',
    //         variant: 'destructive',
    //       });
    //     }
    //   }
    // );
  };

  return (
    <React.Fragment>
      <Button
        variant={"primary"}
        // size={size}
        className={`flex items-center justify-center gap-2 ${className}`}
        onPress={openModal}
      >
        {showIcon && <RefreshCw className="h-4 w-4 mr-2" />}
        {buttonText}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="md"
        title="Reset User Password"
      >
        <View className="p-4">
          {userName && (
            <View className="mb-4">
              <Text as="p" className="text-text-DEFAULT">
                Reset password for user:{" "}
                <span className="font-medium">{userName}</span>
              </Text>
            </View>
          )}

          {role !== "Admin" && role !== "Super Admin" && (
            <View className="mb-6">
              <Text
                as="label"
                // htmlFor="new-password"
                className="block text-sm font-medium text-text-DEFAULT mb-1"
              >
                Old Password<span className="text-danger">*</span>
              </Text>
              <View className="relative">
                <View className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <KeyRound className="h-5 w-5 text-neutral-500  !z-50" />
                </View>

                <Input
                  type={showOldPassword ? "text" : "password"}
                  id="old-password"
                  name="oldPassword"
                  value={oldPassword}
                  onBlur={() => {
                    checkOldPassword(
                      {
                        oldPassword: oldPassword,
                      },
                      (response: boolean) => {
                        if (response) {
                          setDisableNewPassword(response);
                          setError("");
                        } else {
                          setDisableNewPassword(false);
                          setError("Password does not match");
                        }
                      }
                    );
                  }}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                  className="w-full pl-10 pr-10 border rounded-md"
                  // error={error}
                  placeholder="Enter new password"
                />

                <Button
                  htmlType="button"
                  variant="ghost"
                  onPress={toggleShowOldPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-500" />
                  )}
                </Button>
              </View>
              <Text as="p" className="mt-1 text-xs text-danger">
                {error}
              </Text>
            </View>
          )}
          {disableNewPassword && (
            <View className="mb-6">
              <Text
                as="label"
                // htmlFor="new-password"
                className="block text-sm font-medium text-text-DEFAULT mb-1"
              >
                New Password<span className="text-danger">*</span>
              </Text>
              <View className="relative">
                {/* Left Icon */}
                <View className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <KeyRound className="h-5 w-5 text-neutral-500" />
                </View>

                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 border rounded-md"
                  // error={error}
                  placeholder="Enter new password"
                />

                {/* Right Icon */}
                <Button
                  htmlType="button"
                  variant="ghost"
                  onPress={toggleShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-500" />
                  )}
                </Button>
              </View>
              <Text as="p" className="mt-1 text-xs text-danger">
                {error}
              </Text>
            </View>
          )}

          <View className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onPress={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            {/* {disableNewPassword && ( */}
            <Button
              variant="primary"
              onPress={handleResetPassword}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
            {/* )} */}
          </View>
        </View>
      </Modal>
    </React.Fragment>
  );
};

export default ResetUserPassword;
