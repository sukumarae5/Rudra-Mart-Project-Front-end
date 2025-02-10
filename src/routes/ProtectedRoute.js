// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children, role }) => {
//   const token = localStorage.getItem("authToken");
//   const userRole = localStorage.getItem("userRole");

//   if (!token) return <Navigate to="/login" />;
//   if (role && userRole !== role) return <Navigate to="/" />; // Restrict access

//   return children;
// };

// export default PrivateRoute;
