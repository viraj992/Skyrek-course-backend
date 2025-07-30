import Student from "../models/student.js";

export function getStudents(req,res){
        Student.find().then(  // model eke connector eka through find krnwaa
                // store details to students variable
            (students)=>{
                res.json(students); // & show them
            }

        ).catch(()=>{
                res.json({
                    message: "Failed to fetch students"
                });
            });
    }


    export function createStudent (req,res){
        console.log(req.body) // print in terminal
        if(req.user == null){
            res.status(403).json({
                message : "Please login to create a student"
            })
            return
        }
        if(req.user.role != "admin"){
            res.status(403).json({
                message : "Please login as an admin to create a student"
            })
            return
        }
        
        const student = new Student(
            {
                name : req.body.name,
                age : req.body.age,
                email : req.body.email
            }
        )
        student.save().then(()=>{
            res.json(
                {
                    message : "Student saved successfully"
                }
            )
        }).catch(()=>{
            console.log("Failed to save student")
        })
    }