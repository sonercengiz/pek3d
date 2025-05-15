import axios from "axios";
import { API_BASE } from "../utils/api";

export const getComponentList = () => {
  return axios.get(`${API_BASE}/api/components`)
}