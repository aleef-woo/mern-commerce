import React from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const updateQuantityHandler = async (product, quantity) => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const removeItemHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}> Your Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/products/${item._id}`}> {item.title} </Link>
                  </Col>
                  <Col md={2}>RM {item.price}</Col>
                  <Col md={1} className="d-flex gap-3">
                    <Button
                      className="my-auto"
                      type="button"
                      variant="light"
                      disabled={item.quantity <= 1}
                      onClick={(e) => updateQuantityHandler(item, Number(-1))}
                    >
                      <FaMinus />
                    </Button>

                    <p className="my-auto">{item.quantity}</p>

                    <Button
                      className="my-auto"
                      type="button"
                      variant="light"
                      disabled={item.countInStock <= item.quantity}
                      onClick={(e) => updateQuantityHandler(item, Number(1))}
                    >
                      <FaPlus />
                    </Button>

                    <Button
                      className="my-auto"
                      type="button"
                      variant="light"
                      onClick={() => removeItemHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal (
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}) items
              </h2>
              RM{" "}
              {cartItems
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                variant="light"
                onClick={checkoutHandler}
              >
                Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
