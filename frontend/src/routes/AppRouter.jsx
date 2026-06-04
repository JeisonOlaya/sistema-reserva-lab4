import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import PerfilPage from "../pages/usuarios/PerfilPage";
import UsuariosPage from "../pages/usuarios/UsuariosPage";
import RegistrarUsuarioPage from "../pages/usuarios/RegistrarUsuarioPage";

import EspaciosPage from "../pages/espacios/EspaciosPage";
import CrearEspacioPage from "../pages/espacios/CrearEspacioPage";
import EditarEspacioPage from "../pages/espacios/EditarEspacioPage";

import CrearReservaPage from "../pages/reservas/CrearReservaPage";
import MisReservasPage from "../pages/reservas/MisReservasPage";
import ReservasPage from "../pages/reservas/ReservasPage";
import GestionReservasPage from "../pages/reservas/GestionReservasPage";

import EstadoSistemaPage from "../pages/sistema/EstadoSistemaPage";

import PrivateRoute from "../components/PrivateRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/usuarios/registrar" element={<RegistrarUsuarioPage />} />

        <Route path="/perfil" element={<PrivateRoute><PerfilPage /></PrivateRoute>} />

        <Route path="/espacios" element={<PrivateRoute><EspaciosPage /></PrivateRoute>} />
        <Route path="/espacios/crear" element={<PrivateRoute><CrearEspacioPage /></PrivateRoute>} />
        <Route path="/espacios/editar/:id" element={<PrivateRoute><EditarEspacioPage /></PrivateRoute>} />

        <Route path="/usuarios" element={<PrivateRoute><UsuariosPage /></PrivateRoute>} />

        <Route path="/reservas" element={<PrivateRoute><ReservasPage /></PrivateRoute>} />
        <Route path="/mis-reservas" element={<PrivateRoute><MisReservasPage /></PrivateRoute>} />
        <Route path="/reservas/crear" element={<PrivateRoute><CrearReservaPage /></PrivateRoute>} />
        <Route path="/gestion-reservas" element={<PrivateRoute><GestionReservasPage /></PrivateRoute>} />

        <Route path="/estado" element={<PrivateRoute><EstadoSistemaPage /></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;