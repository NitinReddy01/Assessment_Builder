import { Router } from "express";
import { AssessmentBuilder, AssessmentTemplate, } from "../Assessment_Builder/AssessmentBuilder";
import Assessment from "../models/Assessment_Schema";
import Parts from "../models/TemplateParts_Schema"
import MCQ from "../models/MCQ_Schema";
import FIB from "../models/FIB_Schema";
import MTF from "../models/MTF_Schema"
import AudioQuestion from "../models/AudioQuestion";

const assessmentRouter = Router();

assessmentRouter.post('/add-assessment', async (req, res) => {
    try {
        const type:string = req.body.type;
        const title:string = req.body.title;
        const assessment:AssessmentTemplate  = req.body.assessment;
        const time = req.body.time;
        const newAssessment = new AssessmentBuilder();
        const id = await newAssessment.createAssessment(title, assessment, type, time);
        res.status(201).json({ message: "Assessment Created", id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

assessmentRouter.get('/all-assessments', async (req, res) => {
    try {
        const assessments = await Assessment.find({}).select("type title templateType");
        res.status(200).json({assessments});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


assessmentRouter.get('/assessment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const assessment = await Assessment.findById(id).populate('parts').exec();

        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        // Function to populate items based on question type
        const populateItems = async (parts: any[]) => {
            for (const part of parts) {
                for (const item of part.items) {
                    switch (item.questionType) {
                        case 'MCQ':
                            item.questionId = await MCQ.findById(item.questionId).exec();
                            break;
                        case 'FIB':
                            item.questionId = await FIB.findById(item.questionId).exec();
                            break;
                        case 'MTF':
                            item.questionId = await MTF.findById(item.questionId).exec();
                            break;
                        case 'AudioQuestion':
                            item.questionId = await AudioQuestion.findById(item.questionId).exec();
                            break;
                    }
                }
            }
        };

        await populateItems(assessment.parts);

        res.status(200).json({ assessment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




export default assessmentRouter;
