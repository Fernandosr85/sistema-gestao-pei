import { useState } from 'react';
import { Settings, Bell, Palette, Shield, Plug, Globe, Accessibility } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  applyA11yPreferences,
  defaultA11yPreferences,
  loadA11yPreferences,
  saveA11yPreferences,
  type A11yPreferences,
  type FontSizePreference,
  type PreferenceSaveResult,
} from '@/lib/a11yPreferences';
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
import DemoDataNotice from '@/components/DemoDataNotice';

interface ConfiguracoesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConfiguracoesDialog = ({ open, onOpenChange }: ConfiguracoesDialogProps) => {
  const [selectedTab, setSelectedTab] = useState('notificacoes');

  /*
   * As preferências de acessibilidade são as únicas desta tela que fazem algo. Ficam em
   * chave própria do navegador, fora do store de demonstração, e são aplicadas na hora.
   */
  const [preferences, setPreferences] = useState<A11yPreferences>(() => loadA11yPreferences());
  const [saveResult, setSaveResult] = useState<PreferenceSaveResult>('browser');

  const commitPreferences = (proximas: A11yPreferences) => {
    setPreferences(proximas);
    applyA11yPreferences(proximas);
    setSaveResult(saveA11yPreferences(proximas));
  };

  const updatePreference = <K extends keyof A11yPreferences>(
    chave: K,
    valor: A11yPreferences[K],
  ) => {
    commitPreferences({ ...preferences, [chave]: valor });
  };

  const resetPreferences = () => commitPreferences(defaultA11yPreferences);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6" />
            Configurações - {DEMO_USER_NAME}
          </DialogTitle>
          <DialogDescription>
            Preferências de notificação, aparência, privacidade, integrações, idioma e
            acessibilidade.
          </DialogDescription>
        </DialogHeader>

        <DemoDataNotice
          id="configuracoes-ilustrativas"
          subject="As preferências de notificação, aparência, privacidade, integrações e idioma"
          detail="Nenhuma delas é salva nem aplicada ao sistema, e nenhuma notificação é enviada; os campos estão desabilitados. A aba Acessibilidade é a exceção: ela funciona e guarda a escolha neste navegador."
        />

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
            <fieldset disabled aria-describedby="configuracoes-ilustrativas" className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificações por Email</CardTitle>
                <CardDescription>Nenhum e-mail é enviado neste protótipo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email1" />
                  <label htmlFor="email1" className="text-sm">Resumo diário (às 18h)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email2" />
                  <label htmlFor="email2" className="text-sm">Alertas de prazos (3 dias antes)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email3" />
                  <label htmlFor="email3" className="text-sm">Mensagens de famílias</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email4" />
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
                  <RadioGroup defaultValue="nunca" className="mt-2">
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
                  <Checkbox id="push1" />
                  <label htmlFor="push1" className="text-sm">Mensagens urgentes de famílias</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push2" />
                  <label htmlFor="push2" className="text-sm">Alertas de crises (alunos)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push3" />
                  <label htmlFor="push3" className="text-sm">Lembretes de reuniões (30 min antes)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push4" />
                  <label htmlFor="push4" className="text-sm">Tarefas com vencimento hoje</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push5" />
                  <label htmlFor="push5" className="text-sm">Todas as atualizações</label>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dnd" />
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
                      <Checkbox id="dnd-weekend" />
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
                  <Checkbox id="sys2" />
                  <label htmlFor="sys2" className="text-sm">Som ao receber notificação</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sys3" />
                  <label htmlFor="sys3" className="text-sm">Notificações desktop (navegador)</label>
                </div>
              </CardContent>
            </Card>
            </fieldset>
          </TabsContent>

          {/* APARÊNCIA */}
          <TabsContent value="aparencia" className="space-y-6">
            <fieldset disabled aria-describedby="configuracoes-ilustrativas" className="min-w-0 space-y-6">
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
                {/* O tamanho da fonte saiu daqui: é o único controle desta aba que funciona,
                    e ficava desabilitado junto com os ilustrativos. Foi para Acessibilidade. */}
                <p className="text-sm text-muted-foreground">
                  O tamanho da fonte mudou de lugar: agora fica na aba Acessibilidade, onde
                  funciona de verdade e é guardado neste navegador.
                </p>

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
            </fieldset>
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
            <fieldset disabled aria-describedby="configuracoes-ilustrativas" className="min-w-0 space-y-6">
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
            </fieldset>
          </TabsContent>

