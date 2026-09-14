import { useState } from 'react';
import { Settings, Bell, Palette, Shield, Plug, Globe, Accessibility } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { CalendarIntegrations } from '@/components/CalendarIntegrations';
import { DEMO_USER_NAME } from '@/config/institution';

interface ConfiguracoesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConfiguracoesDialog = ({ open, onOpenChange }: ConfiguracoesDialogProps) => {
  const [selectedTab, setSelectedTab] = useState('notificacoes');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6" />
            Configurações - {DEMO_USER_NAME}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="notificacoes">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="aparencia">
              <Palette className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="privacidade">
              <Shield className="h-4 w-4 mr-2" />
              Privacidade
            </TabsTrigger>
            <TabsTrigger value="integracoes">
              <Plug className="h-4 w-4 mr-2" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="idioma">
              <Globe className="h-4 w-4 mr-2" />
              Idioma
            </TabsTrigger>
            <TabsTrigger value="acessibilidade">
              <Accessibility className="h-4 w-4 mr-2" />
              Acessibilidade
            </TabsTrigger>
          </TabsList>

          {/* NOTIFICAÇÕES */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificações por Email</CardTitle>
                <CardDescription>Enviar para: professor.demo@example.org</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email1" defaultChecked />
                  <label htmlFor="email1" className="text-sm">Resumo diário (às 18h)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email2" defaultChecked />
                  <label htmlFor="email2" className="text-sm">Alertas de prazos (3 dias antes)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email3" defaultChecked />
                  <label htmlFor="email3" className="text-sm">Mensagens de famílias</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email4" defaultChecked />
                  <label htmlFor="email4" className="text-sm">Novos comentários em observações</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email5" />
                  <label htmlFor="email5" className="text-sm">Atualizações do sistema</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email6" />
                  <label htmlFor="email6" className="text-sm">Newsletter semanal</label>
                </div>

                <div className="pt-4">
                  <Label>Frequência de resumos:</Label>
                  <RadioGroup defaultValue="diario" className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diario" id="freq1" />
                      <label htmlFor="freq1" className="text-sm">Diário</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="semanal" id="freq2" />
                      <label htmlFor="freq2" className="text-sm">Semanal</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nunca" id="freq3" />
                      <label htmlFor="freq3" className="text-sm">Nunca</label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificações Push (App Mobile)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="push1" defaultChecked />
                  <label htmlFor="push1" className="text-sm">Mensagens urgentes de famílias</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push2" defaultChecked />
                  <label htmlFor="push2" className="text-sm">Alertas de crises (alunos)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push3" defaultChecked />
                  <label htmlFor="push3" className="text-sm">Lembretes de reuniões (30 min antes)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push4" defaultChecked />
                  <label htmlFor="push4" className="text-sm">Tarefas com vencimento hoje</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push5" />
                  <label htmlFor="push5" className="text-sm">Todas as atualizações</label>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dnd" defaultChecked />
                    <label htmlFor="dnd" className="text-sm font-medium">Ativar Não Perturbe em horários específicos</label>
                  </div>
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Das</Label>
                      <Input type="time" defaultValue="22:00" className="w-32" />
                      <Label>às</Label>
                      <Input type="time" defaultValue="07:00" className="w-32" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dnd-weekend" defaultChecked />
                      <label htmlFor="dnd-weekend" className="text-sm">Sábados e Domingos</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificações no Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sys1" defaultChecked />
                  <label htmlFor="sys1" className="text-sm">Mostrar badge com contador no ícone 🔔</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sys2" defaultChecked />
                  <label htmlFor="sys2" className="text-sm">Som ao receber notificação</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sys3" defaultChecked />
                  <label htmlFor="sys3" className="text-sm">Notificações desktop (navegador)</label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APARÊNCIA */}
          <TabsContent value="aparencia" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup defaultValue="claro">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="claro" id="theme1" />
                    <label htmlFor="theme1" className="text-sm">Claro</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="escuro" id="theme2" />
                    <label htmlFor="theme2" className="text-sm">Escuro</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="theme3" />
                    <label htmlFor="theme3" className="text-sm">Automático (segue sistema)</label>
                  </div>
                </RadioGroup>

