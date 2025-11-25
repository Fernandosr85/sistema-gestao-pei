import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Trash2 } from 'lucide-react';

interface EditarCadastroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export function EditarCadastroDialog({ open, onOpenChange, studentName }: EditarCadastroDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">✏️ Editar Cadastro - {studentName}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pessoais" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pessoais">📋 Dados Pessoais</TabsTrigger>
            <TabsTrigger value="saude">🏥 Saúde</TabsTrigger>
            <TabsTrigger value="familia">👨‍👩‍👧 Família</TabsTrigger>
            <TabsTrigger value="academico">🎓 Acadêmico</TabsTrigger>
          </TabsList>

          <TabsContent value="pessoais" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" defaultValue="Ana Carolina Souza" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataNasc">Data de Nascimento *</Label>
                <Input id="dataNasc" type="date" defaultValue="2016-11-09" />
              </div>
              <div className="space-y-2">
                <Label>Idade</Label>
                <Input value="8 anos" disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input id="matricula" defaultValue="SESI2024003" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serie">Série *</Label>
                <Input id="serie" defaultValue="2º Ano EF" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turma">Turma *</Label>
                <Input id="turma" defaultValue="Turma C" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup defaultValue="ativo">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ativo" id="ativo" />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inativo" id="inativo" />
                  <Label htmlFor="inativo">Inativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transferido" id="transferido" />
                  <Label htmlFor="transferido">Transferido</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trancado" id="trancado" />
                  <Label htmlFor="trancado">Trancado</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Foto do Aluno</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">AC</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saude" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnósticos</Label>
              <div className="flex items-center gap-2 mb-2">
                <Input defaultValue="TEA - Nível 1" />
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">+ Adicionar Diagnóstico</Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cid">CID-10</Label>
              <Input id="cid" defaultValue="F84.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medico">Médico Responsável</Label>
              <Input id="medico" defaultValue="Dra. Ana Paulita" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicacao">Medicação Atual</Label>
              <Textarea id="medicacao" placeholder="Nenhuma" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restricoes">Restrições/Alergias</Label>
              <Textarea id="restricoes" placeholder="Nenhuma" />
            </div>

            <div className="space-y-2">
              <Label>Último Laudo</Label>
              <div className="flex items-center gap-2">
                <Input type="date" defaultValue="2024-02-01" />
                <Button variant="outline" size="sm">📄 Ver Documento</Button>
                <Button variant="outline" size="sm">📎 Anexar Novo</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="familia" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável Principal *</Label>
              <Input id="responsavel" defaultValue="Maria Souza (Mãe)" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input id="telefone" defaultValue="(11) 98765-4321" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue="maria.souza@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="composicao">Composição Familiar</Label>
              <Textarea id="composicao" defaultValue="Família ativa" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea id="observacoes" placeholder="Informações relevantes sobre o contexto familiar" rows={4} />
            </div>
          </TabsContent>

          <TabsContent value="academico" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="anoLetivo">Ano Letivo</Label>
              <Input id="anoLetivo" defaultValue="2024" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Input id="turno" defaultValue="Manhã" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profRegente">Professor(a) Regente *</Label>
              <Input id="profRegente" defaultValue="Profª Marina Santos" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profApoio">Professor(a) de Apoio</Label>
              <Input id="profApoio" defaultValue="Professor(a) de Apoio F." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="necessidades">Necessidades Específicas</Label>
              <Textarea id="necessidades" defaultValue="Transtorno Global do Desenvolvimento" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recursos">Recursos Necessários</Label>
              <Textarea id="recursos" defaultValue="Comunicação alternativa visual" rows={3} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
