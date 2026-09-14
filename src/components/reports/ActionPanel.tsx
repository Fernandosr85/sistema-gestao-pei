import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, FolderOpen, Share2, Download, Printer, Plus } from 'lucide-react';

const ActionPanel = () => {
  return (
    <div className="space-y-6 sticky top-6">
      {/* Relatórios Disponíveis */}
      <Card className="shadow-lg bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-lg">RELATÓRIOS DISPONÍVEIS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-semibold mb-2 opacity-90">RELATÓRIOS AUTOMÁTICOS</p>
            <div className="flex items-center space-x-2">
              <Checkbox id="auto1" defaultChecked />
              <label htmlFor="auto1" className="text-sm cursor-pointer">
                Relatório mensal
              </label>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-2 opacity-90">RELATÓRIOS PERSONALIZADOS</p>
            <div className="flex items-center space-x-2">
              <Checkbox id="custom1" defaultChecked />
              <label htmlFor="custom1" className="text-sm cursor-pointer">
                Relatório de progressão
              </label>
            </div>
          </div>

          <div className="pt-2">
            <div className="bg-warning/20 border border-warning/30 rounded-lg p-3">
              <p className="text-xs font-semibold flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-warning"></span>
                5 alertas de atenção
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações de Relatório */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">AÇÕES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start gap-2" variant="default">
            <Plus className="h-4 w-4" />
            Criar novo relatório
          </Button>

          <div className="space-y-2">
            <Button className="w-full justify-start gap-2" variant="outline">
              <FolderOpen className="h-4 w-4" />
              Templates salvos
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline">
              <FileText className="h-4 w-4" />
              Meus relatórios
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>

          <Button className="w-full justify-start gap-2" variant="outline">
            <Share2 className="h-4 w-4" />
            Compartilhados comigo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionPanel;
