import axios from "axios";

const API_URL = "http://localhost:8000";

export const obtenerEstadoSistema = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};