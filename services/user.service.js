import axios from "helpers/configApi";
import { BehaviorSubject } from "rxjs";
import Router from "next/router";
import { setToken } from 'helpers/configApi';
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
  list,
  getById,
  update,
  _delete,
  forgotPassword,
  resetPassword,
  getProfile,
  create,
  updateUser
};

async function login(username, password) {
  try {
    const res = await axios.post(`/auth/login`, { username, password });
    // publish user to subscribers and store in local storage to stay logged in between page refreshes
    const user = res.data
    userSubject.next(user);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(user.access_token)
    return user;
  } catch (error) {
    return error.response.data;
  }
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem("user");
  userSubject.next(null);
  Router.push("/");
}

async function register(user) {
  try {
    const res = await axios.post(`/auth/register`, user);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function forgotPassword(data) {
  try {
    const res = await axios.post(`/auth/forgot-password`, data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function resetPassword(data) {
  try {
    const res = await axios.post(`/auth/reset-password`, data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function getProfile() {
  try {
    const res = await axios.get(`/profile`);
    return res.data;
  } catch (error) {
    if (userSubject.value) {
      logout()
    }
    return error.response.data;
  }
}

async function list(params) {
  try {
    const res = await axios.get(`/users`, { params });

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function update(params) {
  try {
    const res = await axios.patch(`/profile`, params);
    if (res.data && res.data._id) {
      const user = {
        ...userService.userValue,
        user: res.data
      }
      localStorage.setItem("user", JSON.stringify(user));
      userSubject.next(user);
    }
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

// // prefixed with underscored because delete is a reserved word in javascript

async function _delete(id) {
  try {
    const res = await axios.delete(`/users/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function create(params) {
  try {
    const res = await axios.post(`/users`, params);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function updateUser(id, params) {
  try {
    const res = await axios.patch(`/users/${id}`, params);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

async function getById(id) {
  try {
    const res = await axios.get(`/users/${id}`);

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
