const bcrypt = require('bcrypt');
const admin = require('../validators/admin');
const adminUpdate = require('../validators/adminUpdate');

const {serverError, resourceError} = require('../util/error');
const Admin = require('../models/Admin');

module.exports = {

    // Create Admin Controller
    createAdmin (req,res) {

        let {name, email, phone, address, role, password, confirmPassword} = req.body;
        let validate = admin({name, email, phone, address, role, password, confirmPassword})

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {

            Admin.findOne({ phone })
            .then(admin => {
                if (admin) {
                    return resourceError(res, "Admin already Exist")
                }

                Admin.findOne({ email })
                    .then(admin => {
                        if (admin) {
                            return resourceError(res, "Admin already Exist")
                        }

                        bcrypt.hash(password, 11, (err, hash) => {

                            if (err) {
                                return serverError(res, err)
                            }
        
                            let admin = new Admin ({
                                name,
                                email,
                                phone,
                                address,
                                password: hash,
                                role,
                                wasteQuantity: 0,
                                userAmount: 0,
                                userWithdraw: 0,
                                collections: []
                            })  
        
                            admin.save()
                            .then(admin => {
                                res.status(201).json({ 
                                    message: "Admin Created Successfully"
                                })
                            })
                            .catch(error => serverError(res, error))
                            
                        });

                    })
                    .catch(error => serverError(res, error))

            })
            .catch( error => serverError(res, error))
        }
    },

    // Get All Admins
    getAllAdmin (req, res) {
        Admin.find().sort({ $natural: -1 })
            .then(admins => {
                res.status(200).json(admins)
            })
            .catch( error => serverError(res, error))
    },

    // Update Admin
    updateAdmin (req, res) {
        let { adminId } = req.params;

        let { name, address } = req.body;
        let validate = adminUpdate({ name, address })

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {
            Admin.findByIdAndUpdate( adminId, { $set: req.body }, { new: true } )
                .then(result => {
                    res.status(200).json({
                        message: 'Admin Updated Successfully',
                        admin: result
                    })
                })
                .catch(error => serverError(res, error)) 
        }
    },

    // Remove Admin
    removeAdmin (req, res) {
        let { adminId } = req.params;
        Admin.findByIdAndRemove( adminId )
            .then(result => {
                res.status(200).json({
                    message: 'Admin Removed Successfully',
                    ...result._doc
                })
            })
            .catch(error => serverError(res, error)) 
    }

}