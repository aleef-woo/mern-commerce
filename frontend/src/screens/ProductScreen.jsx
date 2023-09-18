import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import {
  useCreateReviewMutation,
  useGetProductDetailQuery,
} from "../slices/productsApiSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailQuery(productId);

  const [createReview, { isLoading: loadingReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate("/cart");
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review submitted");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
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
          <Meta title={product.title} description={product.description} />
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
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                {!userInfo.isAdmin && (
                  <ListGroup.Item>
                    <h2>Write a Review</h2>
                    {loadingReview && <Loader />}

                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId="rating" className="my-2">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="comment" className="my-2">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            row={3}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Button
                          disabled={loadingReview}
                          type="submit"
                          variant="light"
                        >
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        Please <Link to="/login">sign in</Link> to write a
                        review{" "}
                      </Message>
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
