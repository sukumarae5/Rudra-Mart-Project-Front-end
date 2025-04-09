import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchusersrequest } from "../../features/user/userActions";
import { fetchproductsrequest } from "../../features/product/productActions";
import { fetchOrdersRequest } from "../../features/order/orderActions";
import {
  fetchBestSellingProductsRequest,
  fetchTopCustomersRequest,
} from "../../features/admin/adminActions";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();

  // Fetch Data on Component Mount
  useEffect(() => {
    dispatch(fetchusersrequest());
    dispatch(fetchproductsrequest());
    dispatch(fetchOrdersRequest());
    dispatch(fetchBestSellingProductsRequest());
    dispatch(fetchTopCustomersRequest());
  }, [dispatch]);

  const { bestSellingProducts = [], topCustomers = [] } = useSelector(
    (state) => state.admindashboard
  );
 console.log(bestSellingProducts)
  return (
    <Container>
      {/* Best Selling Products & Top Customers */}
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {/* Best Selling Products */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 5, borderRadius: 3, bgcolor: "#FFF" }}>
            <CardContent>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: "bold", color: "#444" }}
              >
                Best Selling Products
              </Typography>
              <Table>
                <TableHead sx={{ bgcolor: "#1976D2" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFF" }}>
                      Rank
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFF" }}>
                      Image
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFF" }}>
                      Product Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFF" }}>
                      Total Sold
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestSellingProducts.slice(0, 5).map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
  <img
    src={product.image_url}
    alt={product.name}
    style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "50%" }}
  />
</TableCell>

                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.total_sold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Top 5 Customers */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 5, borderRadius: 3, bgcolor: "#FFF" }}>
            <CardContent>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: "bold", color: "#444" }}
              >
                Top 5 Customers (Most Orders)
              </Typography>
              <Table>
                <TableHead sx={{ bgcolor: "#D32F2F" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFF" }}>
                      Rank
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFF" }}>
                      Customer Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFF" }}>
                      Orders Placed
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topCustomers.slice(0, 5).map((customer, index) => (
                    <TableRow key={customer.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.orderCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardPage;