                <div className="mt-6 p-4 border rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Preview do tema selecionado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cores de Destaque</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="azul">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="azul" id="color1" />
                    <label htmlFor="color1" className="text-sm">Azul institucional (padrão)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="verde" id="color2" />
                    <label htmlFor="color2" className="text-sm">Verde</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roxo" id="color3" />
                    <label htmlFor="color3" className="text-sm">Roxo</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="laranja" id="color4" />
                    <label htmlFor="color4" className="text-sm">Laranja</label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Densidade da Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="confortavel">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compacta" id="density1" />
                    <label htmlFor="density1" className="text-sm">Compacta</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confortavel" id="density2" />
                    <label htmlFor="density2" className="text-sm">Confortável</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="espacosa" id="density3" />
                    <label htmlFor="density3" className="text-sm">Espaçosa</label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="font-size">Tamanho</Label>
                  <Select defaultValue="medio">
                    <SelectTrigger id="font-size" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeno">Pequeno</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                      <SelectItem value="muito-grande">Muito grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="font-type">Tipo</Label>
                  <Select defaultValue="inter">
                    <SelectTrigger id="font-type" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter (padrão)</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PRIVACIDADE */}
          <TabsContent value="privacidade" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacidade e direitos do titular</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este protótipo não tem contas de usuário, autenticação, controle de visibilidade
                  de perfil nem atendimento aos direitos do titular previstos na LGPD. Antes de
                  qualquer uso com dados reais, consulte a seção "Antes de usar com dados reais"
                  do README do projeto.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INTEGRAÇÕES */}
          <TabsContent value="integracoes" className="space-y-6">
            <CalendarIntegrations />
          </TabsContent>

          {/* IDIOMA */}
          <TabsContent value="idioma" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Idioma e Região</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="idioma">Idioma da interface</Label>
                  <Select defaultValue="pt-br">
                    <SelectTrigger id="idioma" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Fuso horário</Label>
                  <Select defaultValue="america-sp">
                    <SelectTrigger id="timezone" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-sp">America/Sao_Paulo (GMT-3)</SelectItem>
                      <SelectItem value="america-ny">America/New_York (GMT-5)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Formato de data</Label>
                  <RadioGroup defaultValue="dd-mm-yyyy" className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dd-mm-yyyy" id="date1" />
                      <label htmlFor="date1" className="text-sm">DD/MM/AAAA</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mm-dd-yyyy" id="date2" />
                      <label htmlFor="date2" className="text-sm">MM/DD/AAAA</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yyyy-mm-dd" id="date3" />
                      <label htmlFor="date3" className="text-sm">AAAA-MM-DD</label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Formato de hora</Label>
                  <RadioGroup defaultValue="24h" className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="24h" id="time1" />
                      <label htmlFor="time1" className="text-sm">24 horas (14:30)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="12h" id="time2" />
                      <label htmlFor="time2" className="text-sm">12 horas (2:30 PM)</label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACESSIBILIDADE */}
          <TabsContent value="acessibilidade" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="acc1" />
                  <label htmlFor="acc1" className="text-sm">Alto contraste</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="acc2" />
                  <label htmlFor="acc2" className="text-sm">Aumentar tamanho dos botões</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="acc3" />
                  <label htmlFor="acc3" className="text-sm">Destacar foco do teclado</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="acc4" />
                  <label htmlFor="acc4" className="text-sm">Reduzir animações</label>
                </div>

                <div className="pt-4">
                  <Label htmlFor="zoom">Ampliação</Label>
                  <Select defaultValue="100">
                    <SelectTrigger id="zoom" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100%</SelectItem>
                      <SelectItem value="125">125%</SelectItem>
                      <SelectItem value="150">150%</SelectItem>
                      <SelectItem value="200">200%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navegação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox id="acc5" defaultChecked />
                    <label htmlFor="acc5" className="text-sm">Atalhos de teclado habilitados</label>
                  </div>
                  <Button variant="link" className="p-0 h-auto">Ver lista de atalhos</Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="acc6" />
                  <label htmlFor="acc6" className="text-sm">Navegação por voz</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Áudio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="acc7" />
                  <label htmlFor="acc7" className="text-sm">Leitor de tela</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="acc8" />
                  <label htmlFor="acc8" className="text-sm">Descrições de áudio para imagens</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cache">Cache local</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm">Tamanho: 127 MB</p>
                    <Button variant="outline" size="sm">Limpar cache</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="outline">Restaurar Padrões</Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfiguracoesDialog;