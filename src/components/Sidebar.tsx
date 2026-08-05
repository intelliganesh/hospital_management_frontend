import Text from "./text";
import View from "./view";
import React, { useEffect } from "react";
import Button from "@/components/button";
import { useAuth } from "@/actions/calls/auth";
import { Link, useLocation } from "react-router-dom";
import { useWindowDimension } from "@/utils/custom-hooks/use-browser-dimentions";
import {
  Users,
  LogOut,
  UserPlus,
  // Menu,
  // Stethoscope,
  Settings,
  CalendarClock,
  LayoutDashboard,
  PanelRightOpen,
  ClipboardList,
  Table2,
  FileText,
  // Proportions,
  Wallet,
  Proportions,
  NotebookText,
  // CalendarRange,
} from "lucide-react";
import {
  SETTINGS_URL,
  DASHBOARD_URL,
  USER_TABLE_URL,
  PATIENT_TABLE_URL,
  // OPD_TABLE_URL,
  APPOINTMENT_TABLE_URL,
  CONSULTATION_TABLE_URL,
  ROLES_TABLE_URL,
  TEST_TABLE_URL,
  MEDICINE_TABLE_URL,
  ALLERGY_TABLE_URL,
  MEDICINE_CATEGORY_TABLE_URL,
  DOSHA_ANALYSIS_URL,
  PRAKRITI_URL,
  VIKRUTI_URL,
  AGNI_URL,
  KOSHTA_URL,
  AVASTHA_URL,
  YOGA_ASANA_TABLE_URL,
  INVOICE_URL,
  DEPARTMENT_TABLE_URL,
  CONSULTATION_FEES_URL,
  SURGICAL_HISTORY_TABLE_URL,
  CHIEF_COMPLAINT_URL,
  ON_EXAMINATION_TABLE_URL,
  AMOUNT_TYPE_TABLE_URL,
  SERVICE_COST_TABLE_URL,
  COMORBIDITIES_TABLE_URL,
  DIET_TABLE_URL,
  // DIAGNOSIS_TABLE_URL,
  FOOD_ADVICE_TABLE_URL,
  EXPENSES_TABLE_URL,
  REPORT_EXPENSES,
  REPORT_INVOICE,
  DRE_TABLE_URL,
  PROCTOSCOPY_TABLE_URL,
  FISTULA_TABLE_URL,
  MANAGEMENT_TABLE_URL,
  REPORT_FISTULA,
  REPORT_CONSULTATION,
  REFERRED_BY_TABLE_URL,
  FISTULA_ENTRY_LIST_URL,
  BANK_DETAILS_TABLE_URL,
  // ONLINE_APPOINTMENT_TABLE_URL,
} from "@/utils/urls/frontend";
import { useSelector } from "react-redux";
// import { ExaminationsPage } from "@/pages/examinations/ExaminationsPage";
import {
  SidebarDropdown,
  SidebarDropdownItem,
} from "@/components/sidebar/index";
import dayjs from "dayjs";
import { PERMISSIONS } from "@/rolesRoute";
import { usePermissions } from "@/utils/custom-hooks/use-permissions";
 
