import { BookOpen, Users, FileCheck, GraduationCap, Heart, ClipboardList, BarChart3, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Manual = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Manual de Procedimentos para Inclusão</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Guia completo de práticas e procedimentos para educação inclusiva
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">LBI Lei 13.146/2015</Badge>
          <Badge variant="secondary">Desenho Universal (DUA)</Badge>
          <Badge variant="secondary">Teoria de Piaget</Badge>
          <Badge variant="secondary">Práticas Baseadas em Evidências</Badge>
        </div>
      </div>

      <Separator />

      {/* Navegação por Abas */}
      <Tabs defaultValue="identificacao" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
          <TabsTrigger value="identificacao" className="text-xs sm:text-sm">Identificação</TabsTrigger>
          <TabsTrigger value="pei" className="text-xs sm:text-sm">PEI</TabsTrigger>
          <TabsTrigger value="equipe" className="text-xs sm:text-sm">Equipe</TabsTrigger>
          <TabsTrigger value="protocolos" className="text-xs sm:text-sm">Protocolos</TabsTrigger>
          <TabsTrigger value="avaliacao" className="text-xs sm:text-sm">Avaliação</TabsTrigger>
        </TabsList>

        {/* 1. IDENTIFICAÇÃO E ACOLHIMENTO */}
        <TabsContent value="identificacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                1. Identificação e Acolhimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="matricula">
                  <AccordionTrigger className="text-lg font-semibold">
                    1.1 Matrícula e Anamnese Inicial
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Entrevista com família sobre histórico de desenvolvimento</li>
                      <li>Levantamento de laudos médicos e relatórios terapêuticos</li>
                      <li>Identificação de necessidades específicas de acessibilidade</li>
                      <li>Mapeamento de medicações e protocolos de saúde</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="avaliacao">
                  <AccordionTrigger className="text-lg font-semibold">
                    1.2 Avaliação Diagnóstica Pedagógica
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Aplicação de instrumentos de avaliação adaptados</li>
                      <li>Observação em diferentes contextos (sala, recreio, atividades)</li>
                      <li>Levantamento de potencialidades e desafios</li>
                      <li>Identificação do nível de desenvolvimento cognitivo (Piaget)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. PEI */}
        <TabsContent value="pei" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                2. Plano Educacional Individualizado (PEI)
              </CardTitle>
              <CardDescription>
                Estrutura completa do PEI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="parte1">
                  <AccordionTrigger className="text-lg font-semibold">
                    PARTE I - Identificação
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Dados do estudante</li>
                      <li>Diagnósticos e laudos</li>
                      <li>Equipe multidisciplinar envolvida</li>
                      <li>Terapias e atendimentos externos</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parte2">
                  <AccordionTrigger className="text-lg font-semibold">
                    PARTE II - Perfil do Estudante
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Histórico escolar</li>
                      <li>Avaliação de habilidades acadêmicas por componente curricular</li>
                      <li>Avaliação socioemocional e adaptativa</li>
                      <li>Interesses e motivações</li>
                      <li>Estilo de aprendizagem</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parte3">
                  <AccordionTrigger className="text-lg font-semibold">
                    PARTE III - Objetivos e Metas
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <p className="font-semibold mb-2">Por Componente Curricular:</p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Língua Portuguesa: objetivos específicos com adequações</li>
                        <li>Matemática: conceitos priorizados e recursos concretos</li>
                        <li>Ciências: experimentação adaptada</li>
                        <li>Geografia/História: contextualização significativa</li>
                        <li>Arte: expressão e comunicação alternativa</li>
                        <li>Educação Física: participação e adaptações motoras</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Habilidades Socioemocionais:</p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Autorregulação emocional</li>
                        <li>Interação social</li>
                        <li>Comunicação funcional</li>
                        <li>Autonomia</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parte4">
                  <AccordionTrigger className="text-lg font-semibold">
                    PARTE IV - Adaptações e Recursos
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <p className="font-semibold mb-2">Adaptações Curriculares:</p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>De acesso: físicas, materiais, comunicação</li>
                        <li>Metodológicas: estratégias diferenciadas</li>
                        <li>De avaliação: instrumentos alternativos</li>
                        <li>De temporalidade: mais tempo, quebra de tarefas</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Recursos Necessários:</p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Tecnologia assistiva</li>
                        <li>Material adaptado</li>
                        <li>Apoio humano (profissional de apoio)</li>
                        <li>Adequação de espaços</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parte5">
                  <AccordionTrigger className="text-lg font-semibold">
                    PARTE V - Estratégias Pedagógicas
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <p className="font-semibold mb-2">Sala de Aula Regular:</p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Metodologias ativas com adaptação</li>
                        <li>Aprendizagem concreta (Piaget)</li>
                        <li>Trabalho colaborativo em grupos</li>
                        <li>Uso de rotinas visuais</li>
                        <li>Antecipação de mudanças</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Atendimento Educacional Especializado:</p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Frequência e duração</li>
                        <li>Objetivos específicos do AEE</li>
                        <li>Recursos e materiais</li>
                        <li>Articulação com sala regular</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parte6">
                  <AccordionTrigger className="text-lg font-semibold">
                    PARTE VI - Avaliação e Monitoramento
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Critérios de avaliação individualizados</li>
                      <li>Periodicidade de revisão do PEI (trimestral)</li>
                      <li>Indicadores de progresso</li>
                      <li>Registro de evolução</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                3. Formação de Professores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="formacao-continuada">
                  <AccordionTrigger className="text-lg font-semibold">
                    3.1 Formação Continuada Obrigatória
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Módulo 1: Fundamentos da Educação Inclusiva (20h)</li>
                      <li>Módulo 2: Desenvolvimento Cognitivo e Aprendizagem (Piaget) (16h)</li>
                      <li>Módulo 3: Transtornos do Neurodesenvolvimento (24h)</li>
                      <li>Módulo 4: Elaboração e Execução do PEI (20h)</li>
                      <li>Módulo 5: Tecnologias Assistivas e CAA (16h)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="capacitacao">
                  <AccordionTrigger className="text-lg font-semibold">
                    3.2 Capacitação Específica por Condição
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>TEA: estratégias comportamentais e comunicação</li>
                      <li>TDAH: função executiva e autorregulação</li>
                      <li>Dislexia: consciência fonológica e métodos fônicos</li>
                      <li>Deficiência Intelectual: currículo funcional</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. EQUIPE */}
        <TabsContent value="equipe" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                4. Equipe Multidisciplinar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="composicao">
                  <AccordionTrigger className="text-lg font-semibold">
                    4.1 Composição e Atribuições
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-primary/50 bg-muted/30 rounded">
                        <p className="font-semibold">Coordenador Pedagógico</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>Supervisão da implementação do PEI</li>
                          <li>Articulação entre professores e especialistas</li>
                          <li>Formação em serviço</li>
                        </ul>
                      </div>

                      <div className="p-4 border-l-4 border-primary/50 bg-muted/30 rounded">
                        <p className="font-semibold">Professor da Sala Regular</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>Aplicação do PEI no cotidiano</li>
                          <li>Registro de observações</li>
                          <li>Comunicação com família</li>
                        </ul>
                      </div>

                      <div className="p-4 border-l-4 border-primary/50 bg-muted/30 rounded">
                        <p className="font-semibold">Professor do AEE</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>Atendimento especializado</li>
                          <li>Produção de materiais adaptados</li>
                          <li>Orientação aos professores</li>
                        </ul>
                      </div>

                      <div className="p-4 border-l-4 border-primary/50 bg-muted/30 rounded">
                        <p className="font-semibold">Profissional de Apoio Escolar</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>Apoio às atividades de vida diária</li>
                          <li>Auxílio na locomoção e alimentação</li>
                          <li className="font-semibold text-destructive">NÃO substitui professor</li>
                        </ul>
                      </div>

                      <div className="p-4 border-l-4 border-primary/50 bg-muted/30 rounded">
                        <p className="font-semibold">Equipe de Orientação (quando necessário)</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>Psicólogo educacional</li>
                          <li>Fonoaudiólogo</li>
                          <li>Terapeuta ocupacional</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                5. Articulação com Famílias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="comunicacao">
                  <AccordionTrigger className="text-lg font-semibold">
                    5.1 Comunicação Sistemática
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Reuniões bimestrais de acompanhamento do PEI</li>
                      <li>Agenda diária ou digital para comunicação</li>
                      <li>Relatórios trimestrais de desenvolvimento</li>
                      <li>Orientações para continuidade em casa</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="participacao">
                  <AccordionTrigger className="text-lg font-semibold">
                    5.2 Participação Ativa
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Família como coautora do PEI</li>
                      <li>Escuta das demandas e perspectivas familiares</li>
                      <li>Formação para pais sobre desenvolvimento e estratégias</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. PROTOCOLOS */}
        <TabsContent value="protocolos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                6. Protocolos Específicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="crise">
                  <AccordionTrigger className="text-lg font-semibold">
                    6.1 Crise Comportamental (TEA, TDAH)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Identificar gatilhos e sinais prévios</li>
                      <li>Aplicar estratégias de prevenção</li>
                      <li>Usar zona de autorregulação (espaço calmo)</li>
                      <li className="font-semibold text-destructive">Nunca usar contenção física inadequada</li>
                      <li>Registrar e analisar episódio</li>
                      <li>Comunicar família</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="comunicacao">
                  <AccordionTrigger className="text-lg font-semibold">
                    6.2 Comunicação Alternativa
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Pranchas de CAA (PCS, Boardmaker)</li>
                      <li>PECS (Sistema de Comunicação por Troca de Figuras)</li>
                      <li>Aplicativos: Livox, Matraquinha, Let Me Talk</li>
                      <li>Rotinas visuais (First-Then)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="comportamental">
                  <AccordionTrigger className="text-lg font-semibold">
                    6.3 Apoio Comportamental Positivo
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Análise funcional do comportamento</li>
                      <li>Ensino de habilidades alternativas</li>
                      <li>Reforço diferencial</li>
                      <li>Modificação de antecedentes</li>
                      <li className="font-semibold text-destructive">Nunca punição ou exclusão</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                9. Documentação Obrigatória
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pasta">
                  <AccordionTrigger className="text-lg font-semibold">
                    9.1 Pasta Individual
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Laudo médico atualizado</li>
                      <li>PEI vigente e histórico</li>
                      <li>Relatórios de acompanhamento</li>
                      <li>Registro de adaptações de provas</li>
                      <li>Comunicações com família</li>
                      <li>Pareceres da equipe multidisciplinar</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="confidencialidade">
                  <AccordionTrigger className="text-lg font-semibold">
                    9.2 Confidencialidade
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Acesso restrito à equipe pedagógica</li>
                      <li>Termo de consentimento da família</li>
                      <li>Sigilo profissional</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. AVALIAÇÃO */}
        <TabsContent value="avaliacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                7. Avaliação Adaptada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="principios">
                  <AccordionTrigger className="text-lg font-semibold">
                    7.1 Princípios
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Avaliação processual e formativa</li>
                      <li>Múltiplos instrumentos</li>
                      <li>Foco no progresso individual</li>
                      <li>Valorização de diferentes formas de expressão</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="estrategias">
                  <AccordionTrigger className="text-lg font-semibold">
                    7.2 Estratégias
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Provas orais ou com escriba</li>
                      <li>Mais tempo para realização</li>
                      <li>Questões com suporte visual</li>
                      <li>Demonstração prática de conhecimento</li>
                      <li>Portfólio de evidências</li>
                      <li>Avaliação por competências</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                10. Indicadores de Qualidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="monitoramento">
                  <AccordionTrigger className="text-lg font-semibold">
                    10.1 Monitoramento Institucional
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Taxa de implementação de PEI: 100%</li>
                      <li>Formação de professores: mínimo 40h/ano</li>
                      <li>Satisfação das famílias: &gt; 80%</li>
                      <li>Progressão dos estudantes: análise individualizada</li>
                      <li>Participação em atividades coletivas: &gt; 70%</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="revisao">
                  <AccordionTrigger className="text-lg font-semibold">
                    10.2 Revisão Contínua
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Avaliação trimestral do PEI</li>
                      <li>Reuniões mensais da equipe multidisciplinar</li>
                      <li>Supervisão semestral externa</li>
                      <li>Atualização anual dos protocolos</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Transições</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="anos">
                  <AccordionTrigger className="text-lg font-semibold">
                    8.1 Entre Anos/Séries
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Reunião de passagem entre professores</li>
                      <li>Atualização do PEI</li>
                      <li>Apresentação prévia do novo ambiente</li>
                      <li>Manutenção de rotinas conhecidas</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="medio">
                  <AccordionTrigger className="text-lg font-semibold">
                    8.2 Para Ensino Médio/Profissionalizante
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Orientação vocacional adaptada</li>
                      <li>Desenvolvimento de habilidades para vida independente</li>
                      <li>Articulação com cursos técnicos e profissionalizantes</li>
                      <li>Preparação para mundo do trabalho</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recursos Complementares */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Recursos Complementares</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold mb-2">Plataformas e Materiais:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Portal de Educação Inclusiva da instituição</li>
              <li>Banco de materiais adaptados</li>
              <li>Biblioteca de CAA</li>
              <li>Repositório de boas práticas</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Parcerias Externas:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Universidades para pesquisa e extensão</li>
              <li>Centros de referência em inclusão</li>
              <li>Organizações de famílias (Autismo & Realidade, ABDA, ABD)</li>
              <li>Rede de terapeutas parceiros</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Este manual deve ser revisado anualmente e está alinhado com: Diretrizes da LBI (Lei 13.146/2015), 
            Princípios de Desenho Universal para Aprendizagem (DUA), Teoria de Desenvolvimento Cognitivo de Piaget, 
            Práticas baseadas em evidências científicas e valores institucionais de educação inclusiva.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Manual;
