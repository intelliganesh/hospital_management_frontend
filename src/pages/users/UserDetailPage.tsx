import View from "@/components/view";
import Text from "@/components/text";
import Input from "@/components/input";
import Button from "@/components/button";
import React, { useEffect } from "react";
import { Camera, Edit } from "lucide-react";
import { useUsers } from "@/actions/calls/user";
import { toast } from "@/utils/custom-hooks/use-toast";
import { imageUpload } from "@/actions/calls/uesImage";
import { useDispatch, useSelector } from "react-redux";
import ImageComponent from "@/components/ui/ImageComponent";
import { Link, useParams } from "react-router-dom";
import { clearUserDetailsSlice } from "@/actions/slices/userSlice";
import { Table, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DATE_FORMAT,
  EDIT_USER_URL,
  USER_TABLE_URL,
} from "@/utils/urls/frontend";
import ResetUserPassword from "@/components/resetUserPassword";
import dayjs from "dayjs";
import BouncingLoader from "@/components/BouncingLoader";
import Upload from "@/components/Upload";
import DoctorAvailabilitySection from "@/pages/forms/userForm/DoctorAvailabilitySection";

const UserDetailPage: React.FC<{}> = () => {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const { role, id: userId } = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails") as string)
    : null;

  const { id } = useParams();
  const profileImageRef = React.useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const { getUserDetails, getProfilerDetails, cleanUp, updateUser } =
    useUsers();

  const userDetails = useSelector((state: any) => state.users.userDetails);
  const [profileImagePreview, setProfileImagePreview] = React.useState<
    string | null
  >(null);
  const [isUploading, setIsUploading] = React.useState(false);

  // Doctor availability edit state
  const [isEditingAvailability, setIsEditingAvailability] =
    React.useState(false);
  const [isSavingAvailability, setIsSavingAvailability] = React.useState(false);
  const [localAvailability, setLocalAvailability] = React.useState<{
    available_days: Record<string, Record<string, string[]>>;
    slot_duration: number;
    leave_date: string[];
  }>({ available_days: {}, slot_duration: 30, leave_date: [] });

  useEffect(() => {
    if (id) {
      getUserDetails(
        id,
        () => {},
        [],
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    } else {
      getProfilerDetails(
        (_: boolean) => {},
        [],
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }

    // if(userDetails?.image){

    //   setProfileImagePreview(import.meta.env.VITE_APP_URL + userDetails?.image)
    // }
    return () => {
      cleanUp();
      dispatch(clearUserDetailsSlice());
    };
  }, [id]);

  useEffect(() => {
    if (userDetails?.image) {
      setProfileImagePreview(import.meta.env.VITE_APP_URL + userDetails?.image);
    }
  }, [userDetails]);

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      uploadProfileImage(file);
    }
  };
  const uploadProfileImage = async (imageFile: File) => {
    if (!userDetails?.id) {
      toast({
        title: "Error!",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const imageUploadData = {
      id: userDetails.id,
      modal_type: "user",
      file_name: "image",
      folder_name: "users_image",
      image: imageFile,
    };

    imageUpload(imageUploadData, (success, _) => {
      setIsUploading(false);
      if (success) {
        toast({
          title: "Success!",
          description: "Profile image updated successfully",
          variant: "success",
        });

        // Refresh user details to get updated profile image
        if (id) {
          getUserDetails(id, () => {});
        } else {
          getProfilerDetails((_: boolean) => {});
        }
      } else {
        toast({
          title: "Error!",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    });
  };

  // const handleEditProfileClick = () => {
  //   navigate(USER_TABLE_URL + EDIT_USER_URL + "/" + userDetails?.id);
  //   // navigate(USER_PROFILE_URL + "/edit");
  // };

  // Function to format date

  // Function to convert enum values to display format
  // const formatEnumValue = (value: string) => {
  //   return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
  // };

  // ── Doctor availability helpers ─────────────────────────────────────────────────────
  const parseJsonArray = (v: any): string[] => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      try {
        const p = JSON.parse(v);
        return Array.isArray(p) ? p : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const startEditAvailability = () => {
    const parseAvailableDays = (
      v: any,
    ): Record<string, Record<string, string[]>> => {
      if (typeof v === "string") {
        try {
          const p = JSON.parse(v);
          return parseAvailableDays(p);
        } catch {
          return {};
        }
      }
      if (v && typeof v === "object" && !Array.isArray(v)) return v;
      return {};
    };
    setLocalAvailability({
      available_days: parseAvailableDays(userDetails?.available_days),
      slot_duration: Number((userDetails as any)?.slot_duration) || 30,
      leave_date: parseJsonArray((userDetails as any)?.leave_date),
    });
    setIsEditingAvailability(true);
  };

  const availabilitySetHandler = (name: string, value: any) => {
    setLocalAvailability((prev) => ({ ...prev, [name]: value }));
  };

  const saveAvailability = () => {
    if (!userDetails?.id) return;
    setIsSavingAvailability(true);
    updateUser(
      userDetails.id.toString(),
      {
        available_days: JSON.stringify(localAvailability.available_days),
        slot_duration: localAvailability.slot_duration.toString(),
        leave_date: JSON.stringify(localAvailability.leave_date),
      },
      (success: boolean, _response: any) => {
        setIsSavingAvailability(false);
        if (success) {
          toast({
            title: "Success!",
            description: "Availability updated successfully",
            variant: "success",
          });
          setIsEditingAvailability(false);
          if (id) getUserDetails(id, () => {});
          else getProfilerDetails((_: boolean) => {});
        } else {
          toast({
            title: "Error!",
            description: "Failed to update availability",
            variant: "destructive",
          });
        }
      },
    );
  };

  return (
    <View className="min-h-screen  p-4 md:p-6 dark:bg-background">
      {/* <View className="fixed top-4 left-0  w-full z-50"> */}
      <BouncingLoader isLoading={isLoading} />
      {/* </View> */}
      <View className="max-w-6xl mx-auto">
        <View className="flex justify-between items-center mb-6">
          <View>
            <Text
              as="h1"
              weight="font-semibold"
              className="text-2xl md:text-3xl font-bold text-primary dark:text-white"
            >
              User Details
            </Text>
            <Text as="p" className="text-text-light">
              View detailed information about the user
            </Text>
          </View>
          <View className="flex gap-3">
            {(role === "Super Admin" || role === "Admin") && (
              <Button variant="outline" size="small">
                <Link to={USER_TABLE_URL + "?currentPage=1"}>Back to Home</Link>
              </Button>
            )}
            {/* <Button variant="outline" size="small">
              <Link to={USER_TABLE_URL + "?currentPage=1"}>Back to Home</Link>
            </Button> */}
            {(role !== "Super Admin" &&
              role !== "Admin" &&
              userDetails?.id !== Number(userId)) ||
            (role === "Admin" && userDetails?.role === "Super Admin") ? null : (
              // <Button
              //   variant="primary"
              //   className="flex items-center justify-center gap-2"
              //   onPress={handleEditProfileClick}
              // >
              //   <Edit className="w-4 h-4" />
              //   Edit Profile
              // </Button>
              <Link
                to={USER_TABLE_URL + EDIT_USER_URL + "/" + userDetails?.id}
                target="_blank"
              >
                <Button
                  variant="primary"
                  className="flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </Link>
            )}

            {/* {id && (
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(USER_TABLE_URL + USER_URL);
                  dispatch(clearUserDetailsSlice());
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add User
              </Button>
            )} */}
          </View>
        </View>

        <View className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center ">
              <View className="flex justify-center mb-4 relative rounded-full ">
                {profileImagePreview ? (
                  <View className="w-32 h-32 rounded-full overflow-hidden relative border-4 border-border">
                    <ImageComponent
                      src={profileImagePreview}
                      alt={userDetails?.name || "User"}
                      className="rounded-full object-cover h-full"
                    />
                  </View>
                ) : (
                  <View className="w-32 h-32 rounded-full bg-secondary-50 flex items-center justify-center">
                    <Text
                      as="span"
                      weight="font-bold"
                      className="text-secondary-600 !text-xl"
                    >
                      {userDetails?.name?.charAt(0)}
                    </Text>
                  </View>
                )}

                {/* Upload button overlay */}
                <View
                  className="absolute"
                  style={{ bottom: "4px", right: "4px" }}
                >
                  <button
                    type="button"
                    className="flex items-center justify-center bg-primary hover:bg-purple-700 text-white rounded-full h-10 w-10 shadow-sm transition-all duration-200 border-2 border-border"
                    style={{ cursor: "pointer" }}
                    disabled={isUploading}
                    aria-label="Upload profile image"
                    onClick={() => profileImageRef.current?.click()}
                  >
                    <Camera className="h-5 w-5 cusor-pointer" />

                    {isUploading && (
                      <View className="absolute inset-0 flex items-center justify-center bg-transparent bg-transparent bg-opacity-80 rounded-ful cursor-pointer">
                        <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></View>
                      </View>
                    )}
                  </button>
                  <Input
                    type="file"
                    name="image"
                    ref={profileImageRef}
                    hidden
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    disabled={isUploading}
                  />
                </View>
              </View>
              <CardTitle className="text-xl font-bold flex flex-col gap-1">
                {userDetails?.name || "N/A"}
                <Text as="span" className="text-muted-foreground text-sm">
                  {userDetails?.role || "N/A"}
                </Text>
              </CardTitle>
              {/* <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mt-2">
                {formatEnumValue(userDetails?.role)}
              </span> */}
            </CardHeader>
            <CardContent className="pt-0">
              <View className="space-y-3">
                <View className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <Text
                    as="span"
                    className="text-text-light dark:text-gray-400"
                  >
                    <a href={`mailto:${userDetails?.email}`}>
                      {userDetails?.email || "N/A"}
                    </a>
                  </Text>
                </View>
                <View className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <Text
                    as="span"
                    className="text-text-light dark:text-gray-400"
                  >
                    <a href={`tel:${userDetails?.phone}`}>
                      {userDetails?.phone || "N/A"}
                    </a>
                  </Text>
                </View>
                <View className="flex items-center gap-3">
                  <View>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </View>
                  <Text
                    as="span"
                    className="text-text-light dark:text-gray-400"
                  >
                    {userDetails?.address}, {userDetails?.city},{" "}
                    {userDetails?.state}, {userDetails?.country},{" "}
                    {userDetails?.pincode}
                  </Text>
                </View>
                <View className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text
                    as="span"
                    className="text-text-light dark:text-gray-400"
                  >
                    {dayjs(userDetails?.dob).format(DATE_FORMAT)} (Age:{" "}
                    {userDetails?.age || "N/A"} years)
                  </Text>
                </View>
              </View>

              {/* {(!id || userDetails?.role === "Admin") && ( */}
              {(((role === "Admin" || role === "Super Admin") &&
                role === "Admin" &&
                userDetails?.role !== "Super Admin") ||
                role === "Super Admin" ||
                userDetails?.id === userId) && (
                <View className="mt-6 pt-6 border-t border-neutral-200">
                  {/* <View className="flex justify-between mb-4">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                   
                    onPress={handleEditProfileClick}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </View> */}
                  <View className="flex justify-between mb-4">
                    <ResetUserPassword
                      role={role}
                      className="w-full"
                      userId={userDetails?.id}
                    />
                  </View>

                  <View className="space-y-2 mt-6">
                    <Text as="h3" className="text-lg font-semibold">
                      Government ID Proofs
                    </Text>
                    <View>
                      {userDetails?.gov_image ? (
                        <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
                          <Upload
                            name="doc_upload"
                            // onChange={(event: any) => {
                            //   onSetHandler("doc_upload", event?.target?.files[0]);
                            // }}
                            accept="image/*,.pdf,.doc,.docx,.txt,.mp4,.mov,.mkv,.webm,.webp"
                            multiple
                            maxSize={1024 * 1024 * 15}
                            existingFiles={
                              typeof userDetails?.gov_image === "string"
                                ? userDetails?.gov_image
                                : Array.isArray(userDetails?.gov_image) &&
                                    userDetails?.gov_image.length > 0
                                  ? userDetails?.gov_image
                                      .filter(
                                        (item: any) => typeof item === "string",
                                      )
                                      .join(",")
                                  : ""
                            }
                            // label="Government ID Proofs"
                            showOnlyFileList={true}
                            // onChange={(fileList: any) => {
                            //   // Separate existing URLs and new files
                            //   const existingUrls: string[] = [];
                            //   const newFiles: File[] = [];

                            //   fileList?.forEach((item: any) => {
                            //     if (item.isExisting && item.url) {
                            //       existingUrls.push(item.url);
                            //     } else if (
                            //       !item.isExisting &&
                            //       item.file &&
                            //       item.file instanceof File
                            //     ) {
                            //       newFiles.push(item.file);
                            //     }
                            //   });

                            //   // Store URLs and Files separately to avoid serialization issues
                            //   const urlsString = existingUrls.join(",");

                            //   // Store in local form (for this component)
                            //   onSetHandler("existing_file_urls", urlsString);
                            //   onSetHandler("new_files", newFiles);
                            //   onSetHandler("new_files_count", newFiles.length);
                            //   const combinedFiles = [...existingUrls, ...newFiles];
                            //   onSetHandler("doc_upload", combinedFiles);

                            //   // IMPORTANT: Store in main consultation form (for submission)
                            //   // if (mainOnSetHandler) {
                            //   //   mainOnSetHandler("existing_file_urls", urlsString);
                            //   //   mainOnSetHandler("new_files", newFiles);

                            //   //   // Also store combined for backward compatibility
                            //   //   const combinedFiles = [...existingUrls, ...newFiles];
                            //   //   mainOnSetHandler("doc_upload", combinedFiles);
                            //   // }
                            // }}
                            // value={values?.consultation_image}
                          />
                        </View>
                      ) : (
                        <Text
                          as="span"
                          className="text-text-light dark:text-gray-400"
                        >
                          No Government ID Proofs present
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userDetails?.status
                        ? "bg-accent-50 text-accent-600"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {userDetails?.status ? "Active" : "Inactive"}
                  </span>
                </div> */}
                </View>
              )}
            </CardContent>
          </Card>

          {/* User Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Name</TableCell>
                    <TableCell>{userDetails?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gender</TableCell>
                    <TableCell>{userDetails?.gender || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Date of Birth</TableCell>
                    <TableCell>
                      {userDetails?.DOB
                        ? dayjs(userDetails?.DOB).format(DATE_FORMAT)
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Age</TableCell>
                    <TableCell>
                      {userDetails?.age ? userDetails?.age + " years" : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Marital Status
                    </TableCell>
                    <TableCell>
                      {userDetails?.marital_status || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>
                      {" "}
                      <a href={`mailto:${userDetails?.email}`}>
                        {userDetails?.email || "N/A"}
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phone Number</TableCell>
                    <TableCell>
                      <a href={`tel:${userDetails?.phone}`}>
                        {userDetails?.phone || "N/A"}
                      </a>
                    </TableCell>
                  </TableRow>
                  {userDetails?.id_type && (
                    <TableRow>
                      <TableCell className="font-medium">
                        {userDetails?.id_type || "N/A"}
                      </TableCell>
                      <TableCell>
                        {userDetails?.id_number_masked || "N/A"}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">Address</TableCell>
                    <TableCell>{userDetails?.address || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">City</TableCell>
                    <TableCell>{userDetails?.city || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">State</TableCell>
                    <TableCell>{userDetails?.state || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Country</TableCell>
                    <TableCell>{userDetails?.country || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pincode</TableCell>
                    <TableCell>{userDetails?.pincode || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <View className="mt-6">
                <CardTitle className="mb-4">Professional Information</CardTitle>
                <Table>
                  <TableBody>
                    {/* <TableRow>
                      <TableCell className="font-medium w-1/3">Role</TableCell>
                      <TableCell>{formatEnumValue(userDetails?.role)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Department</TableCell>
                      <TableCell>{userDetails?.department}</TableCell>
                    </TableRow> */}
                    <TableRow>
                      <TableCell className="font-medium">Designation</TableCell>
                      <TableCell>{userDetails?.designation || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Qualification
                      </TableCell>
                      <TableCell>
                        {userDetails?.qualification || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Department</TableCell>
                      <TableCell>
                        {userDetails?.department_name || "N/A"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </View>

              <View className="mt-4">
                {/* Doctor Availability — visible only for Doctor role */}
                {userDetails?.role === "Doctor" && (
                  <View className="mt-6 dark:border-slate-700 pt-4">
                    {/* Header row with Edit / Save / Cancel */}
                    <View className="flex items-center justify-between mb-3">
                      <View>
                        <CardTitle>
                          Online Appointment Availability
                        </CardTitle>
                      </View>
                      {(role === "Admin" || role === "Super Admin") &&
                        (isEditingAvailability ? (
                          <View className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingAvailability(false)}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={saveAvailability}
                              disabled={isSavingAvailability}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                            >
                              {isSavingAvailability && (
                                <View className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              )}
                              {isSavingAvailability ? "Saving..." : "Save"}
                            </button>
                          </View>
                        ) : (
                          <button
                            type="button"
                            onClick={startEditAvailability}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        ))}
                    </View>

                    {isEditingAvailability ? (
                      <DoctorAvailabilitySection
                        values={localAvailability}
                        onSetHandler={availabilitySetHandler}
                        hideHeader
                      />
                    ) : (
                      <DoctorAvailabilitySection
                        values={userDetails}
                        onSetHandler={() => {}}
                        readOnly
                        hideHeader
                      />
                    )}
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </View>
  );
};

export default UserDetailPage;
