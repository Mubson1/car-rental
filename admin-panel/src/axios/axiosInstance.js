// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://localhost:7218",
//   timeout: 1000,
// });

// // axiosInstance.interceptors.request.use(
// //   (config) => {
// //     console.log(localStorage.getItem("token"));
// //     config.headers.authorization = localStorage.getItem("token");
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// export default axiosInstance;
import axios from "axios";

const token = JSON.parse(localStorage.getItem("token"))?.token;

const axiosInstance = axios.create({
  baseURL: "https://localhost:7218",
  headers: { Authorization: `Bearer ${token}` },
  timeout: 1000,
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     config.headers.authorization = `Bearer ${
//       JSON.parse(localStorage.getItem("token")).token
//     }`;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