          {/* ACESSIBILIDADE */}
          <TabsContent value="acessibilidade" className="space-y-6">
            {/*
              * Única aba que funciona de verdade. As preferências valem só neste navegador,
              * são aplicadas assim que mudam e não passam pelo botão Salvar, que continua
              * desabilitado por causa das outras abas.
              */}
            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
              <p className="font-medium">Preferências deste navegador</p>
              <p id="preferencias-aplicadas" className="text-muted-foreground">
                {saveResult === 'memoryOnly'
                  ? 'Aplicadas agora, mas o navegador não permitiu gravar: voltam ao padrão ao recarregar a página.'
                  : 'Aplicadas assim que você muda e guardadas neste navegador. Não dependem de conta nem saem daqui.'}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle level={2}>Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acc-contraste"
                    checked={preferences.altoContraste}
                    onCheckedChange={(checked) => updatePreference('altoContraste', checked === true)}
                    aria-describedby="acc-contraste-descricao"
                  />
                  <div>
                    <label htmlFor="acc-contraste" className="text-sm font-medium">Alto contraste</label>
                    <p id="acc-contraste-descricao" className="text-xs text-muted-foreground">
                      Escurece texto, bordas e cores de marca, e tira o fundo azulado da página.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="acc-fonte">Tamanho da fonte</Label>
                  <Select
                    value={preferences.tamanhoFonte}
                    onValueChange={(value) => updatePreference('tamanhoFonte', value as FontSizePreference)}
                  >
                    <SelectTrigger id="acc-fonte" className="mt-2" aria-describedby="acc-fonte-descricao">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="padrao">Padrão</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                      <SelectItem value="muito-grande">Muito grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <p id="acc-fonte-descricao" className="mt-1 text-xs text-muted-foreground">
                    Aumenta o texto e, junto com ele, espaçamentos e controles. O zoom do
                    navegador continua funcionando por cima disto.
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acc-animacoes"
                    checked={preferences.reduzirAnimacoes}
                    onCheckedChange={(checked) => updatePreference('reduzirAnimacoes', checked === true)}
                    aria-describedby="acc-animacoes-descricao"
                  />
                  <div>
                    <label htmlFor="acc-animacoes" className="text-sm font-medium">Reduzir animações</label>
                    <p id="acc-animacoes-descricao" className="text-xs text-muted-foreground">
                      Encurta transições e animações. Se o sistema operacional já pedir menos
                      movimento, isto já vale sem precisar marcar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle level={2}>Navegação por teclado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acc-foco"
                    checked={preferences.destacarFoco}
                    onCheckedChange={(checked) => updatePreference('destacarFoco', checked === true)}
                    aria-describedby="acc-foco-descricao"
                  />
                  <div>
                    <label htmlFor="acc-foco" className="text-sm font-medium">Destacar o foco do teclado</label>
                    <p id="acc-foco-descricao" className="text-xs text-muted-foreground">
                      Contorno mais espesso no elemento que está com o foco.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acc-alvos"
                    checked={preferences.botoesMaiores}
                    onCheckedChange={(checked) => updatePreference('botoesMaiores', checked === true)}
                    aria-describedby="acc-alvos-descricao"
                  />
                  <div>
                    <label htmlFor="acc-alvos" className="text-sm font-medium">Aumentar o tamanho dos botões</label>
                    <p id="acc-alvos-descricao" className="text-xs text-muted-foreground">
                      Alvo mínimo de 44 pixels em botões e links, útil para quem usa toque ou
                      tem dificuldade de mirar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle level={2}>O que não fica aqui</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Leitor de tela, navegação por voz e descrição de imagens em áudio são
                  recursos do sistema operacional ou de tecnologia assistiva, e não de um
                  site. O sistema é feito para funcionar com eles; ligá-los ou desligá-los é
                  nas preferências do seu aparelho.
                </p>
                <p>
                  Ampliação da página é o zoom do navegador, normalmente Ctrl e + ou Ctrl e −.
                  O sistema é testado com 200% de zoom.
                </p>
                <p>
                  Atalhos de teclado próprios ainda não existem. A navegação é a padrão do
                  navegador: Tab e Shift+Tab para andar, Enter ou Espaço para acionar.
                </p>
              </CardContent>
            </Card>

            <div>
              <Button variant="outline" onClick={resetPreferences}>
                Restaurar preferências de acessibilidade
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="outline" disabled aria-describedby="configuracoes-ilustrativas">Restaurar Padrões</Button>
          <Button disabled aria-describedby="configuracoes-ilustrativas">
            <Settings className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfiguracoesDialog;