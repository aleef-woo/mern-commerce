import React from "react";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Button, Col, Row, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import {
  useCreateProductMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetSignatureMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [getSignUrl] = useGetSignatureMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const [deleteProductImage, { isLoading: loadingImageDelete }] =
    useDeleteProductImageMutation();

  const deleteHandler = async (id, image, productName) => {
    const key = image.split("com/").pop();
    const uploadedImage = `image/${key.split(".").pop()}`;
    if (window.confirm("Are you sure you want to delete the product?")) {
      try {
        const signedUrl = await getSignUrl({
          uploadedImage,
          productName,
          key,
        });
        await deleteProduct(id);
        await deleteProductImage(signedUrl);
        toast.success("Product deleted");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const createProductHandler = async (event) => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="btn-sm m-3"
            variant="light"
            onClick={createProductHandler}
          >
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {loadingImageDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm mx-2"
                      onClick={() =>
                        deleteHandler(product._id, product.image, product.title)
                      }
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
