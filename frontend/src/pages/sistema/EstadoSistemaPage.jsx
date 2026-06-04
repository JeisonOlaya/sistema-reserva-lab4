import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { obtenerEstadoSistema } from "../../services/estadoService";
import Swal from "sweetalert2";

function EstadoSistemaPage() {
  const [info, setInfo] = useState(null);

  const cargar = async () => {
    try {
      const data = await obtenerEstadoSistema();
      setInfo(data);
    } catch (error) {
      Swal.fire(
        "Error",
        "No se pudo obtener el estado del sistema",
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

      <div className="estado-wrapper">

        {info && (
          <div className="card estado-card">

            <h1>Estado del Sistema</h1>

            <p>
              <strong>Estado:</strong> {info.estado}
            </p>

            <p>
              <strong>Aplicación:</strong> {info.aplicacion}
            </p>

            <p>
              <strong>Versión:</strong> {info.version}
            </p>

            <p>
              <strong>Swagger:</strong> {info.documentacion_swagger}
            </p>

            <p>
              <strong>Redoc:</strong> {info.documentacion_redoc}
            </p>

          </div>
        )}
      </div>
    </>
  );
}

export default EstadoSistemaPage;