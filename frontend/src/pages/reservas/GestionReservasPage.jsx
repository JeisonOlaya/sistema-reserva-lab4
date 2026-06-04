import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import {
  obtenerReservas,
  cambiarEstadoReserva,
} from "../../services/reservaService";

function GestionReservasPage() {
  const [reservas, setReservas] = useState([]);

  // 🔵 cargar reservas
  const cargar = async () => {
    try {
      const data = await obtenerReservas();
      setReservas(data);
    } catch (err) {
      console.log(err.response?.data || err);
      Swal.fire("Error", "No se pudieron cargar reservas", "error");
    }
  };

  // 🔵 cambiar estado
  const cambiar = async (id, estado) => {
    try {
      await cambiarEstadoReserva(id, estado);

      Swal.fire("OK", `Reserva ${estado}`, "success");

      cargar();
    } catch (err) {
      console.log(err.response?.data);

      Swal.fire(
        "Error",
        err.response?.data?.detail || "No se pudo actualizar",
        "error"
      );
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Gestión de Reservas</h1>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Usuario</th>
              <th>ID Espacio</th>
              <th>Fecha</th>
              <th>Hora inicio</th>
              <th>Hora fin</th>
              <th>Asistentes</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reservas.map((r) => (
              <tr key={r.id_reserva}>
                <td>{r.id_reserva}</td>
                <td>{r.id_usuario}</td>
                <td>{r.id_espacio}</td>
                <td>{r.fecha}</td>
                <td>{r.hora_inicio}</td>
                <td>{r.hora_fin}</td>
                <td>{r.cantidad_asistentes}</td>
                <td>{r.estado}</td>

                <td style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-green"
                    onClick={() => cambiar(r.id_reserva, "aprobada")}
                  >
                    Aprobar
                  </button>

                  <button
                    className="btn btn-red"
                    onClick={() => cambiar(r.id_reserva, "rechazada")}
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default GestionReservasPage;