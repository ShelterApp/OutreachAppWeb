import axios from "axios";
import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import Router from "next/router";

import { fetchWrapper } from "helpers";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user"))
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
  register,
  // getAll,
  // getById,
  // update,
  // delete: _delete,
  forgotPassword,
};

async function login(username, password) {
  try {
    const res = await axios.post(`${baseUrl}/auth/login`, { username, password });
    // publish user to subscribers and store in local storage to stay logged in between page refreshes
    const user = res.data
    userSubject.next(user);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    return error.response.data;
  }
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem("user");
  userSubject.next(null);
  Router.push("/login");
}

async function register(user) {
  try {
    const res = await axios.post(`${baseUrl}/auth/register`, user);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function forgotPassword(data) {
  try {
    const res = await axios.post(`${baseUrl}/auth/forgot-password`, data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

// function getAll() {
//   return fetchWrapper.get(`${baseUrl}/register`);
// }

// function getById(id) {
//   return fetchWrapper.get(`${baseUrl}/${id}`);
// }

// function update(id, params) {
//   return fetchWrapper.put(`${baseUrl}/${id}`, params).then((x) => {
//     // update stored user if the logged in user updated their own record
//     if (id === userSubject.value.id) {
//       // update local storage
//       const user = { ...userSubject.value, ...params };
//       localStorage.setItem("user", JSON.stringify(user));

//       // publish updated user to subscribers
//       userSubject.next(user);
//     }
//     return x;
//   });
// }

// // prefixed with underscored because delete is a reserved word in javascript
// function _delete(id) {
//   return fetchWrapper.delete(`${baseUrl}/${id}`);
// }
