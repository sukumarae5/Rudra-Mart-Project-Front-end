import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/Layout/AppLayout";
import UserCheckOutpage from "../pages/UserAccontDetialsPage/UserCheckOutpage";
import HomePage from "../pages/HomePage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import SearchPage from "../pages/SearchPage";
import UserAccontPage from "../pages/UserAccontDetialsPage/UserAccontpage";
import UserProfile from "../pages/UserAccontDetialsPage/UserProfile";
import AdminHeader from "../components/AdminPane/AdminHeader";
import AdminRoute from "./AdminRoute";
import Contactpage from "../pages/Contactpage";
import WishListpage from "../pages/UserAccontDetialsPage/WishListpage";
const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        index: true,
      },
      {
        path: "/contactpage",
        element: <Contactpage />,
      },
      {
        path: "/cartpage",
        element: <CartPage />,
      },
      {
        path: "/searchpage",
        element: <SearchPage />,
      },
      {
        path: "/signup",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/productpage",
        element: <ProductPage />,
      },
      {
        path: "/wishlistpage",
        element: <WishListpage />,
      },
      {
        path: "/useraccountpage",
        element: <UserAccontPage />,
        children: [
          {
            path: "userprofile",
            element: <UserProfile />,
          },
          {
            path: "usercheckoutpage",
            element: <UserCheckOutpage />,
          },
        ],
      },
      {
        path: "/admin",
        element: <AdminHeader />,
        children: AdminRoute,
      },
    ],
  },
]);
export default AppRouter;
