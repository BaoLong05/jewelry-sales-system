import HomePage from "../pages/Home/home";
import NotFound from "../pages/NotFound/NotFound";
const ProductRoute = {
  path: "/",
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
        path: "*",
        element:<NotFound/>
    }
  ],
};

export default ProductRoute;
