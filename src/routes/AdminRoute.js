import AddBannerForm from "../components/AdminPane/AddBannerForm";
import AddCategoryForm from "../components/AdminPane/AddCategoryForm";
import AddDeliveryBoy from "../components/AdminPane/AddDeliveryBoy";
import AddProductForm from "../components/AdminPane/AddProductForm";
import AddSubcategoryForm from "../components/AdminPane/AddSubcategoryForm";
import AddUserForm from "../components/AdminPane/AddUserForm";
import AdminBanners from "../components/AdminPane/AdminBanners";
import AdminCategories from "../components/AdminPane/AdminCategories";
import AdminCategoryTitle from "../components/AdminPane/AdminCategoryTitle";
import AdminDeliveryPage from "../components/AdminPane/AdminDeliveryPage";
import AdminInbox from "../components/AdminPane/AdminInbox";
import AdminSubcategories from "../components/AdminPane/AdminSubCategories";
import CategoryTitleForm from "../components/AdminPane/CategoryTitleForm";
import Dashboard from "../components/AdminPane/Dashboard";
import EditCategoryForm from "../components/AdminPane/EditCategoryForm";
import EditDeliveryPage from "../components/AdminPane/EditDelivereyPage";
import EditDeliveryBoy from "../components/AdminPane/EditDeliveryBoy";
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
    path: "adminusers",
    element: <UserTable />,
  },
  {
    path: "adminproducts",
    element: <ProductTable />,
  },
  {
    path: "adminorders",
    element: <OrderTable />,
  },
  {
    path: "edituser",
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
    path: "add-delivery-boy",
    element: <AddDeliveryBoy />,
  },
  {
    path: "edit-delivery-boy/:id",
    element: <EditDeliveryBoy />,
  },
  {
    path: "editdelivery/:id",
    element: <EditDeliveryPage />,
  },
  {
    path: "editorders",
    element: <EditOrdersForm />,
  },
  {
    path: "addusers",
    element: <AddUserForm />,
  },
  {
    path: "addproducts",
    element: <AddProductForm />,
  },
  {
    path: "addcategoryform",
    element: <AddCategoryForm />,
  },
  {
    path: "addsubcategoryform",
    element: <AddSubcategoryForm />,
  },
  {
    path: "categories",
    element: <AdminCategories />,
  },
  {
    path: "adminbanners",
    element: <AdminBanners />,
  },
  {
    path: "admindeliverypage",
    element: <AdminDeliveryPage />,
  },
  {
    path: "addbanners",
    element: <AddBannerForm />,
  },
  {
    path: "CategoryTitleForm",
    element: <CategoryTitleForm />,
  },
  {
    path: "AdminCategoryTitle",
    element: <AdminCategoryTitle />,
  },
  {
    path: "subcategories",
    element: <AdminSubcategories />,
  },

  {
    path: "adminprofile",
    element: <AdminProfileSettingPage />,
  },
  {
    path: "adminreports",
    element: <AdminReportsPage />,
  },
  {
    path: "admininbox",
    element: <AdminInbox />,
  },
];

export default AdminRoute;
