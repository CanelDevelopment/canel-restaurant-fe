import { Sidebar } from "@/components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};
