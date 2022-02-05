const { user, payment } = require("../../models")

exports.addUser = async (req, res) => {
    try {
        const dataUser = req.body

        const createdUser = await user.create(dataUser)

        res.status(200).send({
            status: "success",
            createdUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const showUsers = await user.findAll({
            attributes: {
                exclude: ['status', 'createdAt', 'updatedAt']
            }
        })

        res.status(200).send({
            status: "success",
            showUsers
        })

    } catch (error) {
        // console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getUser = async(req, res) => {
    try {
        const { id } = req.params

        const data = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            include: {
                model: payment,
                as: "payment",
                attributes: {
                    exclude: [ 'createdAt', 'updatedAt']
                }
            }
        })

        res.status(200).send({
            status: "success",
            data
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params

        await user.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            status: "success",
            message: `Delete User id = ${id} Successfuly`
        })

    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const newUser = req.body

        await user.update(newUser, {
            where: {
                id
            }
        })

        res.status(200).send({
            status: "success",
            message: `Update data user id ${id} Successfuly`,
            data: newUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: 'Server Error'
        })
    }
}
