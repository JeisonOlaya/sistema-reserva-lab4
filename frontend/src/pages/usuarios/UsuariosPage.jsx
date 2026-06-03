import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
} from "../../services/usuarioService";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [idBuscar, setIdBuscar] = useState("");

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible cargar los usuarios",
      });
    }
  };

  const buscarUsuario = async () => {
    if (!idBuscar) {
      cargarUsuarios();
      return;
    }

    try {
      const usuario = await obtenerUsuarioPorId(idBuscar);
      setUsuarios([usuario]);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Usuario no encontrado",
        text: `No existe un usuario con ID ${idBuscar}`,
      });
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Usuarios</h1>

        {/* 🔍 acciones */}
        <div className="actions-bar">
          <input
            className="input"
            type="number"
            placeholder="ID usuario"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />

          <button className="btn btn-blue" onClick={buscarUsuario}>
            Buscar
          </button>

          <button className="btn btn-green" onClick={cargarUsuarios}>
            Mostrar Todos
          </button>
        </div>

        {/* 📊 tabla */}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsuariosPage;