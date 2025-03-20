/**
 * Title: Write a program using JavaScript on PurchaseApi

 * Date: 20, January 2024
 */

const { canimApi } = require("../canim");

const purchaseApi = canimApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPurchases: build.query({
      query: () => ({
        url: "/purchase/get-all-purchases",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      providesTags: ["Purchase"],
    }),

    updatePurchaseStatus: build.mutation({
      query: ({ id, body }) => ({
        url: `/purchase/update-purchase-status/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["Purchase", "User"],
    }),
  }),
});

export const { useGetAllPurchasesQuery, useUpdatePurchaseStatusMutation } =
  purchaseApi;
