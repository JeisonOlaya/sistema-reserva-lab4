import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { obtenerReservas } from "../../services/reservaService";

function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [idBuscar, setIdBuscar] = useState("");
  const [original, setOriginal] = useState([]); // 🔥 backup para restaurar

  const cargar = async () => {
    try {
      const data = await obtenerReservas();
      setReservas(data);
      setOriginal(data); // guardamos copia original
    } catch {
      Swal.fire("Error", "No se pudieron cargar reservas", "error");
    }
  };

  const buscar = () => {
    if (!idBuscar) {
      setReservas(original);
      return;
    }

    const filtrado = original.filter(
      (r) => String(r.id_reserva) === String(idBuscar)
    );

    if (filtrado.length === 0) {
      Swal.fire("No encontrado", "No existe esa reserva", "warning");
      return;
    }

    setReservas(filtrado);
  };

  const limpiar = () => {
    setIdBuscar("");
    setReservas(original);
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Reservas (Admin)</h1>

        {/* 🔵 BUSCADOR */}
        <div className="actions-bar">
          <input
            className="input"
            type="number"
            placeholder="Buscar por ID de reserva"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />

          <button className="btn btn-blue" onClick={buscar}>
            Buscar
          </button>

          <button className="btn btn-green" onClick={limpiar}>
            Mostrar Todos
          </button>
        </div>

        {/* 🔵 TABLA REAL SEGÚN TU BACKEND */}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ReservasPage;