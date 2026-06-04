import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { crearEspacio } from "../../services/espacioService";
import Swal from "sweetalert2";

function CrearEspacioPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    capacidad: 0,
    estado: "activo",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = async (e) => {
    e.preventDefault();

    try {
      await crearEspacio(form);

      Swal.fire("Correcto", "Espacio creado", "success");

      navigate("/espacios");
    } catch (error) {
      Swal.fire("Error", "No fue posible crear el espacio", "error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Crear Espacio</h1>

        <form onSubmit={guardar} className="form-container">
          <input
            className="input"
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
          />

          <input
            className="input"
            name="ubicacion"
            placeholder="Ubicación"
            onChange={handleChange}
          />

          <input
            className="input"
            name="capacidad"
            type="number"
            placeholder="Capacidad"
            onChange={handleChange}
          />

          <select
            className="input"
            name="estado"
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <button className="btn btn-green" type="submit">
            Guardar
          </button>
        </form>
      </div>
    </>
  );
}

export default CrearEspacioPage;