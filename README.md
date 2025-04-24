
# Vizinhança Online

Bem-vindo ao Vizinhança Online, uma plataforma que traz a essência das feirinhas de bairro para o mundo digital! Este projeto conecta pequenos comerciantes e consumidores locais, promovendo o comércio de bairro com praticidade e proximidade. Com uma interface intuitiva, o app permite explorar produtos, interagir com vendedores e fortalecer laços comunitários.

## 📋 Descrição
O Vizinhança Online é um aplicativo web desenvolvido para recriar a experiência de uma feirinha de bairro online. Ele oferece uma vitrine virtual onde comerciantes locais podem exibir seus produtos, e os moradores podem descobrir ofertas, negociar diretamente via WhatsApp e apoiar o comércio da região. O projeto foca em usabilidade, design moderno e funcionalidades que valorizam a conexão entre vizinhos, a promoção e o crescimento econômico, inclusivo e sustentável, emprego pleno e produtivo e trabalho decente para todos.


## 🌟 Motivação

A ideia do Vizinhança Online nasceu da vontade de valorizar o comércio local em um mundo cada vez mais dominado por grandes marketplaces. Pequenos comerciantes muitas vezes enfrentam dificuldades para alcançar clientes digitalmente, enquanto consumidores desejam opções práticas para apoiar negócios da vizinhança. Este projeto busca unir essas duas pontas, criando uma plataforma que celebra a comunidade local, promove negociações transparentes e mantém a essência acolhedora das feirinhas de bairro.

## ✨ Funcionalidades

- Exploração de Produtos: Navegue por categorias (alimentos, artesanato, serviços, etc.) com filtros por proximidade e preço.

- Negociação via WhatsApp: Conecte-se diretamente com vendedores via WhatsApp, permitindo negociações rápidas e personalizadas.

- Vitrine para Comerciantes: Crie perfis personalizados e gerencie produtos com upload de imagens e descrições detalhadas.

- Formulários Validados: Cadastro e edição de produtos com validação robusta usando Zod e React Hook Form.

- Notificações em Tempo Real: Feedback instantâneo para ações do usuário (ex.: produto adicionado, erro no formulário) com React Hot Toast.

- Navegação Intuitiva: Rotas dinâmicas com React Router para uma experiência fluida entre páginas como Home, Produtos e Perfil.

- Carrossel de Destaques: Exibição de produtos em destaque com animações suaves usando Swiper.

- Design Responsivo: Interface otimizada para dispositivos móveis e desktops com TailwindCSS.

- Gerenciamento de Dados: Armazenamento seguro de produtos, usuários e imagens no Firebase Firestore e Storage.

## ⚠️ Observação

Este projeto foi desenvolvido como um projeto de extensão universitária com o objetivo de promover um dos 17 Objetivos de Desenvolvimento Sustentável (ODS) no Brasil, conforme estabelecidos pela ONU. Ele foca especialmente no ODS 8: Trabalho Decente e Crescimento Econômico, incentivando a inclusão econômica de pequenos comerciantes e a geração de renda local. Além disso, contribui para o ODS 11: Cidades e Comunidades Sustentáveis, ao fortalecer a economia de bairro e promover interações comunitárias, e o ODS 12: Consumo e Produção Responsáveis, ao valorizar produtos locais e reduzir a dependência de cadeias logísticas extensas.


## 🛠️ Tecnologias Utilizadas
#### Front-end:
- React.js (biblioteca principal)
- React Router (navegação entre páginas)
- TailwindCSS (estilização responsiva)
- Swiper (carrossel de produtos)
- React Hot Toast (notificações)

#### Validação de Formulários:
- Zod (validação de schemas)
- React Hook Form (gerenciamento de formulários)

#### Banco de Dados:
- Firebase Firestore (armazenamento de dados)
- Firebase Storage (armazenamento de imagens)

