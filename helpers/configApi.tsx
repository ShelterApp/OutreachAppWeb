import axios from "axios";
import getConfig from "next/config";
import { BehaviorSubject } from "rxjs";


const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user") as string)
);

const user = userSubject.value;

const isLoggedIn = user && user.access_token;
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

const APIInstance = axios.create({
  baseURL: baseUrl
});

export const setToken = (token: string) => {
  APIInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
};

if (isLoggedIn) {
  setToken(user.access_token);
}

export default APIInstance;
