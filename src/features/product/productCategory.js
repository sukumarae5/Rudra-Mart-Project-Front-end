import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaMugHot,
  FaHome,
  FaGamepad,
  FaLeaf,
  FaStore,
  FaCookieBite,
  FaIceCream,
  FaBreadSlice,
} from "react-icons/fa";
import { setSelectedProduct } from "../../features/product/productActions";

const ProductCategory = () => {
  const { products = [] } = useSelector((state) => state.products || {});
  const [userCategories, setUserCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryIcons = [
    { icon: <FaMugHot />, label: "Cafe", id: "1" },
    { icon: <FaHome />, label: "Home", id: "2" },
    { icon: <FaGamepad />, label: "Toys", id: "3" },
    { icon: <FaLeaf />, label: "Fruits", id: "4" },
    { icon: <FaStore />, label: "Dairy", id: "5" },
    { icon: <FaCookieBite />, label: "Snacks", id: "6" },
    { icon: <FaIceCream />, label: "Cold Drinks", id: "7" },
    { icon: <FaBreadSlice />, label: "Biscuits", id: "8" },
  ];

  const handleCategoryClick = (categoryid) => {
    const filtered = products.filter(
      (product) => String(product.category_id) === String(categoryid)
    );
    dispatch(setSelectedProduct(filtered));
    navigate("/contactpage");
  };

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("http://192.168.1.9:8082/api/categories/categories");
        const data = await res.json();
        setUserCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    })();
  }, []);

  return (
    <div
      className="hide-scrollbar"
      style={{
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        scrollBehavior: "smooth",
        backgroundColor: "#fff",

        padding: "20px 10px",
        justifyContent: "center",
        position: "fixed",
        top: 40,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: "1px solid #ccc",
        height:"15%",
      
      }}
    >
      {categoryIcons.map((cat, index) => (
        <div
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id)}
          style={{
            flexShrink: 0,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              fontSize: "20px",
            }}
          >
            {cat.icon}
          </div>
          <p style={{ fontSize: "12px", marginTop: "8px" }}>
            {userCategories[index]?.name || cat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductCategory;
