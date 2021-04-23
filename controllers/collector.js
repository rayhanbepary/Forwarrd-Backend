const bcrypt = require('bcrypt');
const collector = require('../validators/collector');
const collectorUpdate = require('../validators/collectorUpdate');
const {serverError, resourceError} = require('../util/error');

const Collector = require('../models/Collector');

module.exports = {

    // Create Collector Controller
    createCollector (req,res) {

        let {name, email, phone, address, role, password, confirmPassword} = req.body;
        let validate = collector({name, email, phone, address, role, password, confirmPassword})

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {
            Collector.findOne({ phone })
            .then(collector => {
                if (collector) {
                    return resourceError(res, "Collector already Exist")
                }

                Collector.findOne({ email })
                        .then(collector => {
                            if (collector) {
                                return resourceError(res, "Collector already Exist")
                            }

                            bcrypt.hash(password, 11, (err, hash) => {

                                if (err) {
                                    return serverError(res, err)
                                }
            
                                let collector = new Collector ({
                                    name,
                                    email,
                                    phone,
                                    address,
                                    password: hash,
                                    role,
                                    collections: []
                                })  
            
                                collector.save()
                                .then(collector => {
                                    res.status(201).json({ 
                                        message: "Collector Created Successfully"
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

    // Get All Collectors
    getAllCollector (req, res) {
        Collector.find().sort({ $natural: -1 })
            .then(collector => {
                res.status(200).json(collector)
            })
            .catch( error => serverError(res, error))
    },

    // Update Collector
    updateCollector (req, res) {
        let { collectorId } = req.params;

        let { name, address } = req.body;
        let validate = collectorUpdate({ name, address })

        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {
            Collector.findByIdAndUpdate( collectorId, { $set: req.body }, { new: true } )
                .then(result => {
                    res.status(200).json({
                        message: 'Collector Updated Successfully',
                        collector: result
                    })
                })
                .catch(error => serverError(res, error)) 
        }
    },

    // Remove Collector
    removeCollector (req, res) {
        let { collectorId } = req.params;
        Collector.findByIdAndRemove( collectorId )
            .then(result => {
                res.status(200).json({
                    message: 'Collector Removed Successfully',
                    ...result._doc
                })
            })
            .catch(error => serverError(res, error)) 
    }

}