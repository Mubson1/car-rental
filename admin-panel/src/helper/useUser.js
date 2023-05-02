import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../axios/axiosInstance";
import useToken from "../axios/useToken";
import { ToastNotificationContext } from "../context/toastNotificationContext";
import { useContext } from "react";

async function getAllUser() {
  return axios.get("/api/Admin/get_customer_details");
}

async function getUserById({ queryKey }) {
  const [, userId] = queryKey;
  return axios.get(`/api/Admin/${userId}`);
}

async function postLoginCustomer(payload) {
  return axios.post("/api/UserAuth/login", payload);
}

async function addUser(payload) {
  return axios.post("/api/Admin/add_new_staff", payload);
}

async function updateUser(payload) {
  return axios.put("/api/Admin/update_user_detail", payload);
}

async function changePassword(payload) {
  return axios.post("/api/Admin/change_password", payload);
}

async function changeMyPassword(payload) {
  return axios.post("/api/UserAuth/change_password", payload);
}

async function deleteUser(userId) {
  return axios.delete(`/api/Admin/${userId}`);
}

async function uploadDocument(payload) {
  return axios.post("/api/UserAuth/upload_document", payload);
}

async function getRentTransactions(payload) {
  return axios.post("/api/Sales/rent_paid", payload);
}

export const useGetAllUser = () => useQuery(["user-list"], getAllUser);

export const useGetUserById = (userId) =>
  useQuery(["my-profile", userId], { queryFn: getUserById, enabled: !!userId });

export const usePostLogin = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  const [, setToken] = useToken();

  return useMutation({
    mutationFn: postLoginCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      setToken(JSON.stringify(data.data));
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Authentication Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Add User Success",
        type: "success",
        message: "New user has been added successfully.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Add User Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Update User Success",
        type: "success",
        message: "User detail has been successfully edited.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Update User Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Update Password Success",
        type: "success",
        message: "Password has been successfully changed.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Update Password Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useUpdateMyPassword = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: changeMyPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      showToast({
        id: new Date().toDateString(),
        title: "Password Change Success",
        type: "success",
        message: "Password has been successfully changed.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Password Change Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      showToast({
        id: new Date().toDateString(),
        title: "Delete User Success",
        type: "success",
        message: "User has been successfully deleted.",
      });
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Delete User Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  const { showToast } = useContext(ToastNotificationContext);

  const [, setToken] = useToken();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      setToken(JSON.stringify(data.data));
    },
    onError: (error) => {
      showToast({
        id: new Date().toDateString(),
        title: "Authentication Error!",
        type: "danger",
        message: error.message,
      });
    },
  });
};

export const useGetRentTransactions = () =>
  useMutation({
    mutationFn: getRentTransactions,
  });
