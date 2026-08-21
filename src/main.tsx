import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AccesoPage } from "./pages/acceso";
import { BoletinPage } from "./pages/boletin";
import { PortalPage } from "./pages/portal";
import { PqrsfPage } from "./pages/pqrsf";
import { AuthProvider } from "./lib/auth";
import { ContentProvider } from "./lib/content-context";
import { TemaProvider } from "./lib/theme";
import "./styles/globals.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <TemaProvider>
        <ContentProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/acceso" element={<AccesoPage />} />
              <Route path="/portal" element={<PortalPage />} />
              <Route path="/pqrsf" element={<PqrsfPage />} />
            <Route path="/boletines/:slug" element={<BoletinPage />} />
              <Route path="*" element={<App />} />
            </Routes>
          </AuthProvider>
        </ContentProvider>
      </TemaProvider>
    </BrowserRouter>
  </StrictMode>,
);
