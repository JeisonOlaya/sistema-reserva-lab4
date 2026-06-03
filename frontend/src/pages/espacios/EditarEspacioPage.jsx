import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  obtenerEspacioPorId,
  actualizarEspacio,
} from "../../services/espacioService";
import Swal from "sweetalert2";

function EditarEspacioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    capacidad: 0,
    estado: "",
  });

  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerEspacioPorId(id);

      setForm({
        nombre: data.nombre || "",
        ubicacion: data.ubicacion || "",
        capacidad: data.capacidad || 0,
        estado: data.estado || "",
      });
    };

    cargar();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = async (e) => {
    e.preventDefault();

    try {
      await actualizarEspacio(id, form);

      Swal.fire("Correcto", "Espacio actualizado", "success");

      navigate("/espacios");
    } catch (error) {
      Swal.fire("Error", "No fue posible actualizar", "error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">

        <h1>Editar Espacio</h1>

        {/* 🧠 FORMULARIO UNIFICADO */}
        <form className="form-card" onSubmit={guardar}>

          <input
            className="input"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del espacio"
          />

          <input
            className="input"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            placeholder="Ubicación"
          />

          <input
            className="input"
            type="number"
            name="capacidad"
            value={form.capacidad}
            onChange={handleChange}
            placeholder="Capacidad"
          />

          <input
            className="input"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            placeholder="Estado"
          />

          <button className="btn btn-orange" type="submit">
            Actualizar
          </button>

        </form>

      </div>
    </>
  );
}

export default EditarEspacioPage;