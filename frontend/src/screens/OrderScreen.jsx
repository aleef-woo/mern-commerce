import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Loader from "../components/Loader";
import Message from "../components/Message";
import OrderSummary from "../components/OrderSummary";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPaypal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypal.clientId,
            currency: "MYR",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPaypal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful");
      } catch (error) {
        toast.error(error?.data.message || error.message);
      }
    });
  }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment successful");
  }

  function onError(error) {
    toast.error(error.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => orderId);
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <>
      <h1 className="py-2">Order {order._id}</h1>
      <Row>
        <Col md={7}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="py-2">Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email:</strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {`${order.shippingAddress.address}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.city}, ${order.shippingAddress.nationState}`}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliverAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className="py-2">Payment Method</h2>
              <p>
                <strong>Method: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className="py-2">Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link
                        to={`/products/${item.product}`}
                        className="text-decoration-none link-light"
                      >
                        {item.title}
                      </Link>
                    </Col>
                    <Col md={4}>
                      {`${item.quantity} x RM ${item.price.toFixed(2)} = RM ${(
                        item.quantity * item.price
                      ).toFixed(2)}`}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={5}>
          <Card className="shadow-lg">
            <ListGroup variant="flush">
              <OrderSummary
                obj={order}
                title="Order Summary"
                load={isLoading}
              />
              {!order.isPaid && (
                <ListGroup.Item className="bg-light">
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button onClick={onApproveTest} className="mb-2">
                        Test Pay Order
                      </Button> */}
                      <div className="bg-light">
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
