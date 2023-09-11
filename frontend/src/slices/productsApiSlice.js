import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ pageNumber }) => ({
        url: PRODUCT_URL,
        params: {
          pageNumber,
        }
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductDetail: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCT_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    getSignature: builder.mutation({
      query: ({ uploadedImage, productName, key }) => ({
        url: UPLOAD_URL,
        method: "POST",
        params: {
          fileType: uploadedImage,
          productName,
          key,
        },
      }),
    }),
    uploadProductImage: builder.mutation({
      query: ({ signedUrl, uploadedImage }) => ({
        url: signedUrl.data.url,
        method: "PUT",
        headers: {
          "content-type": uploadedImage.type,
        },
        body: uploadedImage,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProductImage: builder.mutation({
      query: (signedUrl) => ({
        url: signedUrl.data.url,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSignatureMutation,
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
  useCreateReviewMutation,
} = productsApiSlice;
