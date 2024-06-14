import { Router } from "express";
import { AssessmentBuilder, AssessmentParts } from "../Assessment_Builder/AssessmentBuilder";
import Assessment, { IAsessment } from "../models/Assessment_Schema";
import MCQ, { IMCQ } from "../models/MCQ_Schema";
import FIB, { IFIB, QuesitonType } from "../models/FIB_Schema";
import MTF, { IMTF } from "../models/MTF_Schema"
import AudioQuestion, { IAudioQuestion } from "../models/AudioQuestion";
import mongoose from "mongoose";
import Template from "../models/Template_Schema";
import Parts from "../models/TemplateParts_Schema";
const assessmentRouter = Router();

interface IAssessmentWithId extends IAsessment {
    _id: mongoose.Types.ObjectId;
}
// TODO: need to do input validaton for all these routes 

interface CreateParts {
    name: string;
    instruction: string;
    description: string;
    time: string;
    content: QuesitonType[];
    policies: {
      grade: {
        questionType: string;
        weightage: number;
      }[];
    };
    items: {
      questionType: string;
      tag: string;
      question: QuesitonType[];
      fibAnswers?: QuesitonType[];
      options?: {
        contentType: string;
        key: {
          value: string;
          isAnswer: boolean;
        };
      }[];
      leftOptions?: QuesitonType[];
      rightOptions?: QuesitonType[];
      mtfAnswers?: {
        leftAnswer?: QuesitonType;
        rightAnswer?: QuesitonType;
      }[];
    }[];
  }

  const transformParts = (createParts: CreateParts[]): AssessmentParts[] => {
    return createParts.map(part => {
        const transformedItems = part.items.map(item => {
            switch (item.questionType) {
                case "MCQ":
                    return {
                        questionType: item.questionType,
                        question: item.question,
                        options: item.options?.map(option => ({contentType:option.contentType,key:option.key.value})) || [],
                        answers: item.options?.filter(option => option.key.isAnswer).map(option => ({key:option.key.value,contentType:option.contentType})) || [],
                        time: part.time,
                        tag: item.tag
                    } as unknown as IMCQ;
                case "FIB":
                    return {
                        questionType: item.questionType,
                        question: item.question,
                        answers: item.fibAnswers || [],
                        time: part.time,
                        tag: item.tag
                    } as IFIB;
                case "MTF":
                    return {
                        questionType: item.questionType,
                        question: item.question,
                        leftOptions: item.leftOptions || [],
                        rightOptions: item.rightOptions || [],
                        answers: item.mtfAnswers?.map(answer => ({
                            leftAnswer: answer.leftAnswer,
                            rightAnswers: [answer.rightAnswer]
                        })) || [],
                        time: part.time,
                        tag: item.tag
                    } as unknown as IMTF;
                case "AudioQuestion" :
                    return {questionType:item.questionType,question:item.question,time:part.time} as IAudioQuestion;
                default:
                    throw new Error(`Unsupported question type: ${item.questionType}`);
            }
        });

        return {
            name: part.name,
            instruction: part.instruction,
            description: part.description,
            time: part.time,
            content: part.content,
            policies: {
                grade: part.policies.grade.map(policy => ({
                    questionType: policy.questionType,
                    weightage: policy.weightage
                }))
            },
            items: transformedItems
        } as unknown as AssessmentParts;
    });
};

assessmentRouter.post('/add-assessment', async (req, res) => {
    try {
        const type:string = req.body.assessment.type;
        const title:string = req.body.assessment.title;
        const assessment:CreateParts[] = req.body.assessment.parts;
        const time = req.body.assessment.time;
        const templateType = req.body.assessment.templateType;
        const newAssessment = new AssessmentBuilder();
        const id = await newAssessment.createAssessment(title, transformParts(assessment), type, time, templateType);
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


export const deleteParts = async (parts:mongoose.Schema.Types.ObjectId[],session:mongoose.mongo.ClientSession)=>{
    try {
        const allParts = await Parts.find({ _id: { $in: parts } });
        for (const part of allParts) {
            const questionIds = part.items.map(item => item.questionId);
            await AudioQuestion.deleteMany({ _id: { $in: questionIds } }).session(session);
            await FIB.deleteMany({ _id: { $in: questionIds } }).session(session);
            await MCQ.deleteMany({ _id: { $in: questionIds } }).session(session);
            await MTF.deleteMany({ _id: { $in: questionIds } }).session(session);
        }
        await Parts.deleteMany({ _id: { $in: parts } }).session(session);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

const deleteAssesssment = async (assessment:IAssessmentWithId) => {
    console.log(assessment)
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        await deleteParts(assessment.parts,session);
        await Assessment.findByIdAndDelete(assessment._id).session(session);
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

assessmentRouter.delete('/assessment/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid template ID' });
    }
    const assessment = await Assessment.findById(id);
    if (!assessment) {
        return res.status(200).json({message:"Assessment not found"});
    };
    try {
        // await deleteAssesssment(new mongoose.Types.ObjectId(id));
        await deleteAssesssment(assessment);
        res.status(200).json({ message: 'Assessment and all associated data deleted successfully' });
        // res.status(200).json(assessment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting template' });
    }
});


export default assessmentRouter;
