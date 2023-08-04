import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useGetProductDetailQuery } from "../slices/productsApiSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { FaMinus, FaPlus } from "react-icons/fa";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate("/cart");
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.title} fluid rounded />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.title}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numOfReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: RM {product.price?.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card className="shadow-lg">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>RM {product.price?.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col className="d-flex gap-3 pt-2">
                          <Button
                            type="button"
                            variant="light"
                            disabled={quantity <= 1}
                            onClick={(e) =>
                              setQuantity((prevQuantity) =>
                                Number(prevQuantity - 1)
                              )
                            }
                          >
                            <FaMinus />
                          </Button>
                          <p className="my-auto">{quantity}</p>
                          <Button
                            type="button"
                            variant="light"
                            disabled={product.countInStock <= quantity}
                            onClick={(e) =>
                              setQuantity((prevQuantity) =>
                                Number(prevQuantity + 1)
                              )
                            }
                          >
                            <FaPlus />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      variant="light"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
