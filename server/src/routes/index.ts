import { Router } from "express";
import { AssessmentBuilder, Template } from "../Assessment_Builder/AssessmentBuilder";

const router = Router();

router.post('/add-template',async (req,res)=>{
    try {
        if(!req.body.template){
            return res.status(404).json({message:"Template required"});
        }
        const template : Template = req.body.template;
        const newTemplate = new AssessmentBuilder();
        const templateId = await newTemplate.createTemplate(template);
        return res.status(201).json({templateId});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})

router.post('/add-assessment',async (req,res) =>{
    try {
        const type:string = req.body.type;
        const title:string = req.body.title;
        const assessment:Template  = req.body.assessment;
        const time = req.body.time;
        const newAssessment = new AssessmentBuilder();
        const id = await newAssessment.createAssessment(title,assessment,type,time)
        res.status(201).json({message:"Assessment Created"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})

export default router;