interface SidebarItemProps {
  href?: string;
  label?: string;
  active?: boolean;
  icon?: React.ReactNode;
  isSideBarOpen: boolean;
  children?: React.ReactNode;
  onSelect?: () => void;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  active,
  isSideBarOpen,
  children,
  onSelect,
}) => {
  return (
    <React.Fragment>
      {children ? (
        // children
        children
      ) : (
        <Link
          to={href || "/"}
          onClick={onSelect}
          // className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          //   active
          //     ? "bg-primary-background dark:bg-primary text-primary dark:text-white font-medium"
          //     : "text-white dark:text-neutral-400 hover:bg-primary-background hover:text-primary dark:hover:bg-primary dark:hover:text-white"
          // }`}
          className={`group flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl transition-all duration-200 ${
            active
              ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-soft font-medium"
              : "text-white/80 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-700 hover:text-white dark:hover:text-white"
          }`}
        >
          {/* <View className="text-current">{icon}</View> */}
          <View
            className={`flex-shrink-0 ${
              active
                ? "text-primary-600 dark:text-primary-400"
                : "text-current group-hover:scale-110 transition-transform duration-200"
            }`}
          >
            {icon}
          </View>
          {/* <Text as="span">{isSideBarOpen ? label : ""}</Text> */}
          {/* <Text as="span" className="text-sm font-medium truncate">
              {label}
            </Text> */}
          {isSideBarOpen && (
            <Text as="span" className="text-sm font-medium truncate">
              {label}
            </Text>
          )}
          {active && isSideBarOpen && (
            <View className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400"></View>
          )}
        </Link>
      )}
    </React.Fragment>
  );
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const sidebarItems = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    href: DASHBOARD_URL,
    requiredPermission: PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    icon: <UserPlus size={20} />,
    label: "Patients",
    href: PATIENT_TABLE_URL + "?currentPage=1",
    requiredPermission: PERMISSIONS.VIEW_PATIENTS,
  },
  {
    icon: <CalendarClock size={20} />,
    label: "Appointments",
    href:
      APPOINTMENT_TABLE_URL +
      `?currentPage=1&from_date=${dayjs().format(
        "YYYY-MM-DD"
      )}&to_date=${dayjs().format("YYYY-MM-DD")}`,
    requiredPermission: PERMISSIONS.VIEW_APPOINTMENTS,
  },
  // {
  //   icon: <CalendarRange size={20} />,
  //   label: "Online Appointments",
  //   href: ONLINE_APPOINTMENT_TABLE_URL + "?currentPage=1",
  //   requiredPermission: PERMISSIONS.VIEW_ONLINE_APPOINTMENTS,
  // },
  {
    icon: <ClipboardList size={20} />,
    label: "Consultations",
    href: CONSULTATION_TABLE_URL + `?currentPage=1`,
    requiredPermission: PERMISSIONS.VIEW_CONSULTATIONS,
    // href:
    //   CONSULTATION_TABLE_URL +
    //   `?currentPage=1&from_date=${dayjs().format(
    //     "YYYY-MM-DD"
    //   )}&to_date=${dayjs().format("YYYY-MM-DD")}`,
  },
  // ipd
  {
    icon: <FileText size={20} />,
    label: "Bills",
    // href:
    //   INVOICE_URL +
    //   `?currentPage=1&from_date=${dayjs().format(
    //     "YYYY-MM-DD"
    //   )}&to_date=${dayjs().format("YYYY-MM-DD")}`,
    href: INVOICE_URL + `?currentPage=1`,
    requiredPermission: PERMISSIONS.VIEW_BILLS,
  },
  {
    icon: <NotebookText size={20} />,
    label: "Fistula Entry",
    href: FISTULA_ENTRY_LIST_URL + "?currentPage=1",
  },
  {
    icon: <Wallet size={20} />,
    label: "Expenses",
    href: EXPENSES_TABLE_URL + "?currentPage=1",
    requiredPermission: PERMISSIONS.VIEW_EXPENSES,
  },
  {
    icon: <Proportions size={20} />,
    label: "Expenses Report",
    requiredPermission: PERMISSIONS.VIEW_REPORTS,
    children: (
      <SidebarDropdown
        title="Reports"
        icon={<Table2 size={20} />}
        variant="secondary"
      >
        <SidebarDropdownItem
          to={`${REPORT_EXPENSES}?currentPage=1&from_date=${dayjs().format(
            "YYYY-MM-DD"
          )}&to_date=${dayjs().format("YYYY-MM-DD")}`}
          label="Expenses Report"
          requiredPermission={PERMISSIONS.VIEW_EXPENSE_REPORT}
        />
        <SidebarDropdownItem
          to={`${REPORT_INVOICE}?currentPage=1&from_date=${dayjs().format(
            "YYYY-MM-DD"
          )}&to_date=${dayjs().format("YYYY-MM-DD")}`}
          label="Invoice Report"
          requiredPermission={PERMISSIONS.VIEW_INVOICE_REPORT}
        />
        <SidebarDropdownItem
          to={`${REPORT_FISTULA}?currentPage=1&from_date=${dayjs().format(
            "YYYY-MM-DD"
          )}&to_date=${dayjs().format("YYYY-MM-DD")}`}
          label="Fistula Report"
          requiredPermission={PERMISSIONS.VIEW_FISTULA_REPORT}
        />
        <SidebarDropdownItem
          to={`${REPORT_CONSULTATION}?currentPage=1&from_date=${dayjs().format(
            "YYYY-MM-DD"
          )}&to_date=${dayjs().format("YYYY-MM-DD")}`}
          label="Consultation Report"
          requiredPermission={PERMISSIONS.VIEW_CONSULTATION_REPORT}
        />
      </SidebarDropdown>
    ),
    // href: REPORT_EXPENSES + "?currentPage=1",
  },
  // certificates
  {
    icon: <Table2 size={20} />,
    label: "Masters",
    requiredPermission: PERMISSIONS.VIEW_MASTERS,
    children: (
      <SidebarDropdown
        title="Masters"
        icon={<Table2 size={20} />}
        variant="secondary"
      >
        {/* <SidebarDropdownItem to="/settings/general" label="General Settings" /> */}
        {/* <SidebarDropdownItem
          to={`${FINDINGS_URL}?currentPage=1`}
          label="Findings"
        /> */}
        <SidebarDropdownItem
          to={`${ROLES_TABLE_URL}?currentPage=1`}
          label="Roles"
        />
        <SidebarDropdownItem
          to={`${DEPARTMENT_TABLE_URL}?currentPage=1`}
          label="Departments"
        />
        <SidebarDropdownItem
          to={`${BANK_DETAILS_TABLE_URL}?currentPage=1`}
          label="Bank Details"
        />
        {/* <SidebarDropdownItem
          to={`${ROOMS_TABLE_URL}?currentPage=1`}
          label="Rooms"
        /> */}
        <SidebarDropdownItem
          to={`${FISTULA_TABLE_URL}?currentPage=1`}
          label="Fistula"
        />
        <SidebarDropdownItem
          to={`${TEST_TABLE_URL}?currentPage=1`}
          label="Tests"
        />
        <SidebarDropdownItem
          to={`${REFERRED_BY_TABLE_URL}?currentPage=1`}
          label="Referred By Doctors"
        />
        <SidebarDropdownItem
          to={`${AMOUNT_TYPE_TABLE_URL}?currentPage=1`}
          label="Amount Types"
        />
        <SidebarDropdownItem
          to={`${CONSULTATION_FEES_URL}?currentPage=1`}
          label="Consultation Fees"
        />
        <SidebarDropdownItem
          to={`${CHIEF_COMPLAINT_URL}?currentPage=1`}
          label="Chief Complaints"
        />
        <SidebarDropdownItem
          to={`${MEDICINE_CATEGORY_TABLE_URL}?currentPage=1`}
          label="Medicine Categories"
        />
        <SidebarDropdownItem
          to={`${MEDICINE_TABLE_URL}?currentPage=1`}
          label="Medicines"
        />
        <SidebarDropdownItem
          to={`${ALLERGY_TABLE_URL}?currentPage=1`}
          label="Allergies"
        />
        <SidebarDropdownItem
          to={`${SURGICAL_HISTORY_TABLE_URL}?currentPage=1`}
          label="Surgical History"
        />
        <SidebarDropdownItem
          to={`${ON_EXAMINATION_TABLE_URL}?currentPage=1`}
          label="On Examination"
        />
        <SidebarDropdownItem
          to={`${COMORBIDITIES_TABLE_URL}?currentPage=1`}
          label="Comorbidities"
        />
        <SidebarDropdownItem
          to={`${MANAGEMENT_TABLE_URL}?currentPage=1`}
          label="Managements"
        />
        <SidebarDropdownItem
          to={`${FOOD_ADVICE_TABLE_URL}?currentPage=1`}
          label="Food Advice"
        />

        {/* <SidebarDropdownItem to="/settings/general" label="General Settings" /> */}
        {/* <SidebarDropdownItem
          to={`${FINDINGS_URL}?currentPage=1`}
          label="Findings"
        /> */}
        <SidebarDropdownItem
          to={`${DOSHA_ANALYSIS_URL}${PRAKRITI_URL}?currentPage=1`}
          label="Prakriti"
        />
        <SidebarDropdownItem
          to={`${DOSHA_ANALYSIS_URL}${VIKRUTI_URL}?currentPage=1`}
          label="Vikruti"
        />
        <SidebarDropdownItem
          to={`${DOSHA_ANALYSIS_URL}${AGNI_URL}?currentPage=1`}
          label="Agni"
        />
        <SidebarDropdownItem
          to={`${DOSHA_ANALYSIS_URL}${KOSHTA_URL}?currentPage=1`}
          label="Koshta"
        />
        <SidebarDropdownItem
          to={`${DOSHA_ANALYSIS_URL}${AVASTHA_URL}?currentPage=1`}
          label="Avastha"
        />
        <SidebarDropdownItem
          to={`${YOGA_ASANA_TABLE_URL}?currentPage=1`}
          label="Yoga Asana"
        />
        <SidebarDropdownItem
          to={`${SERVICE_COST_TABLE_URL}?currentPage=1`}
          label="Service Costs"
        />
        <SidebarDropdownItem
          to={`${DIET_TABLE_URL}?currentPage=1`}
          label="Diets"
        />
        <SidebarDropdownItem
          to={`${DRE_TABLE_URL}?currentPage=1`}
          label="DRE"
        />
        <SidebarDropdownItem
          to={`${PROCTOSCOPY_TABLE_URL}?currentPage=1`}
          label="Proctoscopy"
        />
      </SidebarDropdown>
    ),
    // href: EXAMINATION_TABLE_URL + "?currentPage=1",
  },
  {
    icon: <Users size={20} />,
    label: "Users",
    href: USER_TABLE_URL + "?currentPage=1",
    requiredPermission: PERMISSIONS.VIEW_USERS,
  },
  // {
  //   icon: <Stethoscope size={20} />,
  //   label: "OPD",
  //   href: OPD_TABLE_URL + "?currentPage=1",
  // },

  // {
  //   icon: <FlaskConical size={20} />,
  //   label: "Patient Tests",
  //   href: PATIENT_TEST_TABLE_URL + "?currentPage=1",
  // },
  {
    icon: <Settings size={20} />,
    label: "Settings",
    href: SETTINGS_URL + "?tab=system-settings",
    requiredPermission: PERMISSIONS.VIEW_SETTINGS,
  },
  // expenses
  // reports
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [width] = useWindowDimension();
  const { hasPermission } = usePermissions();

  const settingsData = useSelector(
    (state: any) => state.systemSettings.settings
  );

  useEffect(() => {
    if (width < 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [width]);

  // Filter sidebar items based on user permissions
  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (!item.requiredPermission) return true; // Show items without permission requirements
    const hasAccess = hasPermission(item.requiredPermission);
    return hasAccess;
  });

  const { logoutHandler } = useAuth();

  return (
    sidebarOpen && (
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-gradient-to-b from-primary-600 to-primary-700 dark:from-slate-900 dark:to-slate-800 text-card-foreground shadow-xl dark:shadow-2xl transition-all duration-300 md:static ${
          sidebarOpen
            ? width < 768
              ? "w-full"
              : "w-64"
            : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <View className="flex h-16 items-center justify-between gap-2 border-b border-white/10 dark:border-slate-700 px-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2"
            style={{ width: "80%" }}
          >
            {sidebarOpen ? (
              <View className="flex items-center gap-3 w-full h-full">
                {settingsData?.hospital_logo ? (
                  <View className="h-16 w-full overflow-hidden bg-white/30 rounded-md p-1">
                    <img
                      src={
                        import.meta.env.VITE_APP_URL +
                        settingsData?.hospital_logo
                      }
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // prevent looping
                        target.src = "/hospitalLogo.png";
                      }}
                      alt="Hospital Logo"
                      className="h-auto w-auto min-h-full min-w-full object-contain"
                    />
                  </View>
                ) : (
                  <>
                    <View className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                      {/* <Text as="span" className="text-sm font-bold text-white">
                        {settingsData?.hospital_name
                          ?.charAt(0)
                          ?.toUpperCase() || "H"}
                      </Text> */}
                      <View className="h-16 w-full overflow-hidden shadow-md bg-white">
                        <img
                          src="/hospitalLogo.png"
                          alt="Hospital Logo"
                          className="h-auto w-auto min-h-full min-w-full object-cover"
                        />
                      </View>
                    </View>
                    {/* <Text
                      as="h1"
                      className="text-lg font-bold text-white truncate"
                      title={settingsData?.hospital_name}
                    >
                      {settingsData?.hospital_name || "Hospital"}
                    </Text> */}
                  </>
                )}
              </View>
            ) : (
              <View className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-200">
                <Text
                  as="span"
                  className="text-sm font-bold text-white"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {settingsData?.hospital_name?.charAt(0)?.toUpperCase() || "H"}
                </Text>
              </View>
            )}
          </Link>
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
            variant="ghost"
          >
            <PanelRightOpen size={20} />
          </Button>
        </View>

        {/* Sidebar Content */}
        <View className="flex-1 overflow-y-auto py-6 px-2">
          <nav className="space-y-2">
            {filteredSidebarItems.length === 0 ? (
              <div className="p-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50">
                <Text className="text-yellow-700 text-sm font-medium">
                  ⚠️ No menu items available for your role. Please contact the
                  administrator.
                </Text>
              </div>
            ) : (
              filteredSidebarItems.map((item, index) => (
                <React.Fragment key={index}>
                  {item?.children ? (
                    <SidebarItem
                      isSideBarOpen={sidebarOpen}
                      children={item.children}
                      onSelect={() => {
                        if (width < 768) {
                          setSidebarOpen(false);
                        }
                      }}
                    />
                  ) : (
                    <SidebarItem
                      key={item.href}
                      icon={item.icon}
                      href={item.href}
                      label={item.label}
                      onSelect={() => {
                        if (width < 768) {
                          setSidebarOpen(false);
                        }
                      }}
                      isSideBarOpen={sidebarOpen}
                      active={
                        // Check if current path starts with the item's base path
                        // This will make parent items stay active for their children routes
                        location.pathname.startsWith(item.href?.split("?")[0] || "") ||
                        // Special case for dashboard since it's the root
                        (item.href === DASHBOARD_URL && location.pathname === '/')
                      }
                    />
                  )}
                </React.Fragment>
              ))
            )}
          </nav>
        </View>

        {/* Sidebar Footer */}
        <View className="border-t border-white/10 dark:border-slate-700 p-4">
          <Button
            variant="ghost"
            onPress={() => {
              logoutHandler((_: boolean) => {});
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-white/80 dark:text-slate-300 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
          >
            <LogOut size={20} />
            {sidebarOpen && (
              <Text as="span" className="text-sm font-medium">
                Logout
              </Text>
            )}
          </Button>
        </View>
      </aside>
    )
  );
};

