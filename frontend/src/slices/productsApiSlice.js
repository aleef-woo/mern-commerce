import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCT_URL,
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
    getSignature: builder.mutation({
      query: (file) => ({
        url: UPLOAD_URL,
        method: "POST",
        params: {
          fileType: file.type,
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
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetSignatureMutation,
  useUploadProductImageMutation,
} = productsApiSlice;
