const { CourseModel } = require('../models/course');
const { PurchaseModel } = require('../models/purchase');


    async function courses(req, res) {
        try {
            // this endpoint shows all courses available for a user to purchase.
            const courses = await CourseModel.find();// fetch all the course.

            if(!courses || courses.length == 0)
                return res.json({msg: "No course availabe"}); 

            res.status(200).json(courses);// send to the frontend.
        }catch(error) {
            console.error(error);
            res.status(500).json({msg: "An error occured during fetching the courses"})
        }
    }

    async function purchase(req, res) {
        try {
            //this endpoint let's a user make a purchase. 
            const userId = req.userId;
            const courseId = req.body.courseId;

            if(!courseId)
                return res.status(400).json({msg: "Invalid input"});

            const existingPurchase = await PurchaseModel.find({userId, courseId});
            if(existingPurchase)
                return res.status(409).json({msg: "Course already purchased"});

            const purchase = await PurchaseModel.create({userId, courseId});

            if(!purchase || purchase.length == 0)
                return res.status(500).json({msg: "An error occured during purchase"});

            res.status(201).json({msg: "Transaction successful", purchase});
        } catch(error) {
            console.error(error);
            return res.status(500).json({msg: "Internal server error"});
        }
    }

    async function purchases(req, res) {
        try {
            //this endpoint fetches all the purchased courses of a user. 
            const userId = req.userId;
            const purchases = await PurchaseModel.findOne({userId});
            res.status(200).json(purchases);
        } catch(error) {
            res.status(500).json({msg: "Internal server error"});
        }
    }

    module.exports = {
        courses, purchase, purchases
    }