const { music, artis } = require("../../models")
const cloudinary = require('../utils/cloudinary');

const Joi = require("joi")

let FILE_PATH_IMAGE = 'https://res.cloudinary.com/dbxxijc5x/image/upload/v1644047963/'
let FILE_PATH_MUSIC = 'https://res.cloudinary.com/dbxxijc5x/video/upload/v1644066404/'

exports.addMusic = async (req, res) => {
    try {
        const { ...dataMusic } = req.body

        if (!req.files) {
            return res.send(400).send({
                status: "failde",
                message: "please Upload file"
            })
        }
        // console.log(dataMusic)
        // const thumbnail = req.files[0].path
        // const atthace = req.files[1].path
        
        
        const thumbnail = await cloudinary.uploader.upload(req.files[0].path, {
            folder: 'dumbsound_file',
            use_filename: true,
            unique_filename: false,
        });
        
        
        const atthace = await cloudinary.uploader.upload(req.files[1].path, {
            folder: 'dumbsound_file',
            use_filename: true,
            unique_filename: false,
            resource_type: "video",
        });
        // console.log(result)
        console.log(thumbnail)
        console.log(atthace)

        const schema = Joi.object({
            title: Joi.string().required(),
            year: Joi.number().min(4).required(),
            artisId: Joi.required(),
        });


        const { error } = schema.validate(dataMusic)

        if(error) {
            return res.status(400).send({
                message: error.details[0].message
            })
        };

        const addMusic = await music.create({
            title: dataMusic.title,
            year: dataMusic.year,
            thumbnail: thumbnail.public_id,
            atthace: atthace.public_id,
            artisId: dataMusic.artisId
        })

        console.log(addMusic.id)


        let data = await music.findOne({
            include: [{
                model: artis,
                as: "artis",
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {
                id: addMusic.id
            }
        });

        res.status(200).send({
            status: "success",
            data
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getMusics = async (req, res) => {
    try {
        let data = await music.findAll({
            include: [{
                model: artis,
                as: "artis",
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        data = JSON.parse(JSON.stringify(data))
        // console.log(data)

        data = data.map((item) => {
            return {
                ...item,
                thumbnail: FILE_PATH_IMAGE + item.thumbnail,
                atthace: FILE_PATH_MUSIC + item.atthace
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

exports.getMusic = async (req, res) => {
    try {
        const {id} = req.params

        let data = await music.findOne({
            include: [{
                model: artis,
                as: "artis",
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {
                id
            }
        });

        data = JSON.parse(JSON.stringify(data))
        // console.log(data)

        data = data.map((item) => {
            return {
                ...item,
                thumbnail: FILE_PATH_IMAGE + item.thumbnail,
                atthace: FILE_PATH_MUSIC + item.atthace
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

exports.deletePayment = async (req, res) => {
    try {
        const {id} = req.params

        await payment.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            status: "success",
            message: `Delete payment id = ${id} Successfuly`
        })

    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.deletePayment = async (req, res) => {
    try {
        const {id} = req.params

        await music.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            status: "success",
            message: `Delete music id = ${id} Successfuly`
        })

    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

