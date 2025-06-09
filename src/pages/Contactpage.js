import React from "react";
import { useSelector } from "react-redux";

const Contactpage = () => {
  const { products = [] } = useSelector((state) => state.products || {});
console.log("productsdisplay",products)
  return (
    <div style={{ paddingTop: "140px", padding: "20px 60px" }}>
      <h2 style={{ marginBottom: "20px" }}>Products</h2>
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          scrollBehavior: "smooth",
          paddingBottom: "10px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              flex: "0 0 calc(100% / 8 - 20px)",
              maxWidth: "calc(100% / 8 - 20px)",
              minWidth: "160px",
              padding: "15px",
              border: "none",
              borderRadius: "8px",
              background: "rgb(245, 245, 245)",
              textAlign: "center",
              position: "relative",
              height: "150px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              src={product.image_url || "default-image.jpg"}
              alt={product.name}
              style={{
                width: "80%",
                padding: "10px",
                height: "100px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
            <h1
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                margin: "0",
                paddingTop: "5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
              title={product.name}
            >
              {product.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contactpage;