const sequelize = require("../database/sqliteDB")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const Profile = require("../models/profile")
const Post = require("../models/post")
const Comment = require("../models/comment")

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

const createDefaultComments = async () => {
    const comments = [
        { content: 'Dicas para uma alimentação saudável oferecem orientações valiosas para manter um estilo de vida equilibrado e promover o bem-estar.' },
        { content: 'As melhores praias para visitar no verão são verdadeiros refúgios paradisíacos, onde é possível relaxar, aproveitar o sol e refrescar-se nas águas cristalinas.' },
        { content: 'Cuidar das plantas em casa requer atenção e carinho, desde a escolha adequada de espécies até a rega e adubação corretas, proporcionando um ambiente verde e cheio de vida.' },
        { content: 'Para manter a forma, é importante combinar exercícios aeróbicos, como corrida e natação, com treinos de força, como musculação, para obter resultados eficazes e alcançar uma vida saudável.' },
        { content: 'Uma deliciosa receita de bolo de chocolate que vai conquistar seu paladar. Com massa fofinha e cobertura irresistível, é uma opção perfeita para os amantes de chocolate.' },
        { content: 'A prática da meditação traz inúmeros benefícios para a mente e o corpo, ajudando a reduzir o estresse, aumentar a concentração, promover a tranquilidade interior e melhorar a saúde mental e emocional.' },
        { content: 'Organizar sua rotina de estudos é fundamental para aumentar a produtividade. Estabeleça horários fixos, defina metas diárias e crie um ambiente propício para concentração, garantindo assim um aprendizado eficiente.' },
        { content: 'Conheça alguns destinos de tirar o fôlego para aproveitar suas férias e criar memórias inesquecíveis. Praias paradisíacas, cidades históricas e paisagens deslumbrantes esperam por você!' },
        { content: 'Descubra como elaborar um currículo que chame a atenção dos recrutadores e aumente suas chances de conseguir o emprego dos seus sonhos. Destaque suas habilidades, experiências relevantes e conquiste o sucesso profissional' },
        { content: 'Confira algumas dicas simples e eficazes para melhorar a qualidade do seu sono e desfrutar de noites tranquilas e revigorantes. Estabeleça uma rotina de sono regular, crie um ambiente propício para o descanso e adote hábitos saudáveis que promovam o relaxamento e o bem-estar.' },
        { content: 'Experimente essa refrescante receita de suco detox, repleta de ingredientes nutritivos e antioxidantes para ajudar a desintoxicar o organismo e promover uma sensação de bem-estar. Combinações como couve, maçã, limão e gengibre são ótimas opções para impulsionar a sua saúde e energia.' },
        { content: 'Reflexões sobre o impacto das redes sociais na sociedade revelam como essas plataformas têm transformado a forma como nos comunicamos, nos relacionamos e consumimos informações. Desde conexões globais até questões de privacidade e saúde mental, as redes sociais têm um impacto profundo em nossa cultura contemporânea, moldando nossas interações sociais e influenciando o comportamento humano.' },
        { content: 'Dicas para se organizar financeiramente incluem criar um orçamento detalhado, acompanhar os gastos, estabelecer metas financeiras, economizar regularmente, evitar dívidas desnecessárias e buscar formas de aumentar a renda. Com um planejamento cuidadoso e hábitos financeiros saudáveis, é possível alcançar estabilidade e construir um futuro financeiro mais sólido.' },
        { content: 'A prática regular de exercícios físicos traz diversos benefícios para a saúde, como o fortalecimento dos músculos e ossos, melhora da capacidade cardiovascular, aumento da flexibilidade e resistência, redução do estresse e ansiedade, melhora do humor e bem-estar geral. Além disso, os exercícios ajudam a controlar o peso, prevenir doenças crônicas, promover uma melhor qualidade do sono e aumentar a autoconfiança. Incorporar atividades físicas na rotina traz inúmeros benefícios para o corpo e mente.' },
        { content: 'Iniciar um negócio próprio requer planejamento e dedicação. Comece identificando uma ideia de negócio que esteja alinhada com seus interesses e habilidades. Em seguida, pesquise o mercado e identifique seu público-alvo. Elabore um plano de negócios detalhado, considerando aspectos como financiamento, estrutura, marketing e operações. Busque apoio e orientação de profissionais ou instituições especializadas, como incubadoras de empresas. Esteja preparado para enfrentar desafios e aprenda com os erros ao longo do caminho. Com determinação e comprometimento, você estará no caminho certo para iniciar e desenvolver um negócio próprio de sucesso.' },
        { content: 'Alguns filmes clássicos que todos deveriam assistir são: O Poderoso Chefão, um épico do crime que cativa com sua história envolvente; Casablanca, um romance atemporal que combina drama e intriga; Cidadão Kane, uma obra-prima do cinema que revolucionou a narrativa; O Mágico de Oz, um conto encantador cheio de imaginação e magia; e Cantando na Chuva, um musical alegre e cativante que transcende gerações. Esses filmes icônicos são verdadeiras joias cinematográficas que merecem um lugar especial na lista de qualquer amante do cinema.' },
        { content: 'As dicas para uma alimentação saudável fornecem orientações valiosas para manter um estilo de vida equilibrado e promover o bem-estar.' },
        { content: 'As melhores praias para visitar no verão são verdadeiros paraísos que oferecem momentos de relaxamento, diversão e contato com a natureza, proporcionando uma experiência única e revigorante.' },
        { content: 'Cuidar das plantas em casa é um verdadeiro ato de amor, que envolve escolher as espécies certas, fornecer a quantidade adequada de água e nutrientes, e criar um ambiente propício para o crescimento saudável das plantas, trazendo mais beleza e harmonia para o lar.' },
        { content: 'Manter a forma exige uma combinação inteligente de exercícios aeróbicos, como corrida, ciclismo e natação, com treinamentos de força, como musculação e exercícios com peso corporal. Essa abordagem equilibrada promove a saúde cardiovascular, aumenta a resistência e fortalece os músculos, proporcionando uma vida ativa e saudável.' },
        { content: 'Este bolo de chocolate delicioso vai encantar o seu paladar. Com uma massa macia e uma cobertura irresistível, é uma escolha perfeita para os amantes de chocolate.' },
        { content: 'A prática da meditação traz uma série de benefícios para a mente e o corpo, ajudando a diminuir o estresse, aumentar o foco, proporcionar paz interior e aprimorar a saúde mental e emocional.' },
        { content: 'É essencial organizar sua rotina de estudos para aumentar a produtividade. Estabeleça horários fixos, defina metas diárias e crie um ambiente adequado para concentração, garantindo assim uma aprendizagem eficaz.' },
        { content: 'Descubra alguns destinos deslumbrantes para aproveitar suas férias e criar memórias inesquecíveis. Praias paradisíacas, cidades históricas e paisagens impressionantes estão à sua espera!' },
        { content: 'Aprenda a criar um currículo que chame a atenção dos recrutadores e aumente suas chances de conquistar o emprego dos seus sonhos. Destaque suas habilidades, experiências relevantes e alcance o sucesso profissional.' },
        { content: 'Confira algumas dicas simples e eficientes para melhorar a qualidade do seu sono e desfrutar de noites tranquilas e revigorantes. Estabeleça uma rotina de sono regular, crie um ambiente favorável ao descanso e adote hábitos saudáveis que promovam relaxamento e bem-estar.' },
        { content: 'Experimente esta refrescante receita de suco detox, repleta de ingredientes nutritivos e antioxidantes que ajudam a desintoxicar o organismo e proporcionam uma sensação de bem-estar. Combinações como couve, maçã, limão e gengibre são excelentes opções para impulsionar sua saúde e energia.' },
        { content: 'Reflexões sobre o impacto das redes sociais na sociedade revelam como essas plataformas têm transformado nossa forma de comunicação, relacionamento e consumo de informações. Desde conexões globais até questões de privacidade e saúde mental, as redes sociais exercem um impacto profundo em nossa cultura contemporânea, moldando nossas interações sociais e influenciando o comportamento humano.' },
        { content: 'Dicas para se organizar financeiramente incluem criar um orçamento detalhado, acompanhar os gastos, estabelecer metas financeiras, economizar regularmente, evitar dívidas desnecessárias e buscar maneiras de aumentar a renda. Com um planejamento cuidadoso e hábitos financeiros saudáveis, é possível alcançar estabilidade e construir um futuro financeiro mais sólido.' },
        { content: 'A prática regular de exercícios físicos traz uma série de benefícios para a saúde, como fortalecimento dos músculos e ossos, melhoria da capacidade cardiovascular, aumento da flexibilidade e resistência, redução do estresse e ansiedade, melhora do humor e bem-estar geral. Além disso, os exercícios auxiliam no controle de peso, prevenção de doenças crônicas, promoção de melhor qualidade de sono e aumento da autoconfiança. Incorporar atividades físicas na rotina traz inúmeros benefícios para o corpo e a mente.' },
        { content: 'Iniciar seu próprio negócio requer planejamento e dedicação. Comece identificando uma ideia de negócio que esteja alinhada com seus interesses e habilidades. Em seguida, pesquise o mercado e identifique seu público-alvo. Elabore um plano de negócios detalhado, considerando aspectos como financiamento, estrutura, marketing e operações. Busque apoio e orientação de profissionais ou instituições especializadas, como incubadoras de empresas. Esteja preparado para enfrentar desafios e aprenda com os erros ao longo do caminho. Com determinação e comprometimento, você estará no caminho certo para iniciar e desenvolver com sucesso seu próprio negócio.' },
        { content: 'Alguns filmes clássicos que todos deveriam assistir são: O Poderoso Chefão, um épico do crime que cativa com sua história envolvente; Casablanca, um romance atemporal que combina drama e intriga; Cidadão Kane, uma obra-prima do cinema que revolucionou a narrativa; O Mágico de Oz, um conto encantador cheio de imaginação e magia; e Cantando na Chuva, um musical alegre e envolvente que transcende gerações. Esses filmes icônicos são verdadeiras joias cinematográficas que merecem um lugar especial na lista de qualquer amante do cinema.' }
    ]

    for (let i = 1; i <= comments.length; i++) {
        const comment = comments[i - 1]
        await Comment.createComment((i - 1) % 8 + 1, (i - 1) % 16 + 1, comment.content)
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
    createDefaultComments,
    checkInstallationStatus
}
