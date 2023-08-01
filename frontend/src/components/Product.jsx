import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/products/${product._id}`} style={{ height: "20em" }}>
        <Card.Img src={product.image} variant="top" height="100%" />
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title as="div" className="text-nowrap text-truncate">
            <strong>{product.title}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numOfReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">RM {product.price.toFixed(2) ?? 0.0}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
