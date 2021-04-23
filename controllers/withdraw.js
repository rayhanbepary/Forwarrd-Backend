const Withdraw = require('../models/Withdraw');
const User = require('../models/User');
const Admin = require('../models/Admin');

const withdrawValidator = require('../validators/withdraw');
const { serverError, resourceError } = require('../util/error');

module.exports = {

    // Create Withdraw
    createWithdraw(req, res) {
        let { name, phone, orgName, amount, bkash } = req.body;
        let { _id, balance } = req.user;

        let validate = withdrawValidator({ name, phone, orgName, amount, bkash });

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {

            let floorAmount = Math.floor(amount);

            console.log(amount, floorAmount);

            let withdraw = new Withdraw({
                name,
                phone,
                orgName,
                amount: floorAmount,
                bkash,
                status: "Pending",
                author: _id
            })

            if (floorAmount > balance) {
                return resourceError(res, "Insufficient Balance");
            } else {
                withdraw.save()
                .then(withdraw => {

                    let updatedUser = {...req.user._doc}
                    updatedUser.balance = updatedUser.balance - parseInt(floorAmount);
                    updatedUser.withdraw = updatedUser.withdraw + parseInt(floorAmount);

                    updatedUser.withdrawList.unshift(withdraw._id)

                    User.findByIdAndUpdate( updatedUser._id, { $set: updatedUser }, { new: true } )
                    .then(user => {

                        Admin.find({ role: "Administrator" })
                        .then(result => {

                                let userWithdraw;

                                result.map(admin => {
                                    userWithdraw = admin.userWithdraw + parseInt(floorAmount);
                                })

                                Admin.updateMany({ role: "Administrator" }, {$set:{userWithdraw}}, {new: true})
                                .then(result => {
                                    res.status(201).json({
                                        message: "Withdraw request submitted successfully",
                                        ...withdraw._doc
                                    })
                                })
                                .catch(error => serverError(res, error))
                        })
                        .catch(error => serverError(res, error))

                    })
                    .catch(error => serverError(res, error))

                })
                .catch(error => serverError(res, error))
            }
        }
    },

    // Get All Withdraw
    getAllWithdraw(req, res) {
        Withdraw.find().sort({ $natural: -1 })
            .then(withdraws => {
                if (withdraws.length === 0) {
                    res.status(200).json({
                        message: 'No Withdraw Found'
                    })
                } else {
                    res.status(200).json(withdraws)
                }
            })
            .catch(error => serverError(res, error))
    },

    //Get All Withdraws Of Diff User
    getWithdrawsOfDiffUser(req, res) {
        let { _id } = req.user

        Withdraw.find({ author: _id }).sort({ $natural: -1 })
            .then(withdraws => {

                if (withdraws.length === 0) {
                    res.status(200).json({
                        message: 'No Withdraw Found'
                    })
                } else {
                    res.status(200).json(withdraws)
                }

            })
            .catch(error => serverError(res, error))
    },


    //Get User's Withdraws
    getUserWithdraws(req, res) {
        let { client } = req.params
        Withdraw.find({ phone: client }).sort({ $natural: -1 })
            .then(deposits => {

                if (deposits.length === 0) {
                    res.status(200).json({
                        message: 'No Withdraws Found'
                    })
                } else {
                    res.status(200).json(deposits)
                }
            })
            .catch(error => serverError(res, error))
    },

    // Update Withdraw
    updateWithdraw (req, res) {
        let { withdrawId } = req.params;
        let { status } = req.body;
        Withdraw.findByIdAndUpdate( withdrawId, { $set: { status: status } }, { new: true } )
            .then(result => {
                res.status(200).json({
                    message: 'Updated Successfully',
                    withdraw: result
                })
            })
            .catch(error => serverError(res, error))
    },

}







