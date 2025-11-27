import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Bell, User, LayoutDashboard, Users, ClipboardList, Settings2, Calendar, Settings, Scale, BookOpen, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Header = () => {
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
      <nav className="sesi-gradient-primary">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold">SESI PEI</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-white/20 ${
                      isActive(item.path) ? 'bg-white/20' : ''
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative text-white hover:bg-white/20">
                  <Bell className="h-5 w-5" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <p className="text-sm font-semibold mb-2">Notificações</p>
                  <div className="space-y-2">
                    <div className="p-2 rounded hover:bg-muted cursor-pointer">
                      <p className="text-sm">Reunião agendada com os pais de Maria Silva</p>
                      <p className="text-xs text-muted-foreground">Hoje, 14:00</p>
                    </div>
                    <div className="p-2 rounded hover:bg-muted cursor-pointer">
                      <p className="text-sm">Nova observação pendente de revisão</p>
                      <p className="text-xs text-muted-foreground">Há 2 horas</p>
                    </div>
                    <div className="p-2 rounded hover:bg-muted cursor-pointer">
                      <p className="text-sm">Relatório trimestral disponível</p>
                      <p className="text-xs text-muted-foreground">Ontem</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="hidden md:inline">Patricia Cecy</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Minha Agenda
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
