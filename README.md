# Projeto Web - backend

## Descrição

O projeto consiste na construção de uma API web backend, onde os alunos têm a liberdade de escolher o domínio do sistema a ser desenvolvido. Utilizando o framework Express, juntamente com as tecnologias aprendidas em sala de aula, os alunos devem implementar as funcionalidades de gerenciamento e controle de usuários, como cadastro, autenticação, criação de administradores, exclusão de usuários não administradores e alteração de dados pessoais. Além disso, é necessário desenvolver operações de CRUD com relacionamentos entre tabelas, realizar validações adequadas dos dados fornecidos pelos usuários, implementar paginação nos métodos de listar e criar uma rota de instalação do banco de dados. O trabalho será avaliado levando em consideração a organização do código, a escolha das tecnologias e a integração adequada entre a API e o front-end.

### Autenticação

Autenticação por _username_ e _password_, nome do usuário e senha. O desenvolvimento de credencial é própria, não muito sofisticado, mas armazenando senhas no banco através de biblioteca de criptografia _hash_ com _salt_ e com uso de jsonwebtoken, JWT para realizar a verificação. Existem tipos de usado para acesso as partes da API como livre, protegido, confidencial e permitido.

    Níveis de segurança:
    - Livre: Sem necessidade de autenticação.
    - Protegido: Autenticação valida.
    - Confidencial: Autenticação e proprietário.
    - Permitido: Autenticação e administrador.

## Funcionalidades de Usuários e Sistema de Autenticação:

---

- Cadastro de usuários: permite o cadastro de usuários com dados, _username_ e _password_, sendo credenciais de autenticação.
- Sign in: a rota de sign in recebe um usuário e senha, gerando um token JWT para acesso às rotas seguras da API.
- Administradores: existem um administrador por padrão e mais usuários podem receber privilégios específicos de administrador. Os administradores podem criar novos administradores no sistema além de algumas outras operações.
- Perfil: Usuário possui um perfil.
- Publicação: Usuário pode publicar um _post_ com titulo e conteúdo.
- Comentário: Usuário pode comentar em um _post_ com conteúdo.

## Funcionalidades do Sistema CRUD:

No banco de dados operações como criar, listar, alterar e excluir são realizadas por meio de rotas especificas cada uma com o nível de segurança adequado para manipular, através de middleware além de validação de dados tanto das estruturas _query_ como _body_.

- Criar (Create): permite a inserção de novos registros no banco de dados.
    
    Criar perfil, publicação, comentário é necessário estar autenticado e o proprietário é do usuário quem criou.

- Listar (Read): exibe uma lista de registros com paginação, permitindo definir a quantidade de registros por página e a página atual.

    Listar e realizar a paginação com _limit_ e _page_ é livre para os usuários pois podem ter acesso a informação como o perfil, publicação e comentário, claro que existe um filtro dos campos que podem ser visto.

- Buscar (Read): exibe os detalhes de um registro específico.

    Buscar com _query_ como _fullName_ para os perfil, _filter_, para buscar tanto no titulo como no conteúdo, para as publicação e comentário. 

- Alterar (Update): permite a alteração dos dados de um registro existente.

    Alterar perfil, publicação ou comentário fica restrito ao confidencial e permitido, ou seja, só realize a alteração quem criou ou administradores.

- Excluir (Delete): possibilita a remoção de um registro do banco de dados.

    Excluir perfil, publicação ou comentário fica restrito ao confidencial e permitido, ou seja, só realize a alteração quem criou ou administradores.

*Observação para o administrador padrão onde operações como alterar e excluir fica a restrito a sí próprio. Ao criar no cadastro pode ser padrão se criar um na instalação ou fica sendo administrador padrão o primeiro usuário, e nunca pode ser excluído.

## Funcionalidades de Lógica de Negócio e Instalador:

- Instalação do banco de dados: rota responsável por criar as tabelas necessárias e inserir dados iniciais no banco de dados.

    Especificado pelo projeto existe a rota para instalar o banco de dados e criar as tabelas e seu relacionamentos. Além de popular inicialmente com alguns registros. Os dados e informações usadas para popular o banco de dados é fictício *Qualquer semelhança é meramente coincidência.*

---

## Planned features
###### Recursos planejados

- Desenvolver o frontend
- Criar chat para envio de mensagens

---

<!-- #### **Avaliação final do projeto - x.x** -->

_* Esperando avaliação_