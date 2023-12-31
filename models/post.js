const { DataTypes, Op } = require('sequelize')
const sequelize = require('../database/sqliteDB')
const User = require('./user')

const Post = sequelize.define('Posts', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
    },
    userId: {
        type: DataTypes.INTEGER,
    }
})

// Associação entre publicação e usuário (um para muitos)
Post.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' })
User.hasOne(Post, { foreignKey: 'userId' })

Post.sync()

// Atualize uma publicação pelo id da publicação e do usuário
Post.updatePost = async (id, userId, data) => {
    const [updatedPost] = await Post.update(data, {
        where: { id, userId }
    })
    return updatedPost
}

// Encontre um publicação pelo filter
Post.findPosts = async (filter, attributes, limit, offset) => {
    const posts = await Post.findAll({
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: '%' + filter + '%'
                    }
                },
                {
                    content: {
                        [Op.like]: '%' + filter + '%'
                    }
                }
            ]
        },
        attributes,
        limit,
        offset
    })
    return posts
}

// Encontre um publicação pelo id da publicação e usuário
Post.findPostById = async (id) => {
    const post = await Post.findOne({
        where: { id }
    })
    return post
}

// Encontre um publicação pelo id da publicação e usuário
Post.findPostByIdUserId = async (id, userId) => {
    const post = await Post.findOne({
        where: { id, userId }
    })
    return post
}

// Cria um nova publicação associado a um usuário pelo id
Post.createPost = async (userId, title, content) => {
    const post = await Post.create({
        title: title,
        content: content,
        userId,
    })
    return post
}

module.exports = Post