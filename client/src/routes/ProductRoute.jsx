import HomePage from "../pages/Home/home";
import NotFound from "../pages/NotFound/NotFound";
import Cart from "../pages/Cart/cart";
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
    },
    {
      path: "/Cart",
      element: <Cart/>
    }
  ],
};

export default ProductRoute;
