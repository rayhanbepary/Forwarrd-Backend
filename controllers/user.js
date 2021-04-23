const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const registration = require('../validators/registration');
const userUpdate = require('../validators/userUpdate');
const login = require('../validators/login');
const resetPassword = require('../validators/resetPassword');
const { serverError, resourceError } = require('../util/error');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Collector = require('../models/Collector');
require('dotenv').config()


module.exports = {

    // Register Controller
    register(req, res) {

        let { name, email, phone, bkash, orgName, address, agreement, password, confirmPassword } = req.body;

        let validate = registration({ name, phone, bkash, orgName, address, agreement, password, confirmPassword })

        // if not isValid
        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {
            // if isValid
            User.findOne({ phone })
                .then(user => {
                    if (user) {
                        return resourceError(res, "User already Exist")
                    }

                    User.findOne({ email })
                        .then(user => {
                            if (user) {
                                return resourceError(res, "User already Exist")
                            }

                            bcrypt.hash(password, 11, (err, hash) => {

                                if (err) {
                                    return serverError(res, err)
                                }

                                let user = new User({
                                    name,
                                    email,
                                    phone,
                                    bkash,
                                    orgName,
                                    address,
                                    agreement: true,
                                    password: hash,
                                    balance: 0,
                                    deposit: 0,
                                    withdraw: 0,
                                    depositList: [],
                                    withdrawList: []
                                })

                                user.save()
                                    .then(user => {
                                        res.status(201).json({
                                            user
                                        })
                                    })
                                    .catch(error => serverError(res, error))

                            });

                        })
                        .catch(error => serverError(res, error))
                })
                .catch(error => serverError(res, error))
        }
    },

    // Login Controller
    login(req, res) {
        let { phone, password } = req.body;
        let validate = login({ phone, password });

        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        }

        if (validate.isValid) {
            User.findOne({ phone })
                .then(user => {
                    if (user) {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (err) {
                                return serverError(res, err)
                            }

                            if (result) {
                                let token = jwt.sign({
                                    _id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone,
                                    bkash: user.bkash,
                                    orgName: user.orgName,
                                    address: user.address,
                                    balance: user.balance,
                                    deposit: user.deposit,
                                    withdraw: user.withdraw,
                                    depositList: user.depositList,
                                    withdrawList: user.withdrawList,
                                    isUser: true
                                }, process.env.LOGIN_SECRET_KEY, { expiresIn: '2d' });

                                res.json({
                                    token: `Bearer ${token}`
                                })

                            } else {
                                return resourceError(res, "Password Doesn't Match")
                            }
                        })
                    } else {
                        Collector.findOne({ phone })
                            .then(collector => {
                                if (collector) {
                                    bcrypt.compare(password, collector.password, (err, result) => {
                                        if (err) {
                                            return serverError(res, err)
                                        }
            
                                        if (result) {
                                            let token = jwt.sign({
                                                _id: collector._id,
                                                name: collector.name,
                                                email: collector.email,
                                                phone: collector.phone,
                                                address: collector.address,
                                                role: collector.role,
                                                collections: collector.collections,
                                                isCollector: true
                                            }, process.env.LOGIN_SECRET_KEY, { expiresIn: '2d' });
            
                                            res.json({
                                                token: `Bearer ${token}`
                                            })
            
                                        } else {
                                            return resourceError(res, "Password Doesn't Match")
                                        }
                                    })
                                } else {
                                    Admin.findOne({ phone })
                                        .then(admin => {
                                            if (admin) {
                                                bcrypt.compare(password, admin.password, (err, result) => {
                                                    if (err) {
                                                        return serverError(res, err)
                                                    }
                        
                                                    if (result) {
                                                        let token = jwt.sign({
                                                            _id: admin._id,
                                                            name: admin.name,
                                                            email: admin.email,
                                                            address: admin.address,
                                                            phone: admin.phone,
                                                            role: admin.role,
                                                            wasteQuantity: admin.wasteQuantity,
                                                            userAmount: admin.userAmount,
                                                            userWithdraw: admin.userWithdraw,
                                                            collections: admin.collections,
                                                            isAdmin: true
                                                        }, process.env.LOGIN_SECRET_KEY, { expiresIn: '2d' });
                        
                                                        res.json({
                                                            token: `Bearer ${token}`
                                                        })
                        
                                                    } else {
                                                        return resourceError(res, "Password Doesn't Match")
                                                    }
                                                })
                                            } else {
                                                return resourceError(res, "User Not Found")
                                            }
                                        })
                                        .catch(error => serverError(res, error))
                                }
                            })
                            .catch(error => serverError(res, error))
                    }
                })
                .catch(error => serverError(res, error))
        }
    },

    // Get All Users
    getAllUsers(req, res) {
        User.find().sort({ $natural: -1 })
            .then(users => {
                res.status(200).json(users)
            })
            .catch(error => serverError(res, error))
    },

    // Update User
    updateUser (req, res) {
        let { userId } = req.params;
        User.findByIdAndUpdate( userId, { $set: req.body }, { new: true } )
            .then(result => {
                res.status(200).json({
                    user: result
                })
            })
            .catch(error => serverError(res, error)) 
    },

    // Remove User
    removeUser (req, res) {
        let { userId } = req.params;
        User.findByIdAndRemove( userId )
            .then(result => {
                res.status(200).json({
                    ...result._doc
                })
            })
            .catch(error => serverError(res, error)) 
    },

    // Change Password
    changePassword(req, res) {

        let { currentPassword, newPassword } = req.body;
        let { userId } = req.params;

        User.findOne({ _id: userId })
            .then(user => {
                if (user) {
                    bcrypt.compare(currentPassword, user.password, (err, result) => {
                        if (err) {
                            return serverError(res, err)
                        }
                        if (result) {
                            bcrypt.hash(newPassword, 11, (err, hash) => {

                                if (err) {
                                    return serverError(res, err)
                                }

                                User.findByIdAndUpdate({ _id: userId }, { password: hash }, { new: true })
                                    .then(result => {
                                        res.status(200).json({
                                            message: 'You have changed your password successfully',
                                            password: result
                                        })
                                    })
                                    .catch(error => serverError(res, error))

                            });
                        } else {
                            return resourceError(res, "Invalid Current Password")
                        }
                    })
                } else {
                    Collector.findOne({ _id: userId })
                            .then (collector => {
                                if (collector) {
                                    bcrypt.compare(currentPassword, collector.password, (err, result) => {
                                        if (err) {
                                            return serverError(res, err)
                                        }
                                        if (result) {
                                            bcrypt.hash(newPassword, 11, (err, hash) => {
                
                                                if (err) {
                                                    return serverError(res, err)
                                                }
                
                                                Collector.findByIdAndUpdate({ _id: userId }, { password: hash }, { new: true })
                                                    .then(result => {
                                                        res.status(200).json({
                                                            message: 'You have changed your password successfully',
                                                            password: result
                                                        })
                                                    })
                                                    .catch(error => serverError(res, error))
                
                                            });
                                        } else {
                                            return resourceError(res, "Invalid Current Password")
                                        }
                                    })
                                } else {
                                    Admin.findOne({ _id: userId })
                                        .then(admin => {
                                            if (admin) {
                                                bcrypt.compare(currentPassword, admin.password, (err, result) => {
                                                    if (err) {
                                                        return serverError(res, err)
                                                    }
                                                    if (result) {
                                                        bcrypt.hash(newPassword, 11, (err, hash) => {
                            
                                                            if (err) {
                                                                return serverError(res, err)
                                                            }
                            
                                                            Admin.findByIdAndUpdate({ _id: userId }, { password: hash }, { new: true })
                                                                .then(result => {
                                                                    res.status(200).json({
                                                                        message: 'You have changed your password successfully',
                                                                        password: result
                                                                    })
                                                                })
                                                                .catch(error => serverError(res, error))
                            
                                                        });
                                                    } else {
                                                        return resourceError(res, "Invalid Current Password")
                                                    }
                                                })
                                            } else {
                                                return resourceError(res, "User Not Authenticated")
                                            }
                                        })
                                        .catch(error => serverError(res, error))
                                } 
                            })
                            .catch(error => serverError(res, error))
                }
            })
            .catch(error => serverError(res, error))
    },

    // Forgot password
    forgotPassword(req, res) {
        let { email } = req.body;

        User.findOne({ email })
            .then(user => {
                if (user) {
                    let token = jwt.sign({ _id: user._id }, process.env.FORGET_PASS_TOKEN, { expiresIn: '20m' });

                    let transporter = nodemailer.createTransport({
                        host: process.env.NODE_MAILER_HOST,
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: process.env.NODE_MAILER_USER,
                            pass: process.env.NODE_MAILER_USER_PASS
                        }
                    });

                    let mailOptions = {
                        from: process.env.NODE_MAILER_USER,
                        to: email,
                        subject: '[Forwarrd] Reset Your password',
                        html: `
                            <h1>Need a new password?</h1>
                            <p>No worries. Click the button below to reset and choose a new one.</p>
                            <a href="http://forwarrd.mrbsoft.com/reset-password/${token}">
                                <button
                                    style="
                                    background: green;
                                    color: white;
                                    border: none;
                                    padding: 15px 25px;
                                    border-radius: 5px;
                                    "
                                >
                                    Reset Password
                                </button>
                            </a>
                            <p>Didn’t request this change? You can ignore this email and get back to business as usual.</p>
                        `
                    }

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.send(error);
                        }

                        User.findOneAndUpdate({ email }, { resetLink: token }, { new: true })
                            .then(result => {
                                res.json({
                                    result
                                })
                            })
                            .catch(error => serverError(res, error))

                    })

                } else {
                    Collector.findOne({ email })
                            .then(collector => {
                                if (collector) {
                                    let token = jwt.sign({ _id: collector._id }, process.env.FORGET_PASS_TOKEN, { expiresIn: '20m' });

                                    let transporter = nodemailer.createTransport({
                                        host: process.env.NODE_MAILER_HOST,
                                        port: 587,
                                        secure: false,
                                        requireTLS: true,
                                        auth: {
                                            user: process.env.NODE_MAILER_USER,
                                            pass: process.env.NODE_MAILER_USER_PASS
                                        }
                                    });
                
                                    let mailOptions = {
                                        from: process.env.NODE_MAILER_USER,
                                        to: email,
                                        subject: '[Forwarrd] Reset Your password',
                                        html: `
                                            <h1>Need a new password?</h1>
                                            <p>No worries. Click the button below to reset and choose a new one.</p>
                                            <a href="http://forwarrd.mrbsoft.com/reset-password/${token}">
                                                <button
                                                    style="
                                                    background: green;
                                                    color: white;
                                                    border: none;
                                                    padding: 15px 25px;
                                                    border-radius: 5px;
                                                    "
                                                >
                                                    Reset Password
                                                </button>
                                            </a>
                                            <p>Didn’t request this change? You can ignore this email and get back to business as usual.</p>
                                        `
                                    };

                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            res.send(error);
                                        }
                
                                        Collector.findOneAndUpdate({ email }, { resetLink: token }, { new: true })
                                            .then(result => {
                                                res.json({
                                                    result
                                                })
                                            })
                                            .catch(error => serverError(res, error))
                
                                    })

                                } else {
                                    Admin.findOne({ email })
                                        .then(admin => {
                                            if (admin) {
                                                let token = jwt.sign({ _id: admin._id }, process.env.FORGET_PASS_TOKEN, { expiresIn: '20m' });
            
                                                let transporter = nodemailer.createTransport({
                                                    host: process.env.NODE_MAILER_HOST,
                                                    port: 587,
                                                    secure: false,
                                                    requireTLS: true,
                                                    auth: {
                                                        user: process.env.NODE_MAILER_USER,
                                                        pass: process.env.NODE_MAILER_USER_PASS
                                                    }
                                                });
                            
                                                let mailOptions = {
                                                    from: process.env.NODE_MAILER_USER,
                                                    to: email,
                                                    subject: '[Forwarrd] Reset Your password',
                                                    html: `
                                                        <h1>Need a new password?</h1>
                                                        <p>No worries. Click the button below to reset and choose a new one.</p>
                                                        <a href="http://forwarrd.mrbsoft.com/reset-password/${token}">
                                                            <button
                                                                style="
                                                                background: green;
                                                                color: white;
                                                                border: none;
                                                                padding: 15px 25px;
                                                                border-radius: 5px;
                                                                "
                                                            >
                                                                Reset Password
                                                            </button>
                                                        </a>
                                                        <p>Didn’t request this change? You can ignore this email and get back to business as usual.</p>
                                                    `
                                                };
            
                                                transporter.sendMail(mailOptions, (error, info) => {
                                                    if (error) {
                                                        res.send(error);
                                                    }
                            
                                                    Admin.findOneAndUpdate({ email }, { resetLink: token }, { new: true })
                                                        .then(result => {
                                                            res.json({
                                                                result
                                                            })
                                                        })
                                                        .catch(error => serverError(res, error))
                            
                                                })
            
                                            } else {
                                                return resourceError(res, "User Not Found")
                                            }
                                        })
                                        .catch(error => serverError(res, error))
                                }
                            })
                            .catch(error => serverError(res, error))
                }
            })
            .catch(error => serverError(res, error))
    },

    // Reset Password
    resetPassword(req, res) {
        let { resetLink, newPassword, confirmPassword } = req.body;
        
        let validate = resetPassword({ newPassword, confirmPassword });

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {
            if (resetLink) {

                let decoded ;

                jwt.verify(resetLink, process.env.FORGET_PASS_TOKEN, (error, decodedData) => {
                    if (error) {
                        return resourceError(res, "incorrect token or it is expired");
                    }
                    decoded = decodedData;
                });

                User.findOne({ _id: decoded._id })
                .then(user => {
                    if (user) {
                        bcrypt.hash(newPassword, 11, (err, hash) => {
                            if (err) {
                                return serverError(res, err)
                            }

                            User.findOneAndUpdate({ _id: decoded._id }, { password: hash, resetLink: '' }, { new: true })
                                .then(user => {
                                    res.status(200).json({
                                        user
                                    })
                                })
                                .catch(error => serverError(res, error))
                        });
                    } else {
                        Collector.findOne({ _id: decoded._id })
                                .then(collector => {
                                    if (collector) {
                                        bcrypt.hash(newPassword, 11, (err, hash) => {
                                            if (err) {
                                                return serverError(res, err)
                                            }
                
                                            Collector.findOneAndUpdate({ _id: decoded._id }, { password: hash, resetLink: '' }, { new: true })
                                                .then(collector => {
                                                    res.status(200).json({
                                                        collector
                                                    })
                                                })
                                                .catch(error => serverError(res, error))
                                        });
                                    } else {
                                        Admin.findOne({ _id: decoded._id })
                                            .then(admin => {
                                                if (admin) {
                                                    bcrypt.hash(newPassword, 11, (err, hash) => {
                                                        if (err) {
                                                            return serverError(res, err)
                                                        }
                            
                                                        Admin.findOneAndUpdate({ _id: decoded._id }, { password: hash, resetLink: '' }, { new: true })
                                                            .then(admin => {
                                                                res.status(200).json({
                                                                    admin
                                                                })
                                                            })
                                                            .catch(error => serverError(res, error))
                                                    });
                                                } else {
                                                    return resourceError(res, "User Not Found")
                                                }
                                            })
                                            .catch(error => serverError(res, error))
                                    }
                                })
                                .catch(error => serverError(res, error))
                    }
                })
                .catch(error => serverError(res, error))

            } else {
                return res.status(401).json({
                    notice: "Authentication error !!"
                })
            }
        }
    },

    // Update User
    updateUser (req, res) {

        let { userId } = req.params;
        let { name, bkash, orgName, address } = req.body;
        let validate = userUpdate({ name, bkash, orgName, address })

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {
            User.findByIdAndUpdate( userId, { $set: req.body }, { new: true } )
                .then(result => {
                    res.status(200).json({
                        user: result
                    })
                })
                .catch(error => serverError(res, error)) 
        }
    },

}



