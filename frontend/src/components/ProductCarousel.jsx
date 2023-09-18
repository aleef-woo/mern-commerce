import React from "react";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import Message from "./Message";
import Loader from "./Loader";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./ProductCarousel.css";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-4" variant="dark">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/products/${product._id}`}>
            <Image src={product.image} alt={product.title} fluid />
            <Carousel.Caption className={`${styles["carousel-caption"]}`}>
              <h2 className="mb-5 text-light">
                {product.title} (RM {product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
