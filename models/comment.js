const { DataTypes, Op } = require('sequelize')
const sequelize = require('../database/sqliteDB')
const User = require('./user')
const Post = require('./post')

const Comment = sequelize.define('Comments', {
    content: {
        type: DataTypes.TEXT,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    postId: {
        type: DataTypes.INTEGER,
    }
})

// Associação entre comentário, usuário e publicação (um para muitos)
Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' })
Comment.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' })
User.hasOne(Comment, { foreignKey: 'userId' })
Post.hasOne(Comment, { foreignKey: 'postId' })

Comment.sync()

// Atualize um comentário pelo id da publicação e do usuário
Comment.updateComment = async (id, userId, data) => {
    const [updatedComment] = await Comment.update(data, {
        where: { id, userId }
    })
    return updatedComment
}

// Encontre um comentário pelo filter
Comment.findComments = async (filter, attributes, limit, offset) => {
    const comments = await Comment.findAll({
        where: {
            content: {
                [Op.like]: '%' + filter + '%'
            }
        },
        attributes,
        limit,
        offset
    })
    return comments
}

// Encontre um comentário pelo id do comentário e usuário
Comment.findCommentByIdUserId = async (id, userId) => {
    const comments = await Comment.findOne({
        where: { id, userId }
    })
    return comments
}

// Cria um novo comentário associado a um usuário e publicação pelo id
Comment.createComment = async (userId, postId, content) => {
    const comment = await Comment.create({
        content: content,
        userId,
        postId,
    })
    return comment
}

module.exports = Comment