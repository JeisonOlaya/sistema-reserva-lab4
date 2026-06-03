import axios from "axios";

const API_URL = "http://localhost:8000";

export const registrarUsuario = async (datos) => {
  const response = await axios.post(
    `${API_URL}/usuarios/`,
    datos
  );

  return response.data;
};

export const obtenerUsuarios = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/usuarios/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const obtenerUsuarioPorId = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/usuarios/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const obtenerMiPerfil = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/usuarios/yo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};