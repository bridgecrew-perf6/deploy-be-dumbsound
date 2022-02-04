const { artis } = require("../../models")
const Joi = require("joi")

exports.addArtis = async (req, res) => {
    try {
        const dataArtis = req.body

        const schema = Joi.object({
            name: Joi.string().min(4).required(),
            old: Joi.number().min(1).required(),
            type: Joi.string().min(3).required(),
            startCareer: Joi.string().min(4).required()
        })

        const { error } = schema.validate(dataArtis)

        if(error) {
            return res.status(400).send({
                message: error.details[0].message
            })
        };

        const createdArtis = await artis.create(dataArtis)

        res.status(200).send({
            status: "success",
            createdArtis
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getArtists = async (req, res) => {
    try {
        const artists = await artis.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        res.status(200).send({
            status: "success",
            artists
        })

    } catch (error) {
        // console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getArtis = async(req, res) => {
    try {
        const { id } = req.params

        const data = await artis.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        res.status(200).send({
            status: "success",
            data
        })

    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.deleteArtis = async (req, res) => {
    try {
        const {id} = req.params

        await artis.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            status: "success",
            message: `Delete artis id = ${id} Successfuly`
        })

    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.updateArtis = async (req, res) => {
    try {
        const { id } = req.params
        const updateArtis = req.body

        await artis.update(updateArtis, {
            where: {
                id
            }
        })

        res.status(200).send({
            status: "success",
            message: `Update data artis id ${id} Successfuly`,
            data: updateArtis
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: 'Server Error'
        })
    }
}
