import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedProduct } from "../../features/product/productActions";

const ProductCategory = () => {
  const { products = [] } = useSelector((state) => state.products || {});
  const [userCategories, setUserCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    const filtered = products.filter(
      (product) => String(product.category_id) === String(categoryId)
    );
    dispatch(setSelectedProduct(filtered));
    navigate("/contactpage");
  };

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/categories/categories`);
        const data = await res.json();
        setUserCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    })();
  }, []);

  return (
    <>
      {/* Embedded CSS styles */}
      <style>{`
        .category-bar {
          display: flex;
          overflow-x: auto;
          white-space: nowrap;
          background-color: #fff;
          padding: 12px 16px;
          position: fixed;
          top: 50px;
          left: 0;
          right: 0;
          z-index: 1000;
          border-bottom: 1px solid #ccc;
        }

        .category-bar::-webkit-scrollbar {
          display: none;
        }

        .category-bar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .category-item {
          margin-right: 16px;
          font-size: 0.95rem;
          color: #000;
          cursor: pointer;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .category-logo {
          color: #78be20;
          font-weight: bold;
          font-size: 1.1rem;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .green-bar {
          background-color: #78be20;
          height: 5px;
          position: fixed;
          top: 45px;
          left: 0;
          right: 0;
          z-index: 1001;
        }
      `}</style>

      {/* Green bar */}
      <div className="green-bar" />

      {/* Scrollable category bar */}
      <div className="category-bar">
        <div className="category-logo">Rudra</div>
        {userCategories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductCategory;
