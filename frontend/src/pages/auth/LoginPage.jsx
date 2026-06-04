import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../../services/authService";

function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(correo, password);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("nombre", data.nombre);
      localStorage.setItem("rol", data.rol);

      await Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: data.nombre,
      });

      navigate("/perfil");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Sistema de Reservas</h1>

        <form onSubmit={handleLogin} className="login-form">
          <label>Correo</label>

          <input
            className="input"
            type="email"
            autoComplete="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label>Contraseña</label>

          <input
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-blue"
          >
            Ingresar
          </button>
        </form>

        <p className="text-muted">
          ¿No tienes cuenta?
        </p>

        <Link to="/usuarios/registrar">
          <button className="btn btn-green">
            Registrarse
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;