import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, User, LayoutDashboard, Users, ClipboardList, Settings2, Calendar, Settings, Scale, BookOpen, Library, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MeuPerfilDialog from '@/components/MeuPerfilDialog';
import ConfiguracoesDialog from '@/components/ConfiguracoesDialog';
import { DEMO_USER_NAME, institution } from '@/config/institution';

const Header = () => {
  const [isPerfilOpen, setIsPerfilOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/gestao') {
      // Gestão está ativa se a rota for /gestao ou se for redirecionamento de análise/relatórios
      return location.pathname === '/gestao' || 
             location.pathname === '/analise-complexidade' || 
             location.pathname === '/relatorios' ||
             location.pathname === '/analise';
    }
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/alunos', icon: Users, label: 'Alunos' },
    { path: '/observacoes', icon: ClipboardList, label: 'Observações' },
    { path: '/gestao', icon: Settings2, label: 'Gestão' },
    { path: '/legislacao', icon: Scale, label: 'Legislação' },
    { path: '/manual', icon: BookOpen, label: 'Manual' },
    { path: '/biblioteca-recursos', icon: Library, label: 'Biblioteca' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav className="brand-gradient-primary">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold">{institution.shortName}</span>
            </Link>
            
            <ul className="hidden md:flex items-center gap-1 list-none">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                    className={`inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                      isActive(item.path) ? 'bg-white/20' : ''
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="md:hidden h-11 w-11 p-0 text-white hover:bg-white/20"
              aria-label={isMobileNavOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMobileNavOpen((open) => !open)}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20" aria-label="Menu da conta">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="hidden md:inline">{DEMO_USER_NAME}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsPerfilOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsConfigOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/minha-agenda')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Minha Agenda
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isMobileNavOpen && (
          <ul id="mobile-nav" className="md:hidden list-none border-t border-white/20 px-4 pb-3 pt-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center rounded-md px-3 py-2 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isActive(item.path) ? 'bg-white/20' : ''
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <MeuPerfilDialog open={isPerfilOpen} onOpenChange={setIsPerfilOpen} />
      <ConfiguracoesDialog open={isConfigOpen} onOpenChange={setIsConfigOpen} />
    </header>
  );
};

export default Header;
