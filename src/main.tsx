import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import DemoStoreProvider from "./store/DemoStoreProvider";
import { applyA11yPreferences, loadA11yPreferences } from "./lib/a11yPreferences";
import "./index.css";

// Antes de renderizar, para a página não aparecer no padrão e mudar em seguida.
applyA11yPreferences(loadA11yPreferences());

createRoot(document.getElementById("root")!).render(
  <DemoStoreProvider>
    <App />
  </DemoStoreProvider>,
);
