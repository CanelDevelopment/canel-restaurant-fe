import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/signin.page";
import Home from "./pages/home.page";
import Locationform from "./pages/locationform.page";
import Checkout from "./pages/checkout.page";
import Order from "./pages/order.page";
import AdminSignin from "./pages/adminsignin.page";
import DashboardPage from "./pages/dashboard.page";
import IncomingOrderspage from "./pages/incomingorders.page";
import { DashboardLayout } from "./layouts/dashboard.layout";
import PointOfSale from "./pages/pointofsale.page";
import CustomerList from "./pages/customerlist.page";
import FoodItemPage from "./pages/fooditem.page";
import AddonCategory from "./pages/addoncategory.page";
import AddonItem from "./pages/addonitem.page";
import AddonNewItem from "./pages/addonnewitem.page";
import BranchManagement from "./pages/branchmanagement.page";
import StaffManagement from "./pages/staffmanagement.page";

import RoleManagement from "./pages/rolemanagement.page";
import AddRole from "./pages/addrole.page";
import Business from "./pages/business.page";
import BusinessNameInfo from "./pages/businessname.page";
import BusinessHours from "./pages/businesshours.page";
import BusinessPassword from "./pages/businesspassword.page";
import ProfileBanner from "./pages/profilebanner.page";
import NotFoundPage from "./pages/notfound.page";
import { ProtectedRoute, PublicOnlyRoute } from "./layouts/protectedroute";
import {
  AdminProtectedRoute,
  PublicAdminRoute,
} from "./layouts/adminprotectedroute";
import NewCategory from "./pages/newcategory.page";
import Category from "./pages/category.page";
import NewItem from "./pages/newitem.page";
import NewBranch from "./pages/newbranch.page";
import NewStaff from "./pages/newstaff.page";
import NewAddonCategory from "./pages/newaddoncategory.page";
import VerifyEmailPage from "./pages/verifyemail.page";
import ForgotPasswordPage from "./pages/forgotpassword.page";
import ResetPasswordPage from "./pages/reset.page";

// For deployment, is was being written
export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="home"
          element={
            // <ProtectedRoute>
            <Home />
            // </ProtectedRoute>
          }
        />
        <Route
          index
          path="signin"
          element={
            <PublicOnlyRoute>
              <Signin />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            // <ProtectedRoute>
            <Locationform />
            // </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="place-order/:id"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
        {/* Admin sides */}
        <Route
          path="admin-signin"
          element={
            <PublicAdminRoute>
              <AdminSignin />
            </PublicAdminRoute>
          }
        />

        {/* Reset password Pages  */}
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/dashboard"
          element={
            <AdminProtectedRoute>
              <DashboardLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="incoming_orders" element={<IncomingOrderspage />} />
          <Route path="point_of_sale" element={<PointOfSale />} />
          <Route path="customer_list" element={<CustomerList />} />
          {/* Food Category */}
          <Route path="food_category" element={<Category />} />
          <Route path="add_new_category" element={<NewCategory />} />
          {/* Food Item */}
          <Route path="food_item" element={<FoodItemPage />} />
          <Route path="add_new_item" element={<NewItem />} />
          {/* Addon Category */}
          <Route path="addon_category" element={<AddonCategory />} />
          <Route path="add_addon_category" element={<NewAddonCategory />} />
          {/* Addon Item */}
          <Route path="addon_item" element={<AddonItem />} />
          <Route path="add_new_addon_item" element={<AddonNewItem />} />
          {/* Branch Management */}
          <Route path="branch_management" element={<BranchManagement />} />
          <Route
            path="branch_management/add_new_branch"
            element={<NewBranch />}
          />
          {/* Staff Management */}
          <Route path="staff_management" element={<StaffManagement />} />
          <Route path="staff_management/add_new_staff" element={<NewStaff />} />
          {/* Role Management */}
          <Route path="role_management" element={<RoleManagement />} />
          <Route path="role_management/add_new_role" element={<AddRole />} />
          {/* Business Pages */}
          <Route path="business_settings" element={<Business />} />
          <Route path="business_name_info" element={<BusinessNameInfo />} />
          <Route path="business_hours" element={<BusinessHours />} />
          <Route path="business_password" element={<BusinessPassword />} />
          <Route path="profile_banner" element={<ProfileBanner />} />
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
