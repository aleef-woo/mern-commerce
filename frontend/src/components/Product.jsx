import React from "react";
import { Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { LinkContainer } from "react-router-bootstrap";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded h-100">
      <Link to={`/products/${product._id}`} className="h-100">
        <Image
          src={product.image}
          className="h-100 object-fit-fill"
          fluid
          rounded
        />
      </Link>
      <Card.Body>
        <LinkContainer to={`/products/${product._id}`}>
          <Card.Title as="div" className="text-nowrap text-truncate">
            <strong>{product.title}</strong>
          </Card.Title>
        </LinkContainer>
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
