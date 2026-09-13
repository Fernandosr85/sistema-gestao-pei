import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import DemoStoreProvider from "./store/DemoStoreProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <DemoStoreProvider>
    <App />
  </DemoStoreProvider>,
);
