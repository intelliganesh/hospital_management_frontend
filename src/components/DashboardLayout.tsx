import React, { useState } from "react";

// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   UserPlus,
//   Menu,
//   X,
//   Bell,
//   Search,
//   LogOut,
//   // Settings

// } from "lucide-react";

// interface SidebarItemProps {
//   icon?: React.ReactNode;
//   label: string;
//   href: string;
//   active: boolean;
// }

// const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, active }) => {
//   return (
//     <Link
//       to={href}
//       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//         active
//           ? "bg-primary-50 text-primary-600 font-medium"
//           : "text-text-light hover:bg-neutral-100"
//       }`}
//     >
//       <div className="text-current">{icon}</div>
//       <span>{label}</span>
//     </Link>
//   );
// };

// import { Menu } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import View from "./view";
import { useQuickKeys } from "@/utils/custom-hooks/useQuickKeys";
import QuickKeysModal from "./QuickKeysModal";
interface DashboardLayoutProps {
  children: React.ReactNode;
  mainCompClasses?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, mainCompClasses }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const location = useLocation();

  // const sidebarItems = [
  //   {
  //     icon: <LayoutDashboard size={20} />,
  //     label: "Dashboard",
  //     href: "/dashboard"
  //   },
  //   {
  //     icon: <Users size={20} />,
  //     label: "Users",
  //     href: "/dashboard/users"
  //   },
  //   {
  //     icon: <UserPlus size={20} />,
  //     label: "Patients",
  //     href: "/dashboard/patients"
  //   }
  // ];

  // return (
  //   <div className="flex h-screen bg-secondary">
  //     {/* Sidebar */}
  //     <aside
  //       className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-white shadow-card transition-all duration-300 md:static ${
  //         sidebarOpen ? "w-64" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
  //       }`}
  //     >
  //       {/* Sidebar Header */}
  //       <div className="flex h-16 items-center justify-between gap-2 border-b border-neutral-200 px-4">
  //         <Link to="/dashboard" className="flex items-center gap-2">
  //           {sidebarOpen ? (
  //             <h1 className="text-xl font-bold text-primary-600">MedCare</h1>
  //           ) : (
  //             <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
  //               <span className="text-sm font-bold text-primary-600">M</span>
  //             </div>
  //           )}
  //         </Link>
  //         <button
  //           onClick={() => setSidebarOpen(!sidebarOpen)}
  //           className="hidden rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 md:block"
  //         >
  //           {/* {sidebarOpen ? <p>Hide Sidebar</p> : <p>Show Sidebar</p>} */}
  //           {sidebarOpen ? <X size={20} /> :  <Menu size={20} />}
  //         </button>
  //       </div>

  //       {/* Sidebar Content */}
  //       <div className="flex-1 overflow-y-auto py-4 px-3">
  //         <nav className="space-y-1">
  //           {sidebarItems.map((item) => (
  //             <SidebarItem
  //               key={item.href}
  //               icon={item.icon}
  //               label={item.label}
  //               href={item.href}
  //               active={location.pathname === item.href}
  //             />
  //           ))}
  //         </nav>
  //       </div>

  //       {/* Sidebar Footer */}
  //       <div className="border-t border-neutral-200 p-4">
  //         <Link
  //           to="/login"
  //           className="flex items-center gap-3 px-4 py-2 rounded-lg text-text-light hover:bg-neutral-100 transition-colors"
  //         >
  //           <LogOut size={20} />
  //           {sidebarOpen && <span>Logout</span>}
  //         </Link>
  //       </div>
  //     </aside>

  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { isModalOpen, closeModal, openModal } = useQuickKeys();

  return (
    // <View className="flex h-screen bg-background transition-colors duration-200 ">
    <View className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <QuickKeysModal isOpen={isModalOpen} onClose={closeModal} />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <View className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} openQuickKeys={openModal} />

        {/* Page Content */}
        {/* <main className={`flex-1 overflow-y-auto p-4 md:px-6 text-foreground transition-colors duration-200 bg-primary-10 dark:bg-transparent ${mainCompClasses}`}>{children}</main> */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 text-foreground transition-colors duration-200 bg-slate-50 dark:bg-slate-900 ${mainCompClasses}`}>
          <View className=" mx-auto">
            {children}
          </View>
        </main>
      </View>
    </View>
  );
};

export default DashboardLayout;
