import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, FileText, Image, Video, Download, Eye } from 'lucide-react';
import DemoDataNotice from '@/components/DemoDataNotice';

interface AnexosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  totalAnexos: number;
}

export function AnexosDialog({ open, onOpenChange, studentName, totalAnexos }: AnexosDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // No medical reports here, not even as an example: a fixed report would show one student's
  // health record under every student's name.
  const peis = [
    {
      nome: 'PEI_2024_T4.pdf',
      data: '15/09/2024',
      tamanho: '856 KB',
      autor: 'Profª Marina Santos',
      ativo: true
    },
    {
      nome: 'PEI_2024_T3.pdf',
      data: '15/06/2024',
      tamanho: '782 KB',
      autor: 'Profª Marina Santos',
      ativo: false
    }
  ];

  const fotos = [
    { titulo: 'Atividade Leitura', data: '18/11/2024' },
    { titulo: 'Conquista Escrita', data: '15/11/2024' },
    { titulo: 'Trabalho Grupo', data: '10/11/2024' },
    { titulo: 'CAA Prancha', data: '05/11/2024' },
    { titulo: 'Ciências Experimento', data: '02/11/2024' },
    { titulo: 'Matemática Blocos', data: '28/10/2024' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Documentos e Anexos - {studentName}</DialogTitle>
          <p className="text-sm text-muted-foreground">Total de documentos: {totalAnexos}</p>
        </DialogHeader>

        <DemoDataNotice
          id="anexos-indisponiveis"
          subject="Os documentos, fotos e PEIs listados"
          detail="Nenhum arquivo é armazenado neste protótipo: enviar, buscar, visualizar, baixar, excluir, compartilhar e imprimir estão desabilitados."
        />

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled
                aria-describedby="anexos-indisponiveis"
              />
            </div>
            <Button disabled aria-describedby="anexos-indisponiveis">
              <Upload className="w-4 h-4 mr-2" />
              Adicionar Anexo
            </Button>
          </div>

          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="laudos">Laudos</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              <TabsTrigger value="fotos">Fotos</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
              <TabsTrigger value="peis">PEIs</TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="space-y-4 mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Mostrando todos os {totalAnexos} documentos</p>
                <p className="text-sm">Use os filtros acima para visualizar categorias específicas</p>
              </div>
            </TabsContent>

            <TabsContent value="laudos" className="space-y-4 mt-4">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum laudo anexado</p>
              </div>
            </TabsContent>

            <TabsContent value="peis" className="space-y-4 mt-4">
              <div className="space-y-3">
                {peis.map((pei, idx) => (
                  <Card key={idx}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{pei.nome}</p>
                            {pei.ativo && <Badge className="bg-success">✅ ATIVO</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            📅 {pei.data} | 📏 {pei.tamanho} | 👤 {pei.autor}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled aria-describedby="anexos-indisponiveis">
                          <Eye className="w-4 h-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm" disabled aria-describedby="anexos-indisponiveis">
                          <Download className="w-4 h-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fotos" className="space-y-4 mt-4">
              <div className="grid grid-cols-4 gap-4">
                {fotos.map((foto, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <Image className="w-12 h-12 text-muted-foreground opacity-50" />
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-xs truncate">{foto.titulo}</p>
                      <p className="text-xs text-muted-foreground">{foto.data}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full" disabled aria-describedby="anexos-indisponiveis">Ver todas as fotos →</Button>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4 mt-4">
              <div className="text-center py-12 text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum vídeo anexado ainda</p>
                <Button variant="outline" size="sm" className="mt-4" disabled aria-describedby="anexos-indisponiveis">
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar primeiro vídeo
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="relatorios" className="space-y-4 mt-4">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum relatório anexado ainda</p>
                <Button variant="outline" size="sm" className="mt-4" disabled aria-describedby="anexos-indisponiveis">
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar primeiro relatório
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-between gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" disabled aria-describedby="anexos-indisponiveis">
            <Download className="w-4 h-4 mr-2" />
            Baixar Todos
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" disabled aria-describedby="anexos-indisponiveis">📧 Compartilhar</Button>
            <Button variant="outline" disabled aria-describedby="anexos-indisponiveis">🖨️ Imprimir Lista</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
