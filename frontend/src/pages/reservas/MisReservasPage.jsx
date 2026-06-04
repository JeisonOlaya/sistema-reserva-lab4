import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import {
  misReservas,
  cancelarReserva,
} from "../../services/reservaService";

function MisReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔵 CARGAR RESERVAS
  const cargar = async () => {
    try {
      setLoading(true);

      const data = await misReservas();
      console.log("MIS RESERVAS:", data);

      setReservas(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log(error.response?.data || error);

      Swal.fire(
        "Error",
        "No se pudieron cargar tus reservas",
        "error"
      );

      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 CANCELAR RESERVA
  const cancelar = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Cancelar reserva?",
        text: "Esta acción cambiará el estado a rechazada",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
      });

      if (!confirm.isConfirmed) return;

      await cancelarReserva(id);

      Swal.fire("OK", "Reserva cancelada", "success");

      cargar();
    } catch (error) {
      console.log(error.response?.data);

      Swal.fire(
        "Error",
        error.response?.data?.detail || "No se pudo cancelar",
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
        <h1>Mis Reservas</h1>

        {/* LOADING */}
        {loading && <p>Cargando reservas...</p>}

        {/* SIN RESERVAS */}
        {!loading && reservas.length === 0 && (
          <p style={{ marginTop: "20px", color: "#666" }}>
            No tienes reservas registradas.
          </p>
        )}

        {/* TABLA */}
        {!loading && reservas.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Espacio</th>
                <th>Fecha</th>
                <th>Hora inicio</th>
                <th>Hora fin</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>{r.id_reserva}</td>
                  <td>{r.id_espacio}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora_inicio}</td>
                  <td>{r.hora_fin}</td>
                  <td>{r.estado}</td>

                  <td>
                    {r.estado !== "rechazada" && (
                      <button
                        className="btn btn-red"
                        onClick={() => cancelar(r.id_reserva)}
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default MisReservasPage;