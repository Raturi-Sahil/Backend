const {CourseModel}  = require('../models/course');


async function erase(req, res) {
    // this endpoint let's an admin delete a course.
    try {
        const courseId = req.params.id;
        // no need to check for course id, if it hadn't been there then the requiest wouldn't have hit this endpoint.

        const response = await CourseModel.findByIdAndDelete(courseId);
        
        if(!response)
            res.status(404).json({msg: "Course not found"});

        // res.status(204).json({msg: "Course successfully deleted", response}); if you keep it 204 then don't send a body, else make it 200 and send a body with it. 
        res.status(200).json({msg: "Course successfully deleted"});
    }catch(error) {
        console.error(error);
        return res.status(500).json({msg: "Internal server error"});
    }

    }

    async function create(req, res) {
            try {
                    // this endpoint let's an admin create a new course. 
                const userId = req.userId;
                const { title, description, price } = req.body;
    
                if(!title || !description || !price)
                    return res.status(400).json({msg: "Please fill all the details"});
    
                const course = await CourseModel.create({title, description, price, userId});
    
                // if course creation fails
                if(!course)
                    return res.status(500).json({msg: "Internal server error"});
    
                res.status(201).json({msg: "Course successfully created", course});
            } catch(error) {
                console.error(error);
                res.status(500).json({msg: "Internal server error"});
            }
        }

        async function update(req, res) {
        try {
            // this endpoint let's an admin update a course. 
            const courseId = req.params.id;
            const updates = req.body;

            // no need to check for course id, if it hadn't been there then the requiest wouldn't have hit this endpoint.

            if(!updates || Object.keys(updates).length == 0)
                return res.status(400).json({msg: "Nothing to update"});

            const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {$set: updates}, {new: true, runValidators: true});

            if(!updatedCourse)
                return res.status(500).json({msg: "Error during update"});

            res.status(200).json({msg: "Course updated", updatedCourse});

        }catch(error) {
            console.error(error);
            res.status(500).json({msg: "Internal server error"});
        }
    }

    async function fetch(req, res) {
        
        try {
            // this endpoint let's an admin to fetch all the courses they have created. 
            const userId = req.userId;
            const courses = await CourseModel.find({userId});// fetch all the course. 
            if(!courses || courses.length == 0)
                return res.json({msg: "No course created", userId});

            res.status(200).json(courses);// send to the frontend.
        }catch(error) {
            console.error(error);
            res.status(500).json({msg: "An error occured during fetching the courses"})
        }
    }


    module.exports = {
        erase, create, update, fetch
    }