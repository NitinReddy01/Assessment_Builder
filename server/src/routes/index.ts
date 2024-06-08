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
    }
})

export default router;
