import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7218",
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log(localStorage.getItem("token"));
//     config.headers.authorization = localStorage.getItem("token");
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
