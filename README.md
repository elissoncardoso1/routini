# 🗓️ Routini - Sistema de Agendamento e Gerenciamento de Escalas

[![Version](https://img.shields.io/badge/version-0.1.0--alpha.1-purple.svg)](https://github.com/elissoncoimbra/routini/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey.svg)](https://github.com/elissoncoimbra/routini/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **Routini** é um sistema completo de agendamento e gerenciamento de escalas desenvolvido com React, TypeScript e Electron. Ideal para clínicas, consultórios e profissionais que precisam organizar suas agendas de forma eficiente.

## ✨ Características Principais

- 📅 **Calendário Intuitivo** - Interface moderna com FullCalendar
- 👥 **Gestão de Pacientes** - Cadastro e histórico completo
- 📊 **Dashboard Analítico** - Relatórios e estatísticas em tempo real
- 💾 **Banco de Dados Local** - Dexie.js para armazenamento offline
- 🎨 **Interface Moderna** - Design responsivo com Tailwind CSS
- 🔄 **Sincronização** - Backup e restauração de dados
- 📱 **Multiplataforma** - Windows e macOS

## 🚀 Download

### Windows
- **[Instalador](https://github.com/elissoncardoso1/routini/releases/latest/download/Routini-Setup-0.1.2.exe)** - Versão completa com instalador
- **[Portátil](https://github.com/elissoncardoso1/routini/releases/latest/download/Routini-0.1.2-portable.exe)** - Executável standalone

### macOS
- **[DMG](https://github.com/elissoncardoso1/routini/releases/latest/download/Routini-0.1.2-arm64.dmg)** - Instalador para macOS
- **[ZIP](https://github.com/elissoncardoso1/routini/releases/latest/download/Routini-0.1.2-arm64-mac.zip)** - Versão compactada

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Desktop**: Electron 35
- **Calendário**: FullCalendar 6
- **Banco de Dados**: Dexie.js (IndexedDB)
- **Build**: Vite 6, Electron Builder
- **UI/UX**: Headless UI, Heroicons, Recharts

## 📋 Funcionalidades

### 📅 Gestão de Agendamentos
- Visualização em calendário semanal/mensal
- Agendamento rápido com drag & drop
- Diferentes tipos de eventos
- Lembretes e notificações

### 👥 Cadastro de Pacientes
- Informações completas do paciente
- Histórico de consultas
- Anotações e observações
- Busca e filtros avançados

### 📊 Dashboard Analítico
- Estatísticas de atendimentos
- Gráficos de produtividade
- Relatórios personalizados
- Exportação de dados

### 💾 Backup e Sincronização
- Backup automático local
- Exportação de dados
- Restauração de backup
- Sincronização entre dispositivos

## 🎯 Casos de Uso

### Para Profissionais de Saúde
- **Médicos**: Agendamento de consultas e procedimentos
- **Dentistas**: Controle de horários e tratamentos
- **Psicólogos**: Gestão de sessões terapêuticas
- **Fisioterapeutas**: Agendamento de sessões

### Para Consultórios e Clínicas
- **Pequenas clínicas**: Gestão completa de pacientes
- **Consultórios**: Organização de agendas
- **Centros médicos**: Controle de escalas

## 🚀 Instalação e Uso

### Requisitos do Sistema
- **Windows**: Windows 10 ou superior
- **macOS**: macOS 10.15 ou superior
- **Memória**: 4GB RAM mínimo
- **Espaço**: 500MB de espaço em disco

### Instalação
1. Baixe o arquivo correspondente ao seu sistema
2. Execute o instalador ou arquivo portátil
3. Siga as instruções na tela
4. O Routini será instalado e estará pronto para uso

### Primeiro Uso
1. Abra o Routini
2. Configure suas preferências iniciais
3. Adicione seus primeiros pacientes
4. Comece a agendar consultas

## 🔧 Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Git

### Configuração do Ambiente
```bash
# Clone o repositório
git clone https://github.com/elissoncoimbra/routini.git
cd routini

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Build do Electron
npm run electron:build
```

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run electron:dev` - Electron em desenvolvimento
- `npm run electron:build` - Build do Electron
- `npm run electron:build:win` - Build para Windows

## 📁 Estrutura do Projeto

```
routini/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços e APIs
│   ├── types/         # Definições TypeScript
│   ├── utils/         # Utilitários
│   └── assets/        # Recursos estáticos
├── public/            # Arquivos públicos
├── dist/              # Build de produção
└── release/           # Executáveis do Electron
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição
- Mantenha o código limpo e bem documentado
- Siga os padrões de código existentes
- Teste suas mudanças antes de submeter
- Atualize a documentação quando necessário

## 🐛 Reportar Bugs

Se você encontrou um bug:

1. Verifique se o problema já foi reportado
2. Crie uma nova issue com detalhes completos
3. Inclua informações do sistema e passos para reproduzir
4. Anexe logs de erro se disponível

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Elisson Cardoso**
- GitHub: [@elissoncardoso1](https://github.com/elissoncardoso1)
- Email: elissoncardoso1@gmail.com

## 🙏 Agradecimentos

- [FullCalendar](https://fullcalendar.io/) - Biblioteca de calendário
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Electron](https://electronjs.org/) - Framework desktop
- [React](https://reactjs.org/) - Biblioteca JavaScript
- [Dexie.js](https://dexie.org/) - Banco de dados local

## 📈 Roadmap

### Versão 1.0
- [ ] Sincronização em nuvem
- [ ] Notificações push
- [ ] Integração com APIs de pagamento
- [ ] Relatórios avançados

### Versão 1.1
- [ ] Aplicativo móvel
- [ ] Integração com WhatsApp
- [ ] Sistema de lembretes
- [ ] Backup automático

### Versão 1.2
- [ ] Múltiplos usuários
- [ ] Controle de acesso
- [ ] Integração com sistemas médicos
- [ ] Telemedicina

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no GitHub!**

---

**Routini** - Transformando a gestão de agendamentos em uma experiência simples e eficiente.
