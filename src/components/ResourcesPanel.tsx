import { Users, Laptop, BookOpen, School } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ResourcesPanel = () => {
  const resources = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: 'APOIO HUMANO',
      total: '18 profis.',
      items: [
        { label: 'Atuando', value: 16 },
        { label: 'Afastados', value: 2 },
        { label: 'Necessário', value: '+3' }
      ],
      coverage: 85,
    },
    {
      icon: <Laptop className="h-6 w-6 text-primary" />,
      title: 'TECNOLOGIA ASSISTIVA',
      total: '45 recursos',
      items: [
        { label: 'Tablets', value: 12 },
        { label: 'Softwares', value: 18 },
        { label: 'CAA', value: 10 },
        { label: 'Outros', value: 5 }
      ],
      coverage: 78,
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: 'MATERIAIS ADAPTADOS',
      total: '234 itens',
      items: [
        { label: 'Português', value: 89 },
        { label: 'Matemática', value: 76 },
        { label: 'Ciências', value: 45 },
        { label: 'Outros', value: 24 }
      ],
      coverage: null,
      additionalInfo: 'Compartilhados na biblioteca: 156',
      link: { label: 'Ir para a Biblioteca de Recursos', to: '/biblioteca-recursos' }
    },
    {
      icon: <School className="h-6 w-6 text-primary" />,
      title: 'SALAS AEE',
      total: '8 salas',
      items: [
        { label: 'Ativas', value: 8 },
        { label: 'Atendimentos/semana', value: 124 },
        { label: 'Taxa ocupação', value: null }
      ],
      coverage: 92,
      additionalInfo: 'Necessário: +2 salas (previsão)',
      link: { label: 'Ir para a Agenda de Atendimentos', to: '/agenda-atendimentos' }
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          RECURSOS E INTERVENÇÕES
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribuição e efetividade dos recursos disponíveis
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="bg-card border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">Total: {resource.total}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {resource.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">├─ {item.label}:</span>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                {resource.coverage !== null && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-foreground">
                        Taxa de {resource.title.includes('HUMANO') ? 'cobertura' : resource.title.includes('SALAS') ? 'ocupação' : 'utilização'}:
                      </span>
                      <span className="font-bold text-foreground">{resource.coverage}%</span>
                    </div>
                    <Progress value={resource.coverage} className="h-2" />
                  </div>
                )}

                {resource.additionalInfo && (
                  <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded">
                    {resource.additionalInfo}
                  </div>
                )}

                {resource.link && (
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary" asChild>
                    <Link to={resource.link.to}>{resource.link.label} →</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesPanel;
