import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsWithCategoryRequest,
  setSelectedProduct,
} from "../product/productActions";

const ProductCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryData = useSelector((state) => state.categoryproducts);
  const categoryproduct = Array.isArray(categoryData?.categoryproduct)
    ? categoryData.categoryproduct
    : [];
  const loading = categoryData?.loading;
  const error = categoryData?.error;

  const [userCategories, setUserCategories] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsWithCategoryRequest());
  }, [dispatch]);

  useEffect(() => {
    if (categoryproduct.length > 0) {
      const categoriesMap = {};
      categoryproduct.forEach((product) => {
        if (!categoriesMap[product.id]) {
          categoriesMap[product.id] = {
            id: product.id,
            name: product.name,
          };
        }
      });
      setUserCategories(Object.values(categoriesMap));
    }
  }, [categoryproduct]);

  const handleCategoryClick = (categoryId) => {
    const filtered = categoryproduct.filter(
      (product) => String(product.id) === String(categoryId)
    );
    dispatch(setSelectedProduct(filtered));
    navigate("/contactpage");
  };

  const visibleCategories = showMore
    ? userCategories
    : userCategories.slice(0, 5);

  return (
    <>
      <style>{`
        .green-bar {
          background-color: #78be20;
          height: 5px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1001;
        }

        .category-bar {
          display: flex;
          overflow-x: auto;
          white-space: nowrap;
          background-color: #fff;
          padding: 12px 16px;
          position: fixed;
          top: 65px;
          left: 0;
          right: 0;
          z-index: 1000;
          border-bottom: 1px solid #ccc;
          height: 60px;
          align-items: center;
        }

        .category-bar::-webkit-scrollbar {
          height: 8px;
        }

        .category-bar::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 4px;
        }

        .category-bar {
          -ms-overflow-style: auto;
          scrollbar-width: thin;
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

        .dots-button {
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          margin-left: 8px;
          color: #666;
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
          user-select: none;
        }

        .category-wrapper {
          margin-top: 130px; /* Push content down */
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .category-bar {
            top: 55px;
            height: 50px;
            padding: 8px 12px;
          }

          .category-item {
            font-size: 0.85rem;
            margin-right: 12px;
          }

          .category-logo {
            font-size: 1rem;
            margin-right: 12px;
          }

          .dots-button {
            font-size: 16px;
            padding: 3px 6px;
          }

          .category-wrapper {
            margin-top: 110px;
          }
        }
      `}</style>

      {/* Green Top Bar */}
      <div className="green-bar" />

      {/* Category Bar */}
      <div className="category-bar">
        <div className="category-logo">Rudra</div>

        {visibleCategories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </div>
        ))}

        {userCategories.length > 5 && (
          <div className="dots-button" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Show Less" : "..."}
          </div>
        )}
      </div>

      {/* Page Content Spacer */}
      <div className="category-wrapper" />
    </>
  );
};

export default ProductCategory;
