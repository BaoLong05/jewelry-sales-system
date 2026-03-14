import { lazy } from "react";

const RegisterPage = lazy(() => import("../pages/Register/register"));


const LoginRoutes = {
  path: "/",
  children: [
    {
      path: "register",
      element: <RegisterPage />
    }
  ]
};

export default LoginRoutes;