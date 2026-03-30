import HomePage from "../pages/Home/home";
import NotFound from "../pages/NotFound/NotFound";
import Cart from "../pages/Cart/cart";
import ProductDetails from '../pages/ProductDetail/ProductDetail';
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
    },
    {
      path: "/product/:id",
      element: <ProductDetails/>
    }
  ],
};

export default ProductRoute;
