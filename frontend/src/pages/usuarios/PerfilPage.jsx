import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { obtenerMiPerfil } from "../../services/usuarioService";

function PerfilPage() {
  const [usuario, setUsuario] = useState(null);

  const cargarPerfil = async () => {
    try {
      const data = await obtenerMiPerfil();
      setUsuario(data);
    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error",
        "No fue posible cargar el perfil",
        "error"
      );
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  if (!usuario) {
    return (
      <>
        <Navbar />
        <div className="perfil-wrapper">
          <p>Cargando perfil...</p>
        </div>
      </>
    );
  }

  const rol = (usuario.rol || "").toLowerCase();

  return (
    <>
      <Navbar />

      <div className="perfil-wrapper">
        <div className="card perfil-card">
          <img
            className="avatar"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="perfil"
          />

          <h1>Mi Perfil</h1>

          <p>
            <strong>ID:</strong> {usuario.id_usuario}
          </p>

          <p>
            <strong>Nombre:</strong> {usuario.nombre}
          </p>

          <p>
            <strong>Correo:</strong> {usuario.correo}
          </p>

          <p>
            <strong>Rol:</strong> {usuario.rol}
          </p>

          <div
            className={`badge ${
              rol === "admin"
                ? "badge-admin"
                : "badge-user"
            }`}
          >
            {usuario.rol}
          </div>
        </div>
      </div>
    </>
  );
}

export default PerfilPage;