import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const BASE_URL = "http://88.222.241.105:9001/api";
export const BACKEND_URL = "http://88.222.241.105:9001";
const baseUrl = BASE_URL;

// ------------------------------------
// GET TOKEN HEADER
// ------------------------------------
export async function getHeaders(extraHeaders = {}, isMultipart = false) {
  let token = await AsyncStorage.getItem('token');

  let headers = {
    Authorization: token ? `Bearer ${token}` : "",
    ...extraHeaders,
  };

  if (isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// ------------------------------------
// GENERIC API REQUEST
// ------------------------------------
export async function apiReq(endpoint, data, method, extraHeaders, isMultipart = false) {
  try {
    const headers = await getHeaders(extraHeaders, isMultipart);

    const url = `${baseUrl}${endpoint}`;
    console.log("API URL:", url);
    console.log("HEADERS:", headers);

    let response;

    if (method === "get") {
      response = await axios.get(url, { headers, params: data });
    } 
    else if (method === "delete") {
      response = await axios.delete(url, { headers, data });
    } 
    else {
      // POST / PUT supports JSON + MULTIPART
      response = await axios({
        url,
        method,
        data,
        headers
      });
    }

    console.log(response)
    return response.data;

  } catch (error) {
    console.log("API ERROR:", error);

    if (error.response) {
      return Promise.reject(error.response.data);
    } else {
      return Promise.reject({ message: "Network Error" });
    }
  }
}

// ------------------------------------
// API METHODS
// ------------------------------------
export function apiPost(endpoint, data, extraHeaders = {}, isMultipart = false) {
  return apiReq(endpoint, data, "post", extraHeaders, isMultipart);
}

export function apiGet(endpoint, data, extraHeaders = {}) {
  return apiReq(endpoint, data, "get", extraHeaders, false);
}

export function apiPut(endpoint, data, extraHeaders = {}, isMultipart = false) {
  return apiReq(endpoint, data, "put", extraHeaders, isMultipart);
}

export function apiDelete(endpoint, data, extraHeaders = {}) {
  return apiReq(endpoint, data, "delete", extraHeaders, false);
}
