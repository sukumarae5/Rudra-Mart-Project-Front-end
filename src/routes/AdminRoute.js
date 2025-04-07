import AddProductForm from "../components/AdminPane/AddProductForm";
import AddUserForm from "../components/AdminPane/AddUserForm";
import AdminCategories from "../components/AdminPane/AdminCategories";
import CategoryCard from "../components/AdminPane/CategoryCard";
import Dashboard from "../components/AdminPane/Dashboard";
import EditOrdersForm from "../components/AdminPane/EditOrdersForm";
import EditProductForm from "../components/AdminPane/EditProductForm";
import EditUserForm from "../components/AdminPane/EditUserForm";
import OrderTable from "../components/AdminPane/OrderTable";
import ProductTable from "../components/AdminPane/ProductTable";
import UserTable from "../components/AdminPane/UserTable";
import AdminProfileSettingPage from "../pages/AdminPages/AdminProfileSettingsPage";
import AdminReportsPage from "../pages/AdminPages/AdminReportsPage";

const AdminRoute = [
  {
    path: "admindashboard",  
    element: <Dashboard />,
  },
  {
    path: 'adminusers',
    element: <UserTable />,
  },
  {
    path: "adminproducts",
    element: <ProductTable />,
  },
  {
    path: "adminorders",
    element: <OrderTable/>
  },
  {
    path: 'edituser',
    element: <EditUserForm />,
  },
  {
    path: "editproduct", // Nested route
    element: <EditProductForm />,
  },
  {
    path: "editorders", // Nested route
    element: <EditOrdersForm />,
  },
  {
    path:"addusers",
    element:<AddUserForm/>
  },
  {
    path:"addproducts",
    element:<AddProductForm />
  },{
    path:"categories",
    element:<AdminCategories/>
  },{
    path:"categoriesproducts",
    element:<CategoryCard/>
  },{
    path:"adminprofile",
    element:<AdminProfileSettingPage/>
  },{
    path:"adminreports",
    element:<AdminReportsPage/>
  }
];

export default AdminRoute;
