import axios from "axios";

const URL_API = "http:localhost:300"

export const API = axios.create({
    baseURL: URL_API
})