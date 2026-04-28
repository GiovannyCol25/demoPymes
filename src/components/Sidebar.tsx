import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Inicio", icon: "⌂" },
  { to: "/inventario", label: "Inventario", icon: "▤" },
  { to: "/ventas", label: "Ventas", icon: "◈" },
  { to: "/compras", label: "Compras", icon: "◇" },
  { to: "/reportes", label: "Reportes", icon: "▦" },
];

export function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">Inventario PYME</span>
        <span className="sidebar__tag">Panel demo</span>
      </div>
      <nav className="nav" aria-label="Principal">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => "nav__link" + (isActive ? " nav__link--active" : "")}
          >
            <span className="nav__icon" aria-hidden>
              {l.icon}
            </span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__tools">
        <button
          type="button"
          className="btn btn--ghost btn--block"
          onClick={() => {
            logout();
            nav("/login", { replace: true });
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
