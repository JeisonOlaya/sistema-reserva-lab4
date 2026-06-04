import axios from "axios";

const API_URL = "http://localhost:8000";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const obtenerEspacios = async () => {
  const response = await axios.get(
    `${API_URL}/espacios/`,
    getHeaders()
  );

  return response.data;
};

export const obtenerEspacioPorId = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/espacios/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const crearEspacio = async (espacio) => {
  const response = await axios.post(
    `${API_URL}/espacios/`,
    espacio,
    getHeaders()
  );

  return response.data;
};

export const actualizarEspacio = async (id, espacio) => {
  const response = await axios.put(
    `${API_URL}/espacios/${id}`,
    espacio,
    getHeaders()
  );

  return response.data;
};