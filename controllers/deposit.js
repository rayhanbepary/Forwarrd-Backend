const Deposit = require('../models/Deposit');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Collector = require('../models/Collector');
const depositValidator = require('../validators/deposit');

const { serverError, resourceError } = require('../util/error');

module.exports = {

    // Create Deposit
    createDeposit(req, res) {
        let { name, client, orgName, amount, quantity, type } = req.body;
        let userId = req.user._id;
        let validate = depositValidator({ name, client, orgName, amount, quantity, type });

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {

            let floorAmount = Math.floor(amount);
            let floorQuantity = Math.floor(quantity)

            let deposit = new Deposit({
                name,
                client,
                orgName,
                amount: floorAmount,
                quantity: floorQuantity,
                type,
                author: userId
            })

            deposit.save()
                .then(deposit => {

                    User.findOne({ phone: deposit.client })
                        .then(result => {
                            if (result) {

                                let updateUser = result

                                updateUser.balance = updateUser.balance + parseInt(floorAmount);
                                updateUser.deposit = updateUser.deposit + parseInt(floorAmount);

                                updateUser.depositList.unshift(deposit._id)

                                User.findByIdAndUpdate(updateUser._id, { $set: updateUser }, { new: true })
                                    .then(result => {

                                        if (result) {

                                            let updatedAdminOrCollector = { ...req.user._doc }

                                            updatedAdminOrCollector.collections.unshift(deposit._id)

                                            if (updatedAdminOrCollector.role === 'Collector') {
                                                Collector.findByIdAndUpdate(updatedAdminOrCollector._id, { $set: updatedAdminOrCollector }, { new: true })
                                                    .then(updatedCollector => {

                                                        if (updatedCollector) {
//
                                                            Admin.find({ role: "Administrator" })
                                                                .then(result => {
                                                                    if (result) {

                                                                        let wasteQuantity;
                                                                        let userAmount;

                                                                        result.map(admin => {
                                                                            wasteQuantity = admin.wasteQuantity + parseInt(floorQuantity);
                                                                            userAmount = admin.userAmount + parseInt(floorAmount);
                                                                        })

                                                                        Admin.updateMany({ role: "Administrator" }, {$set:{wasteQuantity,userAmount}}, {new: true})
                                                                        .then(newAdmin => {
                                                                            res.status(201).json({
                                                                                message: "Deposit Created successfully",
                                                                                ...deposit._doc,
                                                                                newAdmin
                                                                            })
                                                                        })
                                                                        .catch(error => serverError(res, error))

                                                                    }
                                                                })
                                                                .catch(error => serverError(res, error))
                                                        }

                                                    })
                                                    .catch(error => serverError(res, error))
                                            } else {

                                                Admin.find({ role: "Administrator" })
                                                .then(result => {
                                                    if (result) {

                                                        let wasteQuantity;
                                                        let userAmount;

                                                        result.map(admin => {
                                                            wasteQuantity = admin.wasteQuantity + parseInt(floorQuantity);
                                                            userAmount = admin.userAmount + parseInt(floorAmount);
                                                        })

                                                        Admin.updateMany({ role: "Administrator" }, {$set:{wasteQuantity,userAmount}}, {new: true})
                                                        .then(newAdmin => {
                                                            res.status(201).json({
                                                                message: "Deposit Created successfully",
                                                                ...deposit._doc,
                                                                newAdmin
                                                            })
                                                        })
                                                        .catch(error => serverError(res, error))

                                                    }
                                                })
                                                .catch(error => serverError(res, error))

                                            }
                                        }
                                    })
                                    .catch(error => serverError(res, error))

                            } else {
                                return resourceError(res, "Deposit Failed");
                            }
                        })
                        .catch(error => serverError(res, error))
                })
                .catch(error => serverError(res, error))
        }
    },

    // Get All Deposits
    getAllDeposits(req, res) {
        Deposit.find().sort({ $natural: -1 })
            .then(deposits => {
                if (deposits.length === 0) {
                    res.status(200).json({
                        message: 'No Deposits Found'
                    })
                } else {
                    res.status(200).json(deposits)
                }
            })
            .catch(error => serverError(res, error))
    },

    //Get All Deposits Of Diff User
    getDepositsOfDiffUser(req, res) {
        let { phone, _id } = req.user

        Deposit.find({ $or: [{ client: phone }, { author: _id }] }).sort({ $natural: -1 })
            .then(deposits => {

                if (deposits.length === 0) {
                    res.status(200).json({
                        message: 'No Deposits Found'
                    })
                } else {
                    res.status(200).json(deposits)
                }

            })
            .catch(error => serverError(res, error))
    },

    //Get User's Deposits
    getUserDeposits(req, res) {
        let { client } = req.params
        Deposit.find({ client }).sort({ $natural: -1 })
            .then(deposits => {

                if (deposits.length === 0) {
                    res.status(200).json({
                        message: 'No Deposits Found'
                    })
                } else {
                    res.status(200).json(deposits)
                }
            })
            .catch(error => serverError(res, error))
    },

    //Get Collector's Deposits
    getCollectorDeposits(req, res) {
        let { author } = req.params
        Deposit.find({ author }).sort({ $natural: -1 })
            .then(deposits => {

                if (deposits.length === 0) {
                    res.status(200).json({
                        message: 'No Deposits Found'
                    })
                } else {
                    res.status(200).json(deposits)
                }
            })
            .catch(error => serverError(res, error))
    },

    // Update Deposit
    updateDeposit(req, res) {

        let {name,client,orgName, amount, quantity, type} = req.body;
        let { depositId } = req.params;
        let validate = depositValidator({ name, client, orgName, amount, quantity, type });

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {

        let floorAmount = Math.floor(amount)
        let floorQuantity = Math.floor(quantity)

        // find deposit by id
        Deposit.findById(depositId)
            .then(deposit => {

                if (deposit) {

                    // find user by deposit client
                    User.findOne({phone: deposit.client})
                    .then(user => {

                        // if user phone is equal to client
                        if (user.phone === client) {

                            
                            let oldBalance = user.balance - deposit.amount;
                            let oldDeposit = user.deposit - deposit.amount;

                            let newBalance = oldBalance + parseInt(floorAmount);
                            let newDeposit = oldDeposit + parseInt(floorAmount);

                            // update user by deposit client
                            User.findOneAndUpdate({phone: deposit.client}, {$set:{balance: newBalance,deposit: newDeposit}}, {new: true})
                            .then(result => {
                                if (result) {

                                    // find admin
                                    Admin.find({ role: "Administrator" })
                                    .then(admins => {
                                        if (admins) {
    
                                            let wasteQuantity;
                                            let userAmount;
    
                                            admins.map(admin => {
                                                let oldWasteQuantity = admin.wasteQuantity - deposit.quantity;
                                                let oldUserAmount = admin.userAmount - deposit.amount;
    
                                                wasteQuantity = oldWasteQuantity + parseInt(floorQuantity);
                                                userAmount = oldUserAmount + parseInt(floorAmount);
                                            })
    
                                            // update admin by deposit client
                                            Admin.updateMany({ role: "Administrator" }, {$set:{wasteQuantity,userAmount}}, {new: true})
                                            .then(result => {
                                                if (result) {
                                                    Deposit.findByIdAndUpdate(depositId, {$set: req.body}, {new: true})
                                                    .then(updateDeposit => {
                                                        res.status(200).json({
                                                            message: 'Updated Successfully',
                                                            deposit: updateDeposit
                                                        })
                                                    })
                                                    .catch(error => serverError(res, error))
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
                            // if user phone is not equal to client

                            User.findOne({ phone: client})
                            .then(users => {
                                if (!users) {
                                    return resourceError(res, "Client Not Found")
                                }

                                // This user is deposit.client
                                let newBalance = user.balance - deposit.amount;
                                let newDeposit = user.deposit - deposit.amount;
       
                                User.findOneAndUpdate({phone: deposit.client}, {$set:{balance: newBalance,deposit: newDeposit}}, {new: true})
                                .then(result => {

                                    if (result) {

                                        // find user by client
                                        User.findOne({phone: client})
                                        .then(user => {

                                            if (user) {
                                                let newBalance = user.balance + parseInt(floorAmount);
                                                let newDeposit = user.deposit + parseInt(floorAmount);

                                                User.findOneAndUpdate({phone: client}, {$set:{balance: newBalance,deposit: newDeposit}}, {new: true})
                                                .then(user => {
                                                    if (user) {
                                                        // find admin
                                                        Admin.find({ role: "Administrator" })
                                                        .then(admins => {
                                                            if (admins) {
                        
                                                                let wasteQuantity;
                                                                let userAmount;
                        
                                                                admins.map(admin => {
                                                                    let oldWasteQuantity = admin.wasteQuantity - deposit.quantity;
                                                                    let oldUserAmount = admin.userAmount - deposit.amount;
                        
                                                                    wasteQuantity = oldWasteQuantity + parseInt(floorQuantity);
                                                                    userAmount = oldUserAmount + parseInt(floorAmount);
                                                                })

                                                                // update admin by deposit client
                                                                Admin.updateMany({ role: "Administrator" }, {$set:{wasteQuantity,userAmount}}, {new: true})
                                                                .then(result => {
                                                                    if (result) {
                                                                        Deposit.findByIdAndUpdate(depositId, {$set: req.body}, {new: true})
                                                                        .then(updateDeposit => {
                                                                            res.status(200).json({
                                                                                message: 'Updated Successfully',
                                                                                deposit: updateDeposit
                                                                            })
                                                                        })
                                                                        .catch(error => serverError(res, error))
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
                                        })
                                        .catch(error => serverError(res, error))
                                    } 
                                })
                                .catch(error => serverError(res, error))
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

}







