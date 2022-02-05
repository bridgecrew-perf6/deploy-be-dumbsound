const { user, payment } = require("../../models")

const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// const dotenv = require("dotenv")
// dotenv.config();

exports.register = async(req, res) => {
    try {
        const data = req.body

        const schema = Joi.object({
            email: Joi.string().email().min(5).required(),
            password: Joi.string().min(5).required(),
            fullName: Joi.string().min(5).required(),
            listAs: Joi.string().required(),
            gender: Joi.string().min(4).required(),
            phone: Joi.string().min(10).required(),
            address: Joi.string()
        })

        const { error } = schema.validate(data)

        if (error) {
            console.log(error)
            return res.status(400).send({
                status: "error",
                message: error.details[0].message
            })
        }

        const emailExist = await user.findOne({
            where: {
            email: data.email,
            },
        });

        if (emailExist) {
            return res.status(400).send({
                status: "error",
                message: "email already exist",
            });
        }
        // add response
        const phoneExist = await user.findOne({
            where: {
            phone: data.phone,
            },
        });

        if (phoneExist) {
            return res.status(400).send({
                status: "error",
                message: "number phone already exist",
            });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const dataUserNew = await user.create({
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            listAs: "1",
            gender: data.gender,
            phone: data.phone,
            address: data.address
        })

        let checkSubscribe = await payment.findAll({
			where: {
				userId: dataUserNew.id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "id", "startDate", "dueDate", "attache", "accountNumber", "userId"]
            }
        });

        console.log("data User New", dataUserNew)

        const token = jwt.sign({ id: dataUserNew.id }, process.env.TOKEN_KEY)

        console.log('token', token)

        res.status(201).send({
            status: "success",
            data: {
                fullName: data.fullName,
                email: data.email,
                password: hashedPassword,
                listAs: "0",
                gender: data.gender,
                phone: data.phone,
                address: data.address,
                payment: checkSubscribe,
                token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

exports.login = async(req, res) => {
    const data = req.body

    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().required()
    })

    const { error } = schema.validate(data)

    if (error) {
        return res.status(400).send({
            status: "error",
            message: error.details[0].message
        })
    }

    try {
        const userExist = await user.findOne({
            where: {
                email: data.email
            },
            attributes: {
                exclude: ["createdAt", "updateAt"]
            }
        })
        
        if (!userExist) {
            return res.status(400).send({
                    status: "failed",
                    message: "email doesnt exist"
                })
            }
        // console.log(userExist.password)
                
        const isMatch = await bcrypt.compare(req.body.password,
            userExist.password)
        
                
        if (!isMatch) {
            return res.status(400).send({
                status: "failed",
                message: "password doesnt exist"
            })
        }

        const checkSubscribe = await payment.findAll({
			where: {
				userId: userExist.id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "id", "startDate", "dueDate", "attache", "accountNumber", "userId"]
            }
        }) ?? "null";

        if (checkSubscribe < 0) {
            res.status(400).send({
                status: "failed",
                message: "empty data"
            })
        }

        

        console.log("check status Login: ", checkSubscribe)

        const token = jwt.sign({
            id: userExist.id
        }, process.env.TOKEN_KEY)
        

        res.status(200).send({
            status: "success",
            data: {
                id: userExist.id,
                fullName: userExist.fullName,
                email: userExist.email,
                listAs: userExist.listAs,
                payment: checkSubscribe,
                phone: userExist.phone,
                address: userExist.address,
                token,
                // idToken: user.id,
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

exports.checkAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(404).send({
                status: 'failed',
                message: 'token not found',
            });
        }

        const token = authHeader.split(' ')[1];

        // console.log("token server", process.env.TOKEN_KEY)
  
        const isVerified = jwt.verify(token, process.env.TOKEN_KEY, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    status: 'failed',
                    message: err.message
                })
            }
            return decode.id
        })
        // console.log("isVerified", isVerified)
        
        const userExist = await user.findOne({
			where: {
				id: isVerified
			},
			attributes: {
				exclude: ['password', 'createdAt', 'updatedAt'],
			},
        });

        let checkSubscribe = await payment.findAll({
			where: {
				userId: userExist.id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "id", "startDate", "dueDate", "attache", "accountNumber", "userId"]
            }
        });

        // const status payment 
        // if (checkSubscribe <= 0) {
        //     return checkSubscribe
        // } else {
        //     return checkSubscribe[0].status
        // }

        console.log("check status CheckAuth: ", checkSubscribe)

        // console.log("user exist: ",userExist)
        
        if (!userExist) {
            return res.status(401).send({
                status: 'failed',
                message: 'invalid token',
            })
        }

        const newToken = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);

        return res.status(200).send({
            status: 'success',
            data: {
                id: userExist.id,
                fullName: userExist.fullName,
                email: userExist.email,
                listAs: userExist.listAs,
                payment: checkSubscribe,
                phone: userExist.phone,
                address: userExist.address,
                gender: userExist.gender,
                token: newToken
            }
        });
        
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
};