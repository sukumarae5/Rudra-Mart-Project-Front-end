import React from "react";
import { Row, Col, Badge, Container } from "react-bootstrap";
import { TbTruckDelivery } from "react-icons/tb";
import { MdLocalOffer } from "react-icons/md";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";
import { RiCustomerServiceLine } from "react-icons/ri";

import newarivelpageimage from "../assets/images/newarivelpageimage.png";
import newarivelpageimage1 from "../assets/images/newarivelpageimage1.png";
import newarivelpageimage2 from "../assets/images/newarivelpageimage2.png";
import newarivelpageimage3 from "../assets/images/newarivelpageimage3.png";
import { Link } from "react-router-dom";

const NewArrivalpage = () => {
  const iconData1 = [
    {
      icon: <TbTruckDelivery />,
      title: "10-Minute Delivery",
      heading: "Lightning fast doorstep delivery",
    },
    {
      icon: <MdLocalOffer />,
      title: "Best Prices & Offers",
      heading: "Stay on budget, every time",
    },
    {
      icon: <AiTwotoneSafetyCertificate />,
      title: "Quality Assurance",
      heading: "Only the highest quality products",
    },
    {
      icon: <RiCustomerServiceLine />,
      title: "24/7 Customer Support",
      heading: "Always here to help you",
    },
  ];

  return (
    <div className="container py-4">
      {/* New Arrival Title */}
    

      {/* New Arrival Cards */}
      {/* <Row className="mt-4 g-4">
        <Col lg={6}>
          <div
            className="position-relative overflow-hidden rounded shadow"
            style={{ background: "black" }}
          >
            <img
              src={newarivelpageimage1}
              alt="PlayStation 5"
              className="img-fluid"
            />
            <div
              className="position-absolute bottom-0 text-white p-3"
              style={{ width: "100%" }}
            >
              <h2>PlayStation 5</h2>
              <p>Black and White version of the PS5 coming out on sale.</p>
              <h4 className="text-decoration-underline">Shop Now</h4>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <Row className="g-4">
            <Col lg={12}>
              <div
                className="position-relative overflow-hidden rounded shadow"
                style={{ background: "black" }}
              >
                <img
                  src={newarivelpageimage3}
                  alt="Women's Collections"
                  className="img-fluid"
                />
                <div
                  className="position-absolute bottom-0 text-white p-3"
                  style={{ width: "100%" }}
                >
                  <h2>Women’s Collections</h2>
                  <p>Featured woman collections that give you another vibe.</p>
                  <h4 className="text-decoration-underline">Shop Now</h4>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div
                className="position-relative overflow-hidden rounded shadow"
                style={{ background: "black" }}
              >
                <img
                  src={newarivelpageimage}
                  alt="Speakers"
                  className="img-fluid"
                />
                <div
                  className="position-absolute bottom-0 text-white p-3"
                  style={{ width: "100%" }}
                >
                  <h2>Speakers</h2>
                  <p>Amazon wireless speakers</p>
                  <h4 className="text-decoration-underline">Shop Now</h4>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div
                className="position-relative overflow-hidden rounded shadow"
                style={{ background: "black" }}
              >
                <img
                  src={newarivelpageimage2}
                  alt="Perfume"
                  className="img-fluid"
                />
                <div
                  className="position-absolute bottom-0 text-white p-3"
                  style={{ width: "100%" }}
                >
                  <h2>Perfume</h2>
                  <p>GUCCI INTENSE OUD EDP</p>
                  <h4 className="text-decoration-underline">Shop Now</h4>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row> */}

      {/* Why Choose Us - Heading */}
     <Row className="mt-5">
  <Col className="text-center">
    <h1 className="fw-bold text-dark mb-4" style={{ fontSize: "25px" }}>
      Why Choose Flash Cart?
    </h1>
  </Col>
</Row>


      {/* Icons Row */}
      <Row className="justify-content-between text-center">
        {iconData1.map((item, index) => (
          <Col key={index} lg={3} md={6} sm={12} className="mb-4">
            <div>
              <div
                className="d-flex justify-content-center align-items-center mx-auto rounded-circle"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#4169E1", // Royal Blue
                }}
              >
                <span className="fs-2 text-white">{item.icon}</span>
              </div>
              <h5 className="fw-bold mt-3" style={{ color: "rgb(0, 3, 11)" }}>
                {item.title}
              </h5>
              <p className="small text-muted">{item.heading}</p>
            </div>
          </Col>
        ))}
      </Row>
    <Container>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Link to="/admin" className="btn">
            Admin panel
          </Link>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default NewArrivalpage;
