import axios from "axios";
import { cookies } from "./cookie";

const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_KEY = "access_token";

export const setToken = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    axios.defaults.headers.common.Authorization = accessToken;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    axios.defaults.headers.common.refresh = refreshToken;
    const expires = new Date();
    expires.setDate(expires.getDate() + 13);
    cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      expires,
      secure: true,
    });
  }
};

export const removeTokens = () => {
  cookies.remove(REFRESH_TOKEN_KEY);
  axios.defaults.headers.common.refresh = undefined;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  axios.defaults.headers.common.Authorization = undefined;
};

export const getAccessToken = () =>
  window.localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => cookies.get(REFRESH_TOKEN_KEY);

export const getTokens = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (accessToken) {
    axios.defaults.headers.common.Authorization = accessToken;
  }
  if (refreshToken) {
    axios.defaults.headers.common.refresh = refreshToken;
  }
  return {
    accessToken,
    refreshToken,
  };
};

export const getNewAccessToken = async () => {
  try {
    //TODO: replace dummy refresh api
    const { data } = await axios.get("/api/users/refresh");
    if (data.success) setToken({ accessToken: data.accessToken });
    return true;
  } catch (e) {
    if (e.response.data.message.includes("not expired")) {
      return true;
    } else return false;
  }
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config: originalRequest, response } = error;
    console.log(error);
    if (response.status === 419 && !originalRequest.url.includes("refresh")) {
      const res = await getNewAccessToken();
      if (res) {
        originalRequest.headers.Authorization = getAccessToken();
        return axios(originalRequest);
      } else throw error;
    } else throw error;
  }
);
