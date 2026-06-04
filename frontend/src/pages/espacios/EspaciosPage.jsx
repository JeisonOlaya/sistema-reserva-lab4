import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  obtenerEspacios,
  obtenerEspacioPorId,
} from "../../services/espacioService";
import Swal from "sweetalert2";

function EspaciosPage() {
  const [espacios, setEspacios] = useState([]);
  const [idBuscar, setIdBuscar] = useState("");

  const rol = (localStorage.getItem("rol") || "").toLowerCase();
  const isAdmin = rol === "admin";

  const cargarEspacios = async () => {
    const data = await obtenerEspacios();
    setEspacios(data);
  };

  const buscarEspacio = async () => {
    if (!idBuscar) return cargarEspacios();

    try {
      const espacio = await obtenerEspacioPorId(idBuscar);
      setEspacios([espacio]);
    } catch {
      Swal.fire("No encontrado", "No existe ese espacio", "warning");
    }
  };

  useEffect(() => {
    cargarEspacios();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Espacios Institucionales</h1>

        {/* 🔥 BARRA DE ACCIONES */}
        <div className="actions-bar">

          {isAdmin && (
            <Link to="/espacios/crear">
              <button className="btn btn-purple">
                Crear Espacio
              </button>
            </Link>
          )}

          {/* INPUT NORMAL (SIN LUPA) */}
          <input
            className="input"
            type="number"
            placeholder="Buscar por ID"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />

          <button className="btn btn-blue" onClick={buscarEspacio}>
            Buscar
          </button>

          <button className="btn btn-green" onClick={cargarEspacios}>
            Mostrar Todos
          </button>

        </div>

        {/* 📊 TABLA */}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Capacidad</th>
              <th>Estado</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {espacios.map((e) => (
              <tr key={e.id_espacio}>
                <td>{e.id_espacio}</td>
                <td>{e.nombre}</td>
                <td>{e.ubicacion}</td>
                <td>{e.capacidad}</td>
                <td>{e.estado}</td>

                {isAdmin && (
                  <td>
                    <Link to={`/espacios/editar/${e.id_espacio}`}>
                      <button className="btn btn-orange">
                        Editar
                      </button>
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </>
  );
}

export default EspaciosPage;