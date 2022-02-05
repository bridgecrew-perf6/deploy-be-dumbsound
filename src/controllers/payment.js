const { payment, user } = require("../../models")
const cloudinary = require('../utils/cloudinary');

let FILE_PATH = 'https://res.cloudinary.com/dbxxijc5x/image/upload/v1644047963/dumbsound_file/'

exports.addPayment = async (req, res) => {
    try {
        const { ...dataPayment } = req.body

        if (!req.files) {
            return res.send(400).send({
                status: "failde",
                message: "please Upload file"
            })
        }
        
        console.log(req.files[0].path)
        const result = await cloudinary.uploader.upload(req.files[0].path, {
            folder: 'dumbsound_file',
            use_filename: true,
            unique_filename: false,
        });

        console.log(result.public_id)

        let today = new Date();
        const data = await payment.create({
            ...dataPayment,
            startDate: today,
            dueDate: today,
            status: "pending",
            attache: result.public_id,
        })
        // console.log(req.files[0].filename)

        paymentData = JSON.parse(JSON.stringify(data))

        res.status(200).send({
            status: "success",
            payment: {
                ...paymentData,
                // image: paymentData
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getPayments = async (req, res) => {
    try {
        let data = await payment.findAll({
            include: {
                model: user,
                as: "user",
                attributes: {
                    exclude: ['createdAt', 'password', 'listAs', 'updatedAt']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                attache: FILE_PATH + item.attache
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

exports.getPayment = async(req, res) => {
    try {
        const { id } = req.params

        const data = await payment.findOne({
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

exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params

        const updatePayment = {
            startDate: req?.body?.startDate,
            dueDate: req?.body?.dueDate,
            userId: req?.body?.userId,
            attache: req?.file?.filename,
            status: req?.body?.status
        };


        await payment.update(updatePayment, {
            where: {
                id
            }
        })

        const dataUpdated =  await payment.findOne({
            where: {
                id
            }
        })

        res.status(200).send({
            status: "success",
            message: `Update data payment id ${id} Successfuly`,
            data: dataUpdated
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: 'Server Error'
        })
    }
}

exports.updateStatusApproved = async (req, res) => {


    try {
        const { id } = req.params

        let data = await payment.findOne({
            where: {
                id
            },
            arttributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data))

        console.log(data.status)

        // let today1 = Date.now()
        let today = new Date();
        let thirty_days_from_now = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

        if (data.status === "pending") {
            await payment.update({
                status: "approved",
                startDate: today,
                dueDate: thirty_days_from_now,
            }, {
                where: {
                id : id
                }
            })
        } else {
            await payment.update({
                status: "approved",
                startDate: today,
                dueDate: thirty_days_from_now,
            }, {
                where: {
                id : id
                }
            })
        }

        let newData = await payment.findOne({
            where: {
                id
            },
            arttributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        res.status(200).send({
            status: "success",
            message: `Update data payment id ${id} Successfuly`,
            newData,
            today,
            thirty_days_from_now
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: 'Server Error'
        })
    }
}

exports.updateStatusCancel = async (req, res) => {
    try {
        const { id } = req.params

        let data = await payment.findOne({
            where: {
                id
            },
            arttributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data))

        console.log(data.status)

        // let today1 = Date.now()
        let today = new Date();
        let thirty_days_from_now = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

        if (data.status === "approved") {
            await payment.update({
                status: "cancel",
                startDate: today,
                dueDate: today,
            }, {
                where: {
                id : id
                }
            })
        } else {
            await payment.update({
                status: "cancel",
                startDate: today,
                dueDate: today,
            }, {
                where: {
                id : id
                }
            })
        }

        let newData = await payment.findOne({
            where: {
                id
            },
            arttributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        res.status(200).send({
            status: "success",
            message: `Update data payment id ${id} Successfuly`,
            newData
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: 'Server Error'
        })
    }
}