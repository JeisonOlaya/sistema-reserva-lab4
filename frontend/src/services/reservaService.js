import axios from "axios";

const API_URL = "http://localhost:8000";

const getToken = () => localStorage.getItem("token");


export const misReservas = async () => {
  const res = await axios.get(
    `${API_URL}/reservas/mis-reservas`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

export const obtenerReservas = async () => {
  const res = await axios.get(
    `${API_URL}/reservas`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

export const crearReserva = async (data) => {
  const res = await axios.post(
    `${API_URL}/reservas`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

export const cancelarReserva = async (id) => {
  const res = await axios.delete(
    `${API_URL}/reservas/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

export const cambiarEstadoReserva = async (id, estado) => {
  const res = await axios.patch(
    `${API_URL}/reservas/${id}/estado`,
    { estado },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};