import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const rol = (localStorage.getItem("rol") || "").toLowerCase();
  const isAdmin = rol === "admin";

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  };

  return (
    <nav
      style={{
        background: "#1976d2",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "18px" }}>

        <Link to="/perfil" style={linkStyle}>
          Perfil
        </Link>

        <Link to="/espacios" style={linkStyle}>
          Espacios
        </Link>

        <Link to="/estado" style={linkStyle}>
          Estado Sistema
        </Link>

        {/* SOLO USUARIO */}
        {!isAdmin && (
          <>
            <Link to="/reservas/crear" style={linkStyle}>
              Crear Reserva
            </Link>

            <Link to="/mis-reservas" style={linkStyle}>
              Mis Reservas
            </Link>
          </>
        )}

        {/* SOLO ADMIN */}
        {isAdmin && (
          <>
            <Link to="/reservas" style={linkStyle}>
              Todas las Reservas
            </Link>

            <Link to="/gestion-reservas" style={linkStyle}>
              Gestión Reservas
            </Link>

            <Link to="/usuarios" style={linkStyle}>
              Usuarios
            </Link>
          </>
        )}
      </div>

      <button
        onClick={cerrarSesion}
        style={{
          background: "#e74c3c",
          border: "none",
          padding: "6px 12px",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </nav>
  );
}

export default Navbar;