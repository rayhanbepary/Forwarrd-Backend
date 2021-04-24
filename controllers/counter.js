const Counter = require('../models/Counter');
const {serverError, resourceError} = require('../util/error');

module.exports = {

    // Create Counter Controller
    createCounter (req,res) {

        let {wasteQuantity, livesImpact, recyclingPercent } = req.body;
        let counter = new Counter ({
            wasteQuantity,
            livesImpact,
            recyclingPercent
        })  

        counter.save()
        .then(counter => {
            res.status(201).json({ 
                message: "Counter Added Successfully"
            })
        })
        .catch(error => serverError(res, error))
    },

    // Get All Counter
    getAllCounter (req, res) {
        Counter.find().sort({ $natural: -1 })
            .then(counter => {
                res.status(200).json(counter)
            })
            .catch( error => serverError(res, error))
    },

    // Update Counter
    updateCounter (req, res) {
        let { counterId } = req.params;
        Counter.findByIdAndUpdate( counterId, { $set: req.body }, { new: true } )
            .then(result => {
                res.status(200).json({
                    message: 'Counter Updated Successfully'
                })
            })
            .catch(error => serverError(res, error))
    }

}