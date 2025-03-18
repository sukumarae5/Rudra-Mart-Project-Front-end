import React from 'react';
import { RiCustomerServiceLine } from 'react-icons/ri';
import { AiTwotoneSafetyCertificate } from 'react-icons/ai';
import { TbTruckDelivery } from 'react-icons/tb';
import { Badge, Col, Row } from 'react-bootstrap';
import newarivelpageimage from '../assets/images/newarivelpageimage.png';
import newarivelpageimage1 from '../assets/images/newarivelpageimage1.png';
import newarivelpageimage2 from '../assets/images/newarivelpageimage2.png';
import newarivelpageimage3 from '../assets/images/newarivelpageimage3.png';

const NewArrivalpage = () => {
  const iconData1 = [
    { icons: <TbTruckDelivery />, title: 'FREE AND FAST DELIVERY', heading: 'Free delivery for all orders over $140' },
    { icons: <RiCustomerServiceLine />, title: '24/7 CUSTOMER SERVICE', heading: 'Friendly 24/7 customer support' },
    { icons: <AiTwotoneSafetyCertificate />, title: 'MONEY BACK GUARANTEE', heading: 'We return money within 30 days' },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center">
  <Badge bg="danger" style={{ width: "20px", height: "50px",marginLeft: "30px" , marginRight:"10px"}}>  </Badge>
        <p className="text-danger fw-bold fs-5 mb-0">Featured</p>
      </div>
      <h1 className="fw-bold fs-3 ms-3">New Arrival</h1>

      <Row className="mt-4 g-4">
        <Col lg={6}>
          <div className="position-relative overflow-hidden rounded shadow " style={{background:"black"}}>
            <img src={newarivelpageimage1} alt="PlayStation 5" className="img-fluid" />
            <div className="position-absolute bottom-0 text-white p-3" style={{  width: '100%' }}>
              <h2>PlayStation 5</h2>
              <p>Black and White version of the PS5 coming out on sale.</p>
              <h4 className="text-decoration-underline">Shop Now</h4>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <Row className="g-4">
            <Col lg={12}>
              <div className="position-relative overflow-hidden rounded shadow " style={{background:"black",width:"100%"}}>
                <img src={newarivelpageimage3} alt="Women's Collections" 
   />
                <div className="position-absolute bottom-0 text-white p-3 " style={{  width: '100%' }}>
                  <h2>Women’s Collections</h2>
                  <p>Featured woman collections that give you another vibe.</p>
                  <h4 className="text-decoration-underline">Shop Now</h4>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="position-relative overflow-hidden rounded shadow "style={{background:"black"}}>
                <img src={newarivelpageimage} alt="Speakers" className="img-fluid pl-6"  />
                <div className="position-absolute bottom-0 text-white p-3" style={{  width: '100%' }}>
                  <h2>Speakers</h2>
                  <p>Amazon wireless speakers</p>
                  <h4 className="text-decoration-underline">Shop Now</h4>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="position-relative overflow-hidden rounded shadow " style={{background:"black"}}>
                <img src={newarivelpageimage2} alt="Perfume" className="img-fluid" />
                <div className="position-absolute bottom-0 text-white p-3" style={{  width: '100%' }}>
                  <h2>Perfume</h2>
                  <p>GUCCI INTENSE OUD EDP</p>
                  <h4 className="text-decoration-underline">Shop Now</h4>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        {iconData1.map((item, index) => (
          <Col key={index} md={3} sm={6} xs={12} className="text-center mb-4">
            <div className="p-4 bg-white ">
              <div className="d-flex justify-content-center align-items-center rounded-circle mx-auto bg-dark" style={{ width: '80px', height: '80px' }}>
                <span className="fs-2 text-white">{item.icons}</span>
              </div>
              <h5 className="fw-bold mt-3">{item.title}</h5>
              <p className="small text-muted">{item.heading}</p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NewArrivalpage;
