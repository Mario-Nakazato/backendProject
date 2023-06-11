const sequelize = require("../database/sqliteDB")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const Profile = require("../models/profile")
const Post = require("../models/post")

const createDatabase = async (force) => {
    await sequelize.sync({ force })
}

const createDefaultUsers = async () => {
    const users = [
        { username: 'root', password: 'admin' },
        { username: 'mario', password: 'senha' },
        { username: 'adriano', password: '1234' },
        { username: 'carlos', password: 'carlos123' },
        { username: 'julia', password: 'julia456' },
        { username: 'roberta', password: 'roberta789' },
        { username: 'sandra', password: 'sandra2023' },
        { username: 'aline', password: 'aline567' },
    ]

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT))
        await User.createUser(user.username, hashedPassword)
    }
}

const createDefaultProfiles = async () => {
    const profiles = [
        { fullName: 'Mario N.', bio: 'Administrador master' },
        { fullName: 'Mario Nakazato', bio: 'Engenharia de Computação' },
        { fullName: 'Adriana Silva', bio: 'Designer Gráfica' },
        { fullName: 'Carlos Pereira', bio: 'Empreendedor e Palestrante' },
        { fullName: 'Julia Santos', bio: 'Estudante de Medicina' },
        { fullName: 'Roberta Almeida', bio: 'Desenvolvedora Web Full Stack' },
        { fullName: 'Sandra Ferreira', bio: 'Advogada Especializada em Direitos Humanos' },
        { fullName: 'Aline Castro', bio: 'Nutricionista Esportiva' },
    ]


    for (let i = 1; i <= profiles.length; i++) {
        const profile = profiles[i - 1]
        await Profile.createProfile(i, profile.fullName, profile.bio)
    }
}

const createDefaultPosts = async () => {
    const posts = [
        { title: 'Dicas para uma alimentação saudável', content: 'Confira algumas dicas para manter uma alimentação saudável e equilibrada.' },
        { title: 'As melhores praias para visitar no verão', content: 'Descubra quais são as melhores praias para aproveitar o verão e relaxar.' },
        { title: 'Como cuidar das plantas em casa', content: 'Saiba quais são os cuidados essenciais para manter suas plantas saudáveis dentro de casa.' },
        { title: 'Dicas de exercícios para manter a forma', content: 'Veja algumas sugestões de exercícios físicos para se manter ativo e saudável.' },
        { title: 'Dicas para organizar sua rotina de estudos', content: 'Aprenda a fazer um delicioso bolo de chocolate para adoçar o seu dia.' },
        { title: 'Os benefícios da meditação', content: 'Descubra como a prática da meditação pode trazer diversos benefícios para a sua vida.' },
        { title: 'Receita de bolo de chocolate', content: 'Confira algumas dicas úteis para organizar e otimizar sua rotina de estudos.' },
        { title: 'Destinos imperdíveis para viajar nas férias', content: 'Conheça alguns destinos incríveis para aproveitar suas férias e criar memórias inesquecíveis.' },
        { title: 'Como montar um currículo atrativo', content: 'Saiba como elaborar um currículo que chame a atenção dos recrutadores e aumente suas chances de conseguir um emprego.' },
        { title: 'Dicas para melhorar a qualidade do sono', content: 'Veja algumas dicas simples e eficazes para melhorar a qualidade do seu sono e descansar melhor.' },
        { title: 'Receita de suco detox', content: 'Experimente essa receita refrescante de suco detox para desintoxicar o organismo.' },
        { title: 'O impacto das redes sociais na sociedade', content: 'Reflexões sobre o papel das redes sociais e seu impacto nas relações sociais e no comportamento humano.' },
        { title: 'Dicas para se organizar financeiramente', content: 'Aprenda a organizar suas finanças pessoais e conquistar uma vida financeira mais equilibrada.' },
        { title: 'Benefícios da prática regular de exercícios físicos', content: 'Descubra os benefícios que a prática regular de exercícios físicos pode trazer para a sua saúde e bem-estar.' },
        { title: 'Como iniciar um negócio próprio', content: 'Dicas e orientações para quem deseja iniciar um negócio próprio e se tornar empreendedor.' },
        { title: 'Filmes clássicos que você precisa assistir', content: 'Uma lista de filmes clássicos que marcaram época e são imperdíveis para os amantes do cinema.' },
    ]

    for (let i = 1; i <= posts.length; i++) {
        const post = posts[i - 1]
        await Post.createPost((i - 1) % 8 + 1, post.title, post.content)
    }
}

const checkInstallationStatus = async () => {
    const user = await User.findUserByPk(1)
    return user
}

module.exports = {
    createDatabase,
    createDefaultUsers,
    createDefaultProfiles,
    createDefaultPosts,
    checkInstallationStatus
}
