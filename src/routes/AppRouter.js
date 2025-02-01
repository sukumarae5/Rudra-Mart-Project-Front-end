import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/Layout/AppLayout";

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
        path: "/cartPage",
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
        path: "/useraccontpage",
        element: <UserAccontPage />,
        children: [
          {
            path: "userprofile",  // Remove the leading slash
            element: <UserProfile />,
          },
        ],
      },
      {
        path: "/admin",
        element: (
            <AdminHeader />
        ),
        children: AdminRoute,
      },
    ],
  },
    
  
 
]);

export default AppRouter;
