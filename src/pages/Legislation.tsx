import { Gavel, FileText, Scale, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Legislation = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Gavel className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Marco Legal da Educação Inclusiva</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Legislação e normativas que fundamentam a educação inclusiva no Brasil
        </p>
      </div>

      <Separator />

      {/* Legislação Federal */}
      <Card>
        <CardHeader>
          <CardTitle level={2} className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Legislação Federal
          </CardTitle>
          <CardDescription>
            Leis e decretos federais que regem a educação inclusiva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ldb">
              <AccordionTrigger className="text-lg font-semibold">
                Lei nº 9.394/96 - LDB (Lei de Diretrizes e Bases da Educação Nacional)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="pl-4 border-l-4 border-primary/30">
                    <p className="font-semibold text-primary">Art. 58</p>
                    <p className="text-muted-foreground">Define educação especial como modalidade transversal</p>
                  </div>
                  <div className="pl-4 border-l-4 border-primary/30">
                    <p className="font-semibold text-primary">Art. 59</p>
                    <p className="text-muted-foreground">Garante currículos, métodos e recursos adaptados</p>
                  </div>
                  <div className="pl-4 border-l-4 border-primary/30">
                    <p className="font-semibold text-primary">Art. 60</p>
                    <p className="text-muted-foreground">Estabelece apoio técnico e financeiro para inclusão</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lbi">
              <AccordionTrigger className="text-lg font-semibold">
                Lei nº 13.146/2015 - Lei Brasileira de Inclusão (Estatuto da Pessoa com Deficiência)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="pl-4 border-l-4 border-primary/30">
                    <p className="font-semibold text-primary">Art. 27</p>
                    <p className="text-muted-foreground">Direito à educação inclusiva em todos os níveis</p>
                  </div>
                  <div className="pl-4 border-l-4 border-primary/30">
                    <p className="font-semibold text-primary">Art. 28 - Responsabilidades do sistema educacional:</p>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-muted-foreground">
                      <li>Projeto pedagógico institucional inclusivo</li>
                      <li>Profissionais de apoio escolar</li>
                      <li>Tecnologias assistivas</li>
                      <li>Atendimento Educacional Especializado (AEE)</li>
                      <li>Formação continuada de professores</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="decreto-10502">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  Decreto nº 10.502/2020
                  <Badge variant="destructive">Suspenso</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <p className="text-muted-foreground">
                  Tentou instituir a Política Nacional de Educação Especial
                </p>
                <p className="text-muted-foreground font-semibold">
                  Suspensão pelo STF mantém primazia da educação inclusiva
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tea">
              <AccordionTrigger className="text-lg font-semibold">
                Lei nº 12.764/2012 - Política Nacional de Proteção dos Direitos da Pessoa com TEA
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Garante acompanhante especializado quando necessário</li>
                  <li>Define TEA como deficiência para todos os efeitos legais</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="decreto-7611">
              <AccordionTrigger className="text-lg font-semibold">
                Decreto nº 7.611/2011
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Regulamenta o AEE no âmbito da educação especial</li>
                  <li>Define dupla matrícula (ensino regular + AEE)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Resoluções e Pareceres */}
      <Card>
        <CardHeader>
          <CardTitle level={2} className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resoluções e Pareceres do CNE
          </CardTitle>
          <CardDescription>
            Conselho Nacional de Educação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="res-4">
              <AccordionTrigger className="text-lg font-semibold">
                Resolução CNE/CEB nº 4/2009
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Institui Diretrizes Operacionais para o AEE</li>
                  <li>Define sala de recursos multifuncionais</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="parecer-13">
              <AccordionTrigger className="text-lg font-semibold">
                Parecer CNE/CEB nº 13/2009
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <p className="text-muted-foreground">
                  Orienta sobre diretrizes operacionais do AEE
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Legislação Estadual */}
      <Card>
        <CardHeader>
          <CardTitle level={2} className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Legislação Estadual (São Paulo)
          </CardTitle>
          <CardDescription>
            Normativas específicas do estado de São Paulo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="delib-68">
              <AccordionTrigger className="text-lg font-semibold">
                Deliberação CEE nº 68/2007
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <p className="text-muted-foreground">
                  Normas para educação de alunos com necessidades educacionais especiais
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="res-11">
              <AccordionTrigger className="text-lg font-semibold">
                Resolução SE nº 11/2008
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <p className="text-muted-foreground">
                  Dispõe sobre educação escolar de alunos com necessidades educacionais especiais
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Esta compilação está atualizada conforme a legislação vigente e deve ser consultada regularmente para atualizações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Legislation;
