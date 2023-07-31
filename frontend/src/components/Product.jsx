import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product.id}`} style={{ height: "20em" }}>
        <Card.Img src={product.image} variant="top" height="100%" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title as="div" className="text-nowrap text-truncate">
            <strong>{product.title}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating.rate}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">RM {product.price.toFixed(2)}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
