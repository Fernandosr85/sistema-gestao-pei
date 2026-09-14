import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import NewStudent from "./pages/NewStudent";
import Observations from "./pages/Observations";
import NewObservation from "./pages/NewObservation";
import Reports from "./pages/Reports";
import ComplexityAnalysis from "./pages/ComplexityAnalysis";
import Legislation from "./pages/Legislation";
import Manual from "./pages/Manual";
import ResourceLibrary from "./pages/ResourceLibrary";
import AgendaAtendimentos from "./pages/AgendaAtendimentos";
import Gestao from "./pages/Gestao";
import MinhaAgenda from "./pages/MinhaAgenda";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import DemoStorageNotice from "./components/DemoStorageNotice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Pular para o conteúdo
          </a>
          <Header />
          <DemoStorageNotice />
          <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alunos" element={<Students />} />
            <Route path="/alunos/novo" element={<NewStudent />} />
            <Route path="/alunos/:id" element={<StudentDetail />} />
            <Route path="/observacoes" element={<Observations />} />
            <Route path="/observacoes/nova" element={<NewObservation />} />
            
            {/* Nova página Gestão com tabs */}
            <Route path="/gestao" element={<Gestao />} />
            
            {/* Redirecionamentos das páginas antigas para as novas tabs */}
            <Route path="/relatorios" element={<Navigate to="/gestao?tab=relatorios" replace />} />
            <Route path="/analise-complexidade" element={<Navigate to="/gestao?tab=analise" replace />} />
            
            {/* Manter rotas antigas por compatibilidade (podem ser removidas após transição) */}
            <Route path="/analise" element={<Navigate to="/gestao?tab=analise" replace />} />
            
            <Route path="/legislacao" element={<Legislation />} />
            <Route path="/manual" element={<Manual />} />
            <Route path="/biblioteca-recursos" element={<ResourceLibrary />} />
            <Route path="/agenda-atendimentos" element={<AgendaAtendimentos />} />
            <Route path="/minha-agenda" element={<MinhaAgenda />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
