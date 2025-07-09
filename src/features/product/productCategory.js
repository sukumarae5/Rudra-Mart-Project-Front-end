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

  const { categoryproduct = [], loading, error } = useSelector(
    (state) => state.categoryproducts || {}
  );

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

  const visibleCategories = userCategories.slice(0, 5);
  const hiddenCategories = userCategories.slice(5);

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
          top: 5px;
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

        .more-dropdown {
          position: absolute;
          top: 60px;
          right: 16px;
          background: white;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 10px;
          z-index: 2000;
        }

        .more-item {
          padding: 6px 12px;
          cursor: pointer;
          color: #333;
          white-space: nowrap;
        }

        .more-item:hover {
          background-color: #f0f0f0;
        }

        .category-wrapper {
          margin-top: 70px;
        }

        .dots-button {
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          margin-left: 8px;
        }
      `}</style>

      {/* Green Top Bar */}
      <div className="green-bar" />

      {/* Fixed Horizontal Scrollable Category Bar */}
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

        {hiddenCategories.length > 0 && (
          <div className="dots-button" onClick={() => setShowMore(!showMore)}>
            ...
          </div>
        )}

        {showMore && (
          <div className="more-dropdown">
            {hiddenCategories.map((category) => (
              <div
                key={category.id}
                className="more-item"
                onClick={() => {
                  handleCategoryClick(category.id);
                  setShowMore(false);
                }}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="category-wrapper" />
    </>
  );
};

export default ProductCategory;
