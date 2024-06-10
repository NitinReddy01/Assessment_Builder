import { Router } from "express";
import { AssessmentBuilder, ITemplate } from "../Assessment_Builder/AssessmentBuilder";
import Template from "../models/Template_Schema";

const templateRouter = Router();

templateRouter.post('/add-template',async (req,res)=>{
    try {
        if(!req.body.template){
            return res.status(404).json({message:"Template required"});
        }
        const template : ITemplate = req.body.template;
        const newTemplate = new AssessmentBuilder();
        const templateId = await newTemplate.createTemplate(template);
        return res.status(201).json({templateId});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
});

templateRouter.get('/all-templates',async (req,res)=>{
    try {
        const templates = await Template.find({}).select("type");
        res.status(200).json({templates});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})

export default templateRouter;