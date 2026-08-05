import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import ExpiredLink from "./pages/LinkExpired";
import Register from "@/pages/forms/userForm/user";
import Login from "@/pages/forms/authentication/login";
import ResetPassword from "@/pages/forms/authentication/ResetPassword";
import ForgotPassword from "@/pages/forms/authentication/ForgotPassword";
import {
  USER_URL,
  LOGIN_URL,
  FIRST_PAGE_URL,
  LINK_EXPIRED_URL,
  RESET_PASSWORD_URL,
  FORGOT_PASSWORD_URL,
} from "./utils/urls/frontend";

const WithoutLogin: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path={FIRST_PAGE_URL} element={<Login />} />
      <Route path={LOGIN_URL} element={<Login />} />
      <Route path={RESET_PASSWORD_URL + "/:hash"} element={<ResetPassword />} />
      <Route path={USER_URL} element={<Register />} />
      <Route path={FORGOT_PASSWORD_URL} element={<ForgotPassword />} />
      <Route path={LINK_EXPIRED_URL} element={<ExpiredLink />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default WithoutLogin;