// const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
//   const location = useLocation();

//   const [width] = useWindowDimension();
//   const settingsData = useSelector(
//     (state: any) => state.systemSettings.settings
//   );

//   useEffect(() => {
//     if (width < 768) {
//       setSidebarOpen(false);
//     } else {
//       setSidebarOpen(true);
//     }
//   }, [width]);

//   const { logoutHandler } = useAuth();

//   // const sidebarItems = [
//   //   {
//   //     icon: <LayoutDashboard size={20} />,
//   //     label: "Dashboard",
//   //     href: DASHBOARD_URL,
//   //   },
//   //   {
//   //     icon: <Users size={20} />,
//   //     label: "Users",
//   //     href: USER_TABLE_URL + "?currentPage=1",
//   //   },
//   //   {
//   //     icon: <UserPlus size={20} />,
//   //     label: "Patients",
//   //     href: PATIENT_TABLE_URL + "?currentPage=1",
//   //   },
//   //   // {
//   //   //   icon: <Stethoscope size={20} />,
//   //   //   label: "OPD",
//   //   //   href: OPD_TABLE_URL + "?currentPage=1",
//   //   // },
//   //   {
//   //     icon: <CalendarClock size={20} />,
//   //     label: "Appointments",
//   //     href: APPOINTMENT_TABLE_URL + "?currentPage=1",
//   //   },
//   //   {
//   //     icon: <ClipboardList size={20} />,
//   //     label: "Consultations",
//   //     href: CONSULTATION_TABLE_URL + "?currentPage=1",
//   //   },
//   //   {
//   //     icon: <Activity size={20} />,
//   //     label: "Examinations",
//   //     href: EXAMINATION_TABLE_URL + "?currentPage=1",
//   //   },
//   //   {
//   //     icon: <Settings size={20} />,
//   //     label: "Settings",
//   //     href: SETTINGS_URL + "?tab=system-settings",
//   //   },
//   // ];

