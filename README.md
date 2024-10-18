
# Sistema de Agendamento de Cortes - Barbearia
![image](https://github.com/user-attachments/assets/cca83402-a5d5-4840-bc1c-5eca1b48ef57)

Este é um sistema de agendamento de cortes de cabelo desenvolvido para barbearias. O sistema permite que os barbeiros façam o agendamento de cortes de cabelo de seus clientes de maneira prática e eficiente. O projeto está em desenvolvimento e foi criado utilizando **Next.js**, **TypeScript**, **NextAuth**, **shadcn/ui** e **Firebase**.

## Funcionalidades

- **Agendamento de Cortes**: Barbeiros podem agendar cortes de cabelo para seus clientes, incluindo informações como nome, telefone, data e horário.
- **Autenticação**: Utiliza **NextAuth** para autenticação de barbeiros, garantindo que apenas usuários autorizados possam acessar o sistema.
- **Interface Responsiva**: Interface de usuário moderna e responsiva utilizando o **shadcn/ui** para uma experiência de usuário consistente e elegante.
- **Integração com Firebase**: Os dados dos agendamentos são armazenados e gerenciados no **Firebase**.

## Tecnologias Utilizadas

- **Next.js**: Framework React para desenvolvimento full-stack.
- **TypeScript**: Linguagem que adiciona tipagem estática ao JavaScript, tornando o código mais seguro e escalável.
- **NextAuth**: Biblioteca para autenticação em Next.js, permitindo login seguro.
- **shadcn/ui**: Coleção de componentes UI baseada no Radix UI, que oferece um design consistente e acessível.
- **Firebase**: Backend usado para armazenamento e gerenciamento de dados dos agendamentos.

## Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente:

### Pré-requisitos

- Node.js >= 16.x
- Yarn ou NPM
- Conta no Firebase para configurar o Firestore e o sistema de autenticação.

### Passos para instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/sistema-barbearia.git
   ```

2. Acesse a pasta do projeto:

   ```bash
   cd sistema-barbearia
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

   ou, se estiver usando Yarn:

   ```bash
   yarn install
   ```

4. Configure o Firebase:

   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
   - Habilite o Firestore e configure a autenticação no Firebase.
   - Crie um arquivo `.env` na raiz do projeto com as credenciais do Firebase e NextAuth:

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

5. Execute o projeto:

   ```bash
   npm run dev
   ```

   ou, se estiver usando Yarn:

   ```bash
   yarn dev
   ```

6. Abra seu navegador e acesse `http://localhost:3000`.

## Estrutura do Projeto

```plaintext
├── app/
│   ├── auth/                   # Lógica de autenticação
│   ├── components/             # Componentes da interface de usuário
│   ├── firebase/               # Configurações e hooks Firebase
│   ├── hooks/                  # Hooks customizados
│   ├── layout.tsx              # Layout principal do sistema
│   ├── page.tsx                # Página inicial do sistema
├── public/                     # Arquivos estáticos (imagens, ícones)
├── .env                        # Variáveis de ambiente
├── next.config.js              # Configurações do Next.js
├── tsconfig.json               # Configurações do TypeScript
├── package.json                # Dependências e scripts do projeto
```

## Próximos Passos

- **Implementação de notificação**: Enviar notificações para os clientes sobre os agendamentos.
- **Relatórios**: Criar relatórios para acompanhar os cortes agendados.
- **Dashboard de administração**: Desenvolver um painel de controle para a gestão dos barbeiros e clientes.

## Contribuição

Se você deseja contribuir com o projeto:

1. Faça um fork do projeto
2. Crie uma nova branch (`git checkout -b feature/nova-feature`)
3. Faça as suas alterações e comite (`git commit -m 'Adiciona nova feature'`)
4. Envie para o repositório (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Eduardo Melo](https://github.com/eduardoddmg).
```
