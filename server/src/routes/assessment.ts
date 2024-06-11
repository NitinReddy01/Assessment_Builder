import { Router } from "express";
import { AssessmentBuilder, AssessmentTemplate, } from "../Assessment_Builder/AssessmentBuilder";
import Assessment from "../models/Assessment_Schema";

const assessmentRouter = Router();

assessmentRouter.post('/add-assessment',async (req,res) =>{
    try {
        const type:string = req.body.type;
        const title:string = req.body.title;
        const assessment:AssessmentTemplate  = req.body.assessment;
        const time = req.body.time;
        const newAssessment = new AssessmentBuilder();
        const id = await newAssessment.createAssessment(title,assessment,type,time)
        res.status(201).json({message:"Assessment Created"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
});

assessmentRouter.get('/all-assessments',async (req,res)=>{
    try {
        const assessments = await Assessment.find({}).select("type title templateType");
        res.status(200).json({assessments});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})

export default assessmentRouter;