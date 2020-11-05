const Tour = require('./../models/tourModels');

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = async (req, res) => {

    try {
        // BUILD QUERY
        // 1A) Filtering 
        const queryObj = {
            ...req.query
        };

        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) ADVANCE FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


        // {difficulty :'easy',duration:{$gte:5}}
        // {difficulty :'easy',duration:{gte:5}}
        // gte, gt, ,lte, lt

        //GET ALL TOURS
        // const tours = await Tour.find();

        //METHOD-1 FILTER TOURS
        let query = Tour.find(JSON.parse(queryStr));

        //METHOD-2 FILTER TOURS
        // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

        // 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
            // sort('price ratingsAverage')
        } else {
            query = query.sort('-createdAt');
        }

        // EXECUTE QUERY
        const tours = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

}

exports.getTour = async (req, res) => {

    try {

        const tour = await Tour.findById(req.params.id);

        //Another way
        //Tour.findOne({_id:req.params.id})

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

}

exports.createTour = async (req, res) => {
    try {
        //Way-1

        //const newTour = new Tour({});
        //newTour.save();

        //Way-2
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }

}

exports.updateTour = async (req, res) => {

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }


};

exports.deleteTour = async (req, res) => {

    try {

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }


}