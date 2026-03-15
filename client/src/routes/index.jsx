import { createBrowserRouter } from "react-router-dom";
import LoginRoutes from "./LoginRoutes";
import ProductRoute from "./ProductRoute";

const router = createBrowserRouter(
  [
    LoginRoutes,
    ProductRoute
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME || "/"
  }
);

export default router;