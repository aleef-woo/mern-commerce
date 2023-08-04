import React from "react";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import Loader from "./Loader";

const OrderSummary = ({ obj, title, func, load, items }) => {
  return (
    <>
      <ListGroup.Item className="bg-light">
        <h2 className="text-dark">{title}</h2>
      </ListGroup.Item>
      <ListGroup.Item className="bg-light">
        <Row className="text-dark">
          <Col>Items:</Col>
          <Col>RM {obj.itemsPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item className="bg-light">
        <Row className="text-dark">
          <Col>Shipping:</Col>
          <Col>RM {obj.shippingPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item className="bg-light">
        <Row className="text-dark">
          <Col>Tax:</Col>
          <Col>RM {obj.taxPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item className="bg-light">
        <Row className="text-dark">
          <Col>Total:</Col>
          <Col>RM {obj.totalPrice}</Col>
        </Row>
      </ListGroup.Item>
      {func && (
        <ListGroup.Item className="bg-light">
          <Button
            type="button"
            className="btn-block"
            variant="dark"
            disabled={items.length === 0}
            onClick={func}
          >
            Submit Order
          </Button>
          {load && <Loader />}
        </ListGroup.Item>
      )}
    </>
  );
};

export default OrderSummary;
