import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { crearReserva } from "../../services/reservaService";

function CrearReservaPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_espacio: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    cantidad_asistentes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 
  const validar = () => {
    const hoy = new Date();
    const fechaReserva = new Date(`${form.fecha}T00:00:00`);

   
    if (Number(form.cantidad_asistentes) <= 0) {
      Swal.fire("Error", "La cantidad debe ser mayor a 0");
      return false;
    }

   
    if (form.hora_inicio >= form.hora_fin) {
      Swal.fire("Error", "La hora inicio debe ser menor a la hora fin");
      return false;
    }

    
    const diffHoras = (fechaReserva - hoy) / (1000 * 60 * 60);
    if (diffHoras < 24) {
      Swal.fire("Error", "Debe reservar con al menos 24 horas de anticipación");
      return false;
    }


    const dia = fechaReserva.getDay(); // 0 domingo - 6 sábado
    if (dia === 0 || dia === 6) {
      Swal.fire("Error", "Solo se permiten reservas de lunes a viernes");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    try {
      const payload = {
        id_espacio: Number(form.id_espacio),
        fecha: form.fecha,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        cantidad_asistentes: Number(form.cantidad_asistentes),
      };

      await crearReserva(payload);

      Swal.fire("OK", "Reserva creada correctamente", "success");
      navigate("/mis-reservas");

    } catch (error) {
      console.log(error.response?.data);

      Swal.fire(
        "Error",
        error.response?.data?.detail || "No se pudo crear la reserva",
        "error"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Crear Reserva</h1>

        <form className="form-container" onSubmit={handleSubmit}>

          <input
            className="input"
            type="number"
            name="id_espacio"
            placeholder="ID espacio"
            value={form.id_espacio}
            onChange={handleChange}
          />

          <input
            className="input"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
          />

          <input
            className="input"
            type="time"
            name="hora_inicio"
            value={form.hora_inicio}
            onChange={handleChange}
          />

          <input
            className="input"
            type="time"
            name="hora_fin"
            value={form.hora_fin}
            onChange={handleChange}
          />

          <input
            className="input"
            type="number"
            name="cantidad_asistentes"
            placeholder="Cantidad asistentes"
            value={form.cantidad_asistentes}
            onChange={handleChange}
          />

          <button className="btn btn-blue">
            Crear Reserva
          </button>

        </form>
      </div>
    </>
  );
}

export default CrearReservaPage;