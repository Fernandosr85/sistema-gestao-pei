# API Reference

## Visão Geral

No estado atual, o sistema está preparado para integração com backend, porém a documentação disponível **não define endpoints REST reais**.  
Atualmente, a aplicação opera com **mock data** e com interfaces prontas para integração futura.

## Estado Atual

- Frontend em React + TypeScript
- Dados mockados localmente
- Integrações planejadas, mas não implementadas por completo
- UI preparada para sincronização com serviços externos

## Integrações Planejadas

### Backend de persistência (ex.: Supabase, PostgreSQL + API própria)

**Status:** Planejado

#### Finalidade
- Persistência de dados
- Autenticação
- Armazenamento de arquivos
- Possível backend para alunos, observações, agenda e relatórios

---

### Google Calendar

**Status:** UI pronta

#### Finalidade
- Sincronização bidirecional de eventos
- Gestão de agenda de atendimentos

#### Observação
Existe um fluxo mock de OAuth gerenciado por `useCalendarSync`, com placeholders para integração real.

---

### Microsoft Outlook

**Status:** UI pronta

#### Finalidade
- Sincronização bidirecional de eventos
- Unificação de agenda institucional

#### Observação
Assim como no Google Calendar, a interface já foi preparada, mas a integração real ainda não está concluída.

---

### Exportação de PDF

**Status:** Planejado

#### Finalidade
- Geração de relatórios em PDF

---

### Exportação de Excel

**Status:** Planejado

#### Finalidade
- Exportação de dados em planilhas

---

### Notificações por Email / Push

**Status:** UI pronta

#### Finalidade
- Alertas de eventos e pendências
- Comunicação com usuários

## Hook Relacionado

### `useCalendarSync`

Responsável por gerenciar o estado de sincronização com Google Calendar e Outlook.

#### Responsabilidades
- Gerenciar estado de conexão
- Simular fluxo de autenticação
- Preparar integração futura de calendário

## Modelo Conceitual de API

Como a documentação não traz endpoints reais, abaixo está uma **estrutura sugerida** para futura API:

### Alunos
```http
GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

### Observações
```http
GET    /api/observations
GET    /api/observations/:id
POST   /api/observations
PUT    /api/observations/:id
DELETE /api/observations/:id
```

### Atendimentos / Agenda
```http
GET    /api/meetings
POST   /api/meetings
PUT    /api/meetings/:id
DELETE /api/meetings/:id
POST   /api/calendar/google/connect
POST   /api/calendar/outlook/connect
```

### Recursos
```http
GET    /api/resources
GET    /api/resources/:id
POST   /api/resources
POST   /api/resources/:id/reviews
```

### Relatórios
```http
POST /api/reports/pdf
POST /api/reports/excel
POST /api/reports/word
```

## Observações Importantes

- Os endpoints acima são **proposta de organização**, não implementação confirmada.
- A documentação original menciona preparação para integração, mas não fornece contrato formal de API.
- Antes de publicar esta seção como definitiva, é recomendável validar com o código-fonte ou com o backend real.

## Próximos Passos Recomendados

1. Definir padrão de autenticação
2. Formalizar contratos com OpenAPI/Swagger
3. Versionar a API
4. Documentar payloads de request e response
5. Padronizar tratamento de erros
