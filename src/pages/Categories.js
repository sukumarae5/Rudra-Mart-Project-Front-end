import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Categories = () => {
  const { products = [], loading, error } = useSelector((state) => state.products || {});
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 23, minutes: 59, seconds: 59 });

  const currentDate = new Date().getDate();
  const dailyProduct = products.length > 0 ? products[currentDate % products.length] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
          return prevTime;
        }

        if (seconds > 0) {
          return { ...prevTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { ...prevTime, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { ...prevTime, hours: hours - 1, minutes: 59, seconds: 59 };
        } else if (days > 0) {
          return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        }

        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container bg-dark text-light p-5 rounded my-5">
      <div className="row align-items-center">
        {/* Left Side: Text Content */}
        <div className="col-lg-6 d-flex flex-column align-items-center align-items-lg-start text-center text-lg-start">
          <p className="text-success">Categories</p>
          <h1>Enhance Your</h1>
          <h1>Music Experience</h1>

          {/* Countdown Timer */}
          <div className="d-flex justify-content-center justify-content-lg-start gap-3 mt-3">
            {Object.entries(timeLeft).map(([key, value], index) => (
              <div
                key={index}
                className="text-center d-flex flex-column align-items-center justify-content-center p-3 bg-light text-dark"
                style={{
                  borderRadius: "60px",
                  fontSize: "12px",
                  width: "60px",
                  height: "60px",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>{value}</span>
                <span
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    color: "#6c757d",
                  }}
                >
                  {key}
                </span>
              </div>
            ))}
          </div>

          {/* Button */}
          <button className="btn btn-success mt-4 px-4 py-2">Buy Now!</button>
        </div>

        {/* Right Side: Daily Product Image */}
        <div className="col-lg-6 d-flex justify-content-center mt-4 mt-lg-0">
          {dailyProduct && (
            <img
              src={dailyProduct.image_url}
              alt={dailyProduct.name}
              className="img-fluid rounded"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
