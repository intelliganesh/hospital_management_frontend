import { toast } from "@/components/ui/use-toast";
export const handleApiError = (Errors: any) => {
  // permission denials are already toasted by LaunchApi (403 PERMISSION_DENIED)
  if (Errors?.code === "PERMISSION_DENIED") return;
  if (Errors) {
    // console.log(error, "Errors");
    const { message, errors, error } = Errors;
    // console.log(generalMessage, "generalMessage");
    // console.log(errors, "errors");

    // Show general error if available
    // if (generalMessage) {
    // toast({
    //   title: "Error",
    //   description: !generalMessage?.errors ? "Something went wrong. Please try again later." : generalMessage?.errors,
    //   variant: "destructive",
    // });
    // }

    // Show field-specific errors
    if (errors) {
      Object.keys(errors).forEach((field) => {
        errors[field].forEach((errMsg: string) => {
          //   message.error(`${field}: ${errMsg}`);
          toast({
            title: `Error: ${message}`,
            description: `${errMsg}`,
            variant: "destructive",
          });
        });
      });
    } else if (error) {
      toast({
        title: `Error: ${message}`,
        description: `${
          error?.exception || "Something went wrong. Please try again."
        }`,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Error: ${message}`,
        description: `Something went wrong.`,
        variant: "destructive",
      });
    }
  } else {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }
};
