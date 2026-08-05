import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  FileText,
  ArrowLeft,
  Receipt,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Button from "@/components/button";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useExpenses } from "@/actions/calls/expenses";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/utils/urls/frontend";
import { toast } from "@/utils/custom-hooks/use-toast";
import Upload from "@/components/Upload";

const ExpenseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, setIsLoading] = useState(false);
  const { expensesDetail, downloadVoucherHandler } = useExpenses();

  useEffect(() => {
    if (id) {
      expensesDetail(id, () => {});
    }
  }, [id]);

  const voucherDownloadHandler = (id: string) => {
    if (id) {
      setIsLoading(true);
      downloadVoucherHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded Prescription",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download Prescription",
          //   variant: "destructive",
          // });
          setIsLoading(false);
        }
      });
    }
  };
  const expensesData = useSelector(
    (state: RootState) => state.expenses.expensesDetails
  );
  // const getPaymentModeColor = (mode: string) => {
  //   switch (mode.toLowerCase()) {
  //     case "upi":
  //       return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800";
  //     case "cash":
  //       return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800";
  //     case "card":
  //       return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800";
  //     default:
  //       return "bg-muted text-muted-foreground border-border";
  //   }
  // };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Expense Details
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Expenses
            </Button>
            {expensesData?.voucher_number && (
              <Button
                style={{ alignItems: "center" }}
                onClick={() => voucherDownloadHandler(expensesData?.id)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors flex item-center gap-2"
              >
                <Download size={16} /> Download Voucher
              </Button>
            )}
          </div>
        </div>

        {/* Main Expense Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl capitalize flex items-center gap-2">
                    {expensesData.expense_name}
                    <Badge
                      variant="outline"
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold"
                    >
                      {}#Voucher Number - {expensesData.voucher_number}
                    </Badge>
                  </CardTitle>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  ₹{expensesData.amount || "N/A"}
                </div>
                {/* <Badge
                  className={getPaymentModeColor(expensesData.mode_of_payment)}
                >
                  {expensesData.mode_of_payment}
                </Badge> */}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Date and Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <div>
                <h3 className="text-md font-semibold mb-2 text-foreground">
                  Transaction Date
                </h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    {dayjs(expensesData.date).format(DATE_FORMAT)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold mb-2 text-foreground">
                  Payment Method
                </h3>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    {expensesData.mode_of_payment || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-2 text-foreground">
                  Approved By
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {expensesData.entered_name || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold mb-2 text-foreground">
                  Paid By
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {expensesData.for_name || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            {expensesData.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h3>
                <div className="p-3 bg-muted/30 border border-border rounded-lg">
                  <p className="text-muted-foreground capitalize">
                    {expensesData.description || "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Transaction Information
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Payment Type</span>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded text-foreground">
                    {expensesData.mode_of_payment || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 ">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded text-foreground">
                    {expensesData.transaction_id || "N/A"}
                  </span>
                </div>

                {/* <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                  >
                    Completed
                  </Badge>
                </div> */}
              </div>
            </div>

            {/* Description */}

            {/* Proof Section */}
            {/* <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Proof of Purchase
              </h3>
              <div className="p-6 border-2 border-dashed border-border rounded-lg text-center bg-muted/20">
                <img
                  src={`${import.meta.env.VITE_APP_URL}/${expensesData.image}`}
                  alt="Proof of Purchase"
                />
              </div>
            </div> */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Proof of Purchase
              </h3>
              <div className="">
                {expensesData.image ? (
                  // <img
                  //   src={`${import.meta.env.VITE_APP_URL}/${
                  //     expensesData.image
                  //   }`}
                  //   alt="Proof of Purchase"
                  // />
                  <Upload
                    name="image"
                    existingFiles={
                      typeof expensesData?.image === "string"
                        ? expensesData?.image
                        : Array.isArray(expensesData?.image) &&
                          expensesData?.image.length > 0
                        ? expensesData?.image
                            .filter((item: any) => typeof item === "string")
                            .join(",")
                        : ""
                    }
                    showOnlyFileList={true}
                  />
                ) : (
                  <p>No Proof given</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseDetail;
