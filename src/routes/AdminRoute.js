import AddProductForm from "../components/AdminPane/AddProductForm";
import AddUserForm from "../components/AdminPane/AddUserForm";
import Dashboard from "../components/AdminPane/Dashboard";
import EditProductForm from "../components/AdminPane/EditProductForm";
import EditUserForm from "../components/AdminPane/EditUserForm";
import ProductTable from "../components/AdminPane/ProductTable";
import UserTable from "../components/AdminPane/UserTable";

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
    path: 'edituser',
    element: <EditUserForm />,
  },
  {
    path: "editproduct", // Nested route
    element: <EditProductForm />,
  },
  {
    path:"addusers",
    element:<AddUserForm/>
  },
  {
    path:"addproducts",
    element:<AddProductForm />
  }
];

export default AdminRoute;
