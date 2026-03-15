import { lazy } from "react";

const RegisterPage = lazy(() => import("../pages/Register/register"));
import LoginPage from '../pages/Login/login';

const LoginRoutes = {
  path: "/",
  children: [
    {
      path: "register",
      element: <RegisterPage />
    },
    {
      path:"login",
      element: <LoginPage/>
    }
  ]
};

export default LoginRoutes;