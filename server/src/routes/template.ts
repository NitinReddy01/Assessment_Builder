import { Router } from "express";
import { AssessmentBuilder, ITemplate } from "../Assessment_Builder/AssessmentBuilder";
import Template from "../models/Template_Schema";
import { IParts } from "../models/TemplateParts_Schema";
import Assessment from "../models/Assessment_Schema";
import Parts from "../models/TemplateParts_Schema";
import AudioQuestion from "../models/AudioQuestion";
import FIB from "../models/FIB_Schema";
import MTF from "../models/MTF_Schema";
import MCQ from "../models/MCQ_Schema";
import mongoose from "mongoose";
import { deleteParts } from "./assessment";
const templateRouter = Router();

// TODO: need to do input validation for all routes

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

templateRouter.put('/update-template',async (req,res)=>{
   
    try {
        if(!req.body.template){
            return res.status(404).json({message:"Template required"});
        }
        const template : ITemplate = req.body.template;
        const newTemplate = new AssessmentBuilder();
        const templateId = await newTemplate.updateTemplate(req.body.template._id,template);
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


const deleteTemplate = async (templateId: mongoose.Types.ObjectId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {

        const template = await Template.findById(templateId).session(session);

        const Assessments = await Assessment.find({ templateType: templateId }).session(session);

        await Promise.all(Assessments.map( async (assessment)=>{
            await deleteParts(assessment.parts,session);
        }))
        await Assessment.deleteMany({ templateType: templateId }).session(session);
        await deleteParts(template!.parts,session);
        await Template.findByIdAndDelete(templateId).session(session);
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


// Define the DELETE route for deleting a template
templateRouter.delete('/template/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid template ID' });
    }
    const template = await Template.findById(id);
    if (!template) {
        return res.status(200).json({message:"Template not found"});
    };
    try {
        await deleteTemplate(new mongoose.Types.ObjectId(id));
        res.status(200).json({ message: 'Template and all associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting template' });
    }
});

export default templateRouter;