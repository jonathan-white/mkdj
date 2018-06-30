import axios from "axios";

// Export an object containing methods we'll use for accessing the API

export default {

  // Product APIs
  getProducts: () => {
    return axios.get("/api/products");
  },
  getProduct: (id) => {
    return axios.get("/api/products/" + id);
  },
  createProduct: (productData) => {
    return axios.post("/api/products", productData);
  },
  uploadProductPic: (data) => {
    return axios.post("/api/uploads",data,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteProduct: (id) => {
    return axios.delete("/api/products/" + id);
  },
  // Account APIs
  createAccount: (userData) => {
    return axios.post("/api/users", userData);
  },
  createCompany: (companyData) => {
    return axios.post("/api/users", companyData);
  },
  loginAccount: (userData) => {
    return axios.post("/api/users/login", userData);
  },
  getUser: (id) => {
    return axios.get("/api/users/" + id);
  },

  // Cart APIs
  createCart: (cartData) => {
    return axios.post("/api/cart", cartData);
  },
  getCart: (cartId) => {
    return axios.get("/api/cart/" + cartId);
  },
  updateCart: (cartId, cartData) => {
    return axios.put("/api/cart/" + cartId, cartData);
  },
  deleteProduct: (id) => {
    return axios.delete("/api/cart/" + id);
  },
};
