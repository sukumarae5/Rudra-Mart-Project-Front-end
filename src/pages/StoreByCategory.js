import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryTitlesRequest } from '../features/categorytitle/categoryActions';
import { useNavigate } from 'react-router-dom';

const StoreByCategory = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()

  const { titles = [] } = useSelector((state) => state.categorytitle);
  const { categoryproduct = [], loading, error } = useSelector(
    (state) => state.categoryproducts || {}
  );

  useEffect(() => {
    dispatch(fetchCategoryTitlesRequest());
  }, [dispatch]);

  const filteredProducts = categoryproduct.filter(
    (product) => product.category_title_id === 4
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
   const handleCategoryClick = (categoryId, categoryName) => {
    navigate("/subcategories", { state: { categoryId, categoryName } });
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f1ffe0', marginBottom: '1%' }}>
      <h2
        style={{
          fontSize: '28px',
          marginBottom: '25px',
          color: '#2b2b2b',
          fontWeight: 'bold',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Shop by Categories
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '30px',
          justifyItems: 'center',
        }}
      >
        {filteredProducts.map((item) => (
          <div
            key={item.id}
                          onClick={() => handleCategoryClick(item.id, item.name)}       

            style={{
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div
              style={{
                backgroundColor: '#b3e864',
                borderRadius: '50%',
                width: '200px',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={item.image_url}
                alt={item.name}
                style={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                  objectFit: 'contain',
                  borderRadius:"20%"
                }}
              />
            </div>
            <h4
              style={{
                fontSize: '25px',
                marginTop: '15px',
                color: '#222',
                fontWeight: '600',
              }}
            >
              {item.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreByCategory;
