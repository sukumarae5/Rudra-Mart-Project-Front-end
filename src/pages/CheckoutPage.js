import React , {useRef}from 'react'
import { Container, Row } from 'react-bootstrap'
import Address from './Address'
import OrderSummaryPage from './OrderSummaryPage'
import PaymentPage from './PaymentPage'

const CheckoutPage = () => {

  const orderSummaryRef = useRef(null);

  const scrollToOrderSummary = () => {
    if (orderSummaryRef.current) {
      orderSummaryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const paymentRef = useRef(null); // Create a reference for PaymentPage

  const handleConfirmOrder = () => {
    if (paymentRef.current) {
      paymentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      <Container fluid style={{  background: "#e3f2fd", padding: "10px" }}>
        <Row>
          <Address scrollToOrderSummary={scrollToOrderSummary}/>
        </Row>
      {/* <Row>
          <OrderSummaryPage ref={orderSummaryRef} onConfirmOrder={handleConfirmOrder}/>
        </Row>
        <Row>
          <PaymentPage ref={paymentRef}/>
        </Row> */}
      </Container>

    </div>
  )
}

export default CheckoutPage