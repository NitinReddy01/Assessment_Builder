import { Router } from "express";
import { AssessmentBuilder, ITemplate } from "../Assessment_Builder/AssessmentBuilder";
import Template from "../models/Template_Schema";
import { IParts } from "../models/TemplateParts_Schema";

const templateRouter = Router();

// TODO: need to do input validation for all routes

templateRouter.post('/add-template',async (req,res)=>{
    try {
        if(!req.body.template){
            return res.status(404).json({message:"Template required"});
        }
        const template : ITemplate = req.body.template;
        // console.log(template.parts[0].policies);
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

templateRouter.get('/template/:id',async (req,res)=>{
    try {
        const id = req.params.id;
        if(!id ) {
            return res.status(400).json({message:"Id required"});
        } 
        const template = await Template.findById(id).populate<{parts:IParts}>("parts");
        res.status(200).json({template});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})

export default templateRouter;