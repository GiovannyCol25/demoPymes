import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import { MainLayout } from "./layouts/MainLayout";
import { LoginPage } from "./pages/LoginPage";
import { Home } from "./pages/Home";
import { InventarioList } from "./pages/inventario/InventarioList";
import { InventarioForm } from "./pages/inventario/InventarioForm";
import { VentasList } from "./pages/ventas/VentasList";
import { VentaForm } from "./pages/ventas/VentaForm";
import { ComprasList } from "./pages/compras/ComprasList";
import { CompraForm } from "./pages/compras/CompraForm";
import { Reportes } from "./pages/reportes/Reportes";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="inventario" element={<InventarioList />} />
                <Route path="inventario/nuevo" element={<InventarioForm />} />
                <Route path="inventario/:id" element={<InventarioForm />} />
                <Route path="ventas" element={<VentasList />} />
                <Route path="ventas/nueva" element={<VentaForm />} />
                <Route path="compras" element={<ComprasList />} />
                <Route path="compras/nueva" element={<CompraForm />} />
                <Route path="reportes" element={<Reportes />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </AppProvider>
  );
}