//   return (
//     sidebarOpen && (
//       <aside
//         // className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-primary-600 dark:bg-background text-card-foreground shadow-card dark:shadow-none transition-all duration-300 transition-colors md:static ${
//         //   sidebarOpen
//         //     ? width < 768
//         //       ? "w-full"
//         //       : "w-64"
//         //     : "w-0 -translate-x-full md:w-20 md:translate-x-0"
//         // }`}
//         className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-gradient-to-b from-primary-600 to-primary-700 dark:from-slate-900 dark:to-slate-800 text-card-foreground shadow-xl dark:shadow-2xl transition-all duration-300 md:static ${sidebarOpen
//             ? width < 768
//               ? "w-full"
//               : "w-64"
//             : "w-0 -translate-x-full md:w-20 md:translate-x-0"
//           }`}
//       >
//         {/* Sidebar Header */}
//         <View className="flex h-16 items-center justify-between gap-2 border-b border-white/10 dark:border-slate-700 px-4">
//           <Link to="/dashboard" className="flex items-center gap-2" style={{ width: "80%" }}>
//             {/* {sidebarOpen ? (
//               <Text
//                 as="h1"
//                 className="text-xl font-bold text-primary flex items-center gap-2"
//                 title={settingsData?.hospital_name}
//               >
//                 <img
//                   src={
//                     import.meta.env.VITE_APP_URL + settingsData?.hospital_logo
//                   }
//                   alt="Hospital Logo"
//                   className=" mr-2 bg-white"
//                   style={{ width: "200px", height: "40px" }}
//                 />
//               </Text>
//             ) : (
//               <View className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
//                 <Text
//                   as="span"
//                   className="text-sm font-bold text-primary-600"
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                 >
//                   M
//                 </Text>
//               </View>
//             )} */}
//             {sidebarOpen ? (
//               <View className="flex items-center gap-3 w-full h-full ">
//                 {settingsData?.hospital_logo ? (
//                   <div className="h-16 w-full overflow-hidden rounded-md shadow-md bg-white">
//                     <img
//                       src={import.meta.env.VITE_APP_URL + settingsData?.hospital_logo}
//                       alt="Hospital Logo"
//                       className="h-auto w-auto min-h-full min-w-full object-cover"
//                     />
//                   </div>
//                 ) : (
//                   <>
//                     <View className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
//                       <Text as="span" className="text-sm font-bold text-white">
//                         {settingsData?.hospital_name?.charAt(0)?.toUpperCase() || 'H'}
//                       </Text>
//                     </View>
//                     <Text
//                       as="h1"
//                       className="text-lg font-bold text-white truncate"
//                       title={settingsData?.hospital_name}
//                     >
//                       {settingsData?.hospital_name || 'Hospital'}
//                     </Text>
//                   </>

