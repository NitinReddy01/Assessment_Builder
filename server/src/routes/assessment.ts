import { Router } from "express";
import { AssessmentBuilder, ITemplate } from "../Assessment_Builder/AssessmentBuilder";
import Assessment from "../models/Assessment_Schema";

const assessmentRouter = Router();

assessmentRouter.post('/add-assessment', async (req, res) => {
    try {
        const type: string = req.body.type;
        const title: string = req.body.title;
        const assessment: ITemplate = req.body.assessment;
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
        res.status(200).json({ assessments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


assessmentRouter.get('/assessment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const assessment = await Assessment.findById(id)
            .populate({
                path: 'parts',
                populate: {
                    path: 'items.questionId',
                    model: function(doc) {
                        switch (doc.questionType) {
                            case 'FIB': return 'FIB';
                            case 'MCQ': return 'MCQ';
                            case 'MTF': return 'MTF';
                         
                            default: return '';
                        }
                    }
                }
            });

        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        res.status(200).json({ assessment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


export default assessmentRouter;
