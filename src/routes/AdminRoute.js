import AddBannerForm from "../components/AdminPane/AddBannerForm";
import AddCategoryForm from "../components/AdminPane/AddCategoryForm";
import AddProductForm from "../components/AdminPane/AddProductForm";
import AddSubcategoryForm from "../components/AdminPane/AddSubcategoryForm";
import AddUserForm from "../components/AdminPane/AddUserForm";
import AdminBanners from "../components/AdminPane/AdminBanners";
import AdminCategories from "../components/AdminPane/AdminCategories";
import AdminInbox from "../components/AdminPane/AdminInbox";
import AdminSubcategories from "../components/AdminPane/AdminSubCategories";
import CategoryCard from "../components/AdminPane/CategoryCard";
import Dashboard from "../components/AdminPane/Dashboard";
import EditCategoryForm from "../components/AdminPane/EditCategoryForm";
import EditOrdersForm from "../components/AdminPane/EditOrdersForm";
import EditProductForm from "../components/AdminPane/EditProductForm";
import EditSubcategoryForm from "../components/AdminPane/EditSubcateoryForm";
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
    path: "editproduct/:id", 
    element: <EditProductForm />,
  },
  {
    path: "editcategoryform/:id", 
    element: <EditCategoryForm />,
  },
  {
    path: "editsubcategoryform/:id", 
    element: <EditSubcategoryForm />,
  },
  {
    path: "editorders", 
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
    path:"addcategoryform",
    element:<AddCategoryForm />
  },
  {
    path:"addsubcategoryform",
    element:<AddSubcategoryForm />
  },
  {
    path:"categories",
    element:<AdminCategories/>
  },
  {
    path:"adminbanners",
    element:<AdminBanners/>
  },
  {
    path:"addbanners",
    element:<AddBannerForm/>
  },
  {
    path:"subcategories",
    element:<AdminSubcategories/>
  },
  {
    path:"categoriesproducts",
    element:<CategoryCard/>
  },{
    path:"adminprofile",
    element:<AdminProfileSettingPage/>
  },{
    path:"adminreports",
    element:<AdminReportsPage/>
  },
  {
    path:"admininbox",
    element:<AdminInbox/>
  },
];

export default AdminRoute;
