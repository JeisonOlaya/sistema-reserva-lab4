import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registrarUsuario } from "../../services/usuarioService";
import Navbar from "../../components/Navbar";

function RegistrarUsuarioPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "usuario",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registrarUsuario(form);

      await Swal.fire({
        icon: "success",
        title: "Usuario registrado",
        text: "Ahora inicia sesión con tus credenciales",
        confirmButtonText: "Ir al Login",
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible registrar el usuario",
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container register-wrapper">

        <div className="register-card">

          <h1>Registro de Usuario</h1>

          <form onSubmit={handleSubmit} className="register-form">

            <input
              className="input"
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="email"
              name="correo"
              placeholder="Correo"
              value={form.correo}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <select
              className="input"
              name="rol"
              value={form.rol}
              onChange={handleChange}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>

            <button className="btn btn-blue" type="submit">
              Registrarse
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default RegistrarUsuarioPage;