#### Integração Externa:
- API do WhatsApp (https://api.whatsapp.com/send?phone=55) para negociação direta

#### Outras Ferramentas:
- Vite (build tool para desenvolvimento rápido)
- Git (controle de versão)
- ESLint e Prettier (qualidade de código)

## 🚀 Como Executar o Projeto
Pré-requisitos:

- Node.js (versão 18 ou superior)

- npm ou yarn

- Git

- Conta no Firebase (para configurar o banco de dados)


## 🚀 Instalação

1. Clone o repositório:

```bash
  npm install my-project
  cd my-project
```

2. Navegue até o diretório do projeto:

```bash
  cd vizinhancaonline
```

3. Instale as dependências:

```bash
  npm install
```

4. Configure o Firebase:

- Crie um projeto no Firebase Console.

- Adicione suas credenciais do Firebase em um arquivo .env:

```bash
  VITE_FIREBASE_API_KEY= sua-chave
  VITE_FIREBASE_AUTH_DOMAIN= seu-dominio
  VITE_FIREBASE_PROJECT_ID= seu-projeto
  VITE_FIREBASE_STORAGE_BUCKET= seu-bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID= seu-id
  VITE_FIREBASE_APP_ID= seu-app-id
```

5. Inicie o servidor de desenvolvimento:

```bash
  npm run dev
```

6. Abra o navegador em http://localhost:5173 para visualizar o app.

## 📂 Estrutura do Projeto 

vizinhanca-online/

├── public/ _______               # Arquivos estáticos (favicon, imagens, etc.)

├── src/ _______                  # Código-fonte

│   ├── assets/ _______           # Imagens e recursos visuais

│   ├── components/ _______       # Componentes React reutilizáveis (ex.: ProductCard, FormInput)

│   ├── pages/ _______            # Páginas da aplicação (Home, Produtos, Perfil, Cadastro)

│   ├── hooks/ _______            # Hooks personalizados (ex.: useAuth, useProducts)

│   ├── services/ _______         # Integrações com Firebase e WhatsApp API

│   ├── styles/ _______           # Estilos globais e configurações TailwindCSS

│   ├── App.tsx _______           # Componente principal com rotas

│   └── main.tsx _______          # Ponto de entrada

├── .env _______                  # Variáveis de ambiente (Firebase)

├── .eslintrc.json _______        # Configurações de linting

├── .prettierrc _______           # Configurações de formatação

├── README.md _______             # Documentação do projeto

├── package.json _______          # Dependências e scripts

└── vite.config.ts _______        # Configurações do Vite

## 🧪 Testes

Atualmente, o projeto não possui uma suíte de testes automatizados. Para o futuro, está planejada a integração de ferramentas como:

- Jest e React Testing Library para testes unitários de componentes.
- Cypress para testes end-to-end.

Para testar manualmente, execute o projeto localmente e verifique:

- Navegação entre páginas (React Router).
- Validação de formulários (Zod + React Hook Form).
- Integração com o Firebase (cadastro e listagem de produtos).
- Funcionalidade do botão de WhatsApp (link para negociação).

## 🌟 Contribuindo

Contribuições são sempre bem-vindas! Quer ajudar a melhorar o Vizinhança Online? Siga os passos abaixo:

1. Faça um fork do repositório.

2. Crie uma branch para sua feature:
 ```bash
  git checkout -b minha-feature
```

3. Commit suas alterações:
```bash
  git commit -m "Adiciona minha feature"
```

4. Envie para o repositório remoto:
```bash
  git push origin minha-feature
```

5. Abra um Pull Request descrevendo suas mudanças.




Veja `contribuindo.md` para saber como começar.

Por favor, siga o `código de conduta` desse projeto.


## 📜 Licença

Este projeto está licenciado sob a MIT License.
[MIT](https://choosealicense.com/licenses/mit/)


## 📬 Contato

Para sugestões, dúvidas ou feedback, entre em contato:

- [@Dolivalho](https://github.com/Dolivalho)

##
#### Vizinhança Online: a sua feirinha de bairro, agora na palma da mão!