//                 )}

//               </View>
//             ) : (
//               <View className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-200">
//                 <Text
//                   as="span"
//                   className="text-sm font-bold text-white"
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                 >
//                   {settingsData?.hospital_name?.charAt(0)?.toUpperCase() || 'H'}
//                 </Text>
//               </View>
//             )}
//           </Link>
//           <Button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             // className="text-neutral-400 hover:text-white dark:hover:text-white"
//             className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
//             variant="ghost"
//           //   size="icon"
//           >
//             <PanelRightOpen size={20} />
//             {/* <Menu size={20} /> */}
//           </Button>
//           {/* <Button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="hidden rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 md:block "
//             variant="ghost"
//           >
//             <X className={`${sidebarOpen ? "block" : "hidden"}`} size={20} />
//           </Button> */}
//         </View>

//         {/* Sidebar Content */}
//         <View className="flex-1 overflow-y-auto py-6 px-2">
//           <nav className="space-y-2">
//             {sidebarItems.map((item, index) => (
//               <React.Fragment key={index}>
//                 {/* <Text as="p">
//                   {location.pathname.includes(item?.href ?? "")}
//                 </Text> */}
//                 {item?.children ? (
//                   <SidebarItem
//                     isSideBarOpen={sidebarOpen}
//                     children={item.children}
//                     onSelect={() => {
//                       if (width < 768) {
//                         setSidebarOpen(false);
//                       }
//                     }}
//                   />
//                 ) : (
//                   <SidebarItem
//                     key={item.href}
//                     icon={item.icon}
//                     href={item.href}
//                     label={item.label}
//                     onSelect={() => {
//                       if (width < 768) {
//                         setSidebarOpen(false);
//                       }
//                     }}
//                     isSideBarOpen={sidebarOpen}
//                     active={location.pathname.includes(
//                       item.href?.split("?")[0]
//                     )}
//                   />
//                 )}
//               </React.Fragment>
//             ))}
//           </nav>
//         </View>

//         {/* Sidebar Footer */}
//         <View className="border-t border-white/10 dark:border-slate-700 p-4">
//           <Button
//             variant="ghost"
//             onPress={() => {
//               logoutHandler((_: boolean) => { });
//             }}
//             // className="flex items-center gap-3 px-4 py-2 rounded-lg text-white dark:text-neutral-400 hover:bg-primary-background hover:text-primary transition-colors"
//             className="w-full flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-white/80 dark:text-slate-300 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
//           >
//             <LogOut size={20} />
//             {sidebarOpen && <Text as="span" className="text-sm font-medium">Logout</Text>}
//           </Button>
//         </View>
//       </aside>
//     )
//   );
// };

export default Sidebar;
