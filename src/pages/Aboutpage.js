import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
// import aboutpageimage1 from "../assets/images/aboutpageimage1.png";
import { IoStorefrontOutline } from "react-icons/io5";
import { BiDollarCircle } from "react-icons/bi";
import { BsHandbag } from "react-icons/bs";
import { TbMoneybag, TbTruckDelivery } from "react-icons/tb";
import { RiCustomerServiceLine } from "react-icons/ri";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import aboutpageimage2 from "../assets/images/image 46.jpg";
// import aboutpageimage3 from "../assets/images/image 47.png";
import aboutpageimage4 from "../assets/images/image 51.png";
import { CiTwitter } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";


const AboutPage = () => {
  // Icon data array
  const iconData = [
    { icon: <IoStorefrontOutline />, color: "black", heading: "10.0k", title: "Sellers active on our site" },
    { icon: <BiDollarCircle />, color: "black", heading: "33k", title: "Monthly product sales" },
    { icon: <BsHandbag />, color: "black", heading: "45.5k", title: "Customers active on our site" },
    { icon: <TbMoneybag />, color: "black", heading: "25k", title: "Annual gross sales on our site" },
  ];

  const iconData1 = [
    { icons: <TbTruckDelivery />, color: "black", title: "FREE AND FAST DELIVERY", heading: "Free delivery for all orders over $140" },
    { icons: <RiCustomerServiceLine />, color: "black", title: "24/7 CUSTOMER SERVICE", heading: "Friendly 24/7 customer support" },
    { icons: <AiTwotoneSafetyCertificate />, color: "black", title: "MONEY BACK GUARANTEE", heading: "We return money within 30 days" },
  ];

  // Hover state
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Container className="my-5">
      {/* First Row - Our Story */}
      <Row className="align-items-center">
        <Col md={6} className="ps-4">
          <h2 className="display-4 fw-bold text-dark">Our Story</h2>
          <p className="mt-3">
            Launched in 2015, Exclusive is South Asia’s premier online shopping
            marketplace with an active presence in Bangladesh. Supported by a
            wide range of tailored marketing, data, and service solutions,
            Exclusive has 10,500 sellers and 300 brands and serves 3 million
            customers across the region.
          </p>
          <p>
            Exclusive has more than 1 million products to offer, growing at a
            very fast rate. Exclusive offers a diverse assortment in categories
            ranging from consumer electronics to lifestyle products.
          </p>
        </Col>

        {/* Right Section - Image */}
        <Col md={6} className="text-center">
          {/* <Image src={aboutpageimage1} alt="Shopping Experience" fluid className="rounded shadow" /> */}
        </Col>
      </Row>

      {/* Second Row - Icon Section */}
      <Row className="justify-content-center mt-5">
        {iconData.map((item, index) => (
          <Col key={index} md={3} sm={6} xs={12} className="text-center mb-4">
            <div
              style={{
                width:"85%",
                height:"93%",
                padding: "20px",
                marginLeft:"12%",
                // borderRadius: "15px", // Always rounded
                transition: "background-color 0.3s ease-in-out, transform 0.3s",
                backgroundColor: hoveredIndex === index ? "#f8d7da" : "white", // Change color on hover
                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                cursor: "pointer",
                border: "1px solid black", // Always have a border
                boxShadow: hoveredIndex === index ? "0 4px 10px rgba(0, 0, 0, 0.2)" : "none", // Shadow on hover
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="d-flex justify-content-center align-items-center rounded-circle mx-auto"
                style={{
                  width: "70px",
                  height: "70px",
                  backgroundColor: item.color,
                  border: "10px solid #edf2f1", // White border for icon container
                }}
              >
                <span style={{ fontSize: "40px", color: "white" }}>
                  {item.icon}
                </span>
              </div>
              <h2 className="fw-bold text-dark fs-4">{item.heading}</h2>
              <h4 className="mt-3">{item.title}</h4>
            </div>
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center" style={{paddingLeft:"60px"}}>
  <Col>
    <Card style={{ width: '18rem' }}>
      <div style={{}}>
      {/* <Card.Img
        variant="top"
        style={{ height: '250px', width: '100%',paddingLeft:"40px",paddingRight:"40px", }}
        src={aboutpageimage2}
        /> */}
        </div>
      <Card.Body style={{paddingLeft:"30%"}}>
        <Card.Title>Tom Cruise</Card.Title>
        <Card.Text>
        Founder & Chairman
        </Card.Text>
        <ol style={{display:"flex", gap:"10px",fontSize:"20px"}}> 
        <li><CiTwitter /></li>
        <li><CiInstagram /></li>
        <li><CiLinkedin /> </li>
        </ol>
      </Card.Body>
    </Card>
  </Col>
  <Col>
    <Card style={{ width: '18rem' }}>
      {/* <Card.Img
        variant="top"
        style={{ height: '250px', width: '100%',paddingLeft:"40px",paddingRight:"40px"}}
        src={aboutpageimage3}
      /> */}
      <Card.Body style={{paddingLeft:"30%"}}>
        <Card.Title>Emma Watson</Card.Title>
        <Card.Text>
        Managing Director
        </Card.Text>
        <ol style={{display:"flex", gap:"10px",fontSize:"20px"}}> 
        <li><CiTwitter /></li>
        <li><CiInstagram /></li>
        <li><CiLinkedin /></li>
        </ol>      
        </Card.Body>
    </Card>
  </Col>
  <Col>
    <Card style={{ width: '18rem' }}>
      <Card.Img
        variant="top"
        style={{ height: '250px', width: '100%',paddingLeft:"40px",paddingRight:"40px" }}
        src={aboutpageimage4} />
      <Card.Body style={{paddingLeft:"30%"}}> 
        <Card.Title>Will Smith</Card.Title>
        <Card.Text>
        Product Designer
        </Card.Text>
        <ol style={{display:"flex", gap:"10px",fontSize:"20px",}}> 
        <li><CiTwitter />
        </li>
        <li><CiInstagram />
        </li>
        <li><CiLinkedin />
        </li>
        </ol>      </Card.Body>
    </Card>
  </Col>
</Row>

 
      {/* Third Row - Additional Icons */}
      <Row className="justify-content-center mt-5">
        {iconData1.map((item, index) => (
          <Col key={index} md={3} sm={6} xs={12} className="text-center mb-4">
            <div
              style={{
                padding: "20px",
                borderRadius: "15px", // Always rounded
                backgroundColor: "white",
                border: "2px solid white",
              }}>
              <div
                className="d-flex justify-content-center align-items-center rounded-circle mx-auto"
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: item.color,
                  border: "10px solid #edf2f1", // White border for icon container
                }}>
                <span style={{ fontSize: "50px", color: "white" }}>
                  {item.icons}
                </span>
              </div>
              <h2 className="fw-bold text-dark">{item.title}</h2>
              <h4 className="mt-3">{item.heading}</h4>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AboutPage;
