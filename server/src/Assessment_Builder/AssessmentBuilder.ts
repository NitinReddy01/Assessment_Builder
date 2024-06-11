import mongoose from "mongoose";
import Assessment from "../models/Assessment_Schema";
import { IAudioQuestion } from "../models/AudioQuestion";
import { IFIB, QuesitonType } from "../models/FIB_Schema";
import { IMCQ } from "../models/MCQ_Schema";
import { IMTF } from "../models/MTF_Schema";
import Parts, { IParts } from "../models/TemplateParts_Schema";
import Template from "../models/Template_Schema";
import { AudioQuestionItem } from "./AudioQuestionItem";
import { FIBItem } from "./FIBItem";
import { MCQItem } from "./MCQItem";
import { MTFItem } from "./MTFItem";

export interface AssessmentParts{
    name:string;
    instruction:string;
    description:string;
    time:string;
    content:QuesitonType;
    policies:{
        grade:{
            questionType:string;
            weightage:string
        }[]
    };
    items:(IMCQ | IMTF | IFIB | IAudioQuestion)[]
}

export interface ITemplate{
    type:string,
    time:string,
    parts:IParts[]
}

export interface AssessmentTemplate{
    type:string,
    time:string,
    parts:AssessmentParts[]
}
export class AssessmentBuilder{

    // FIXME: need to handle duplicate of templates (type must be unique)
    async createTemplate(template:ITemplate){
        let partsId  = await Promise.all(template.parts.map(async (part)=>{
            const itemIds  = part.items.map(item=>{
                return {questionType:item.questionType};
            })
            console.log(part.policies);
            const newPart = await Parts.create({
                name:part.name,
                instruction:part.instruction,
                description:part.description,
                time:part.time,
                content:part.content,
                policies:part.policies,
                items:itemIds
            })
            return String(newPart._id)
        }))
        const temp = await Template.create({
            type:template.type,
            time:template.time,
            parts:partsId
        })
        return String(temp._id);
    }

    // FIXME: need to handle duplicate of assessments ( title must be unique )
    async createAssessment(title:string,assessment:AssessmentParts[],type:string,time:string,templateType:string){
            let partIds = await Promise.all(assessment.map(async (part)=>{
                const itemIds  = await Promise.all(part.items.map(async (item)=>{
                    if(item.questionType==="FIB") {
                        const newFib = new FIBItem(item.question,(item as IFIB ).answers ,item.time,item.questionType);
                        const id = await newFib.create();
                        return {questionType:item.questionType,questionId:id};
                    } 
                    else if(item.questionType === "MCQ") {
                        const newMcq = new MCQItem(item.question,((item as IMCQ ).options),(item as IMCQ).answers ,item.time,item.questionType)
                        const id = await newMcq.create();
                        return {questionType:item.questionType,questionId:id};
                    } else if(item.questionType === "MTF") {
                        let mtfItem = item as IMTF;
                        const newMTF = new MTFItem(mtfItem.question,mtfItem.leftOptions,mtfItem.rightOptions,mtfItem.answers,mtfItem.time,mtfItem.questionType);
                        const id = await newMTF.create();
                        return {questionType:item.questionType,questionId:id};
                    } else if(item.questionType === "AudioQuestion") {
                        const newAudio = new AudioQuestionItem(item.question,item.questionType,item.time);
                        const id = await newAudio.create();
                        return {questionType:item.questionType,questionId:id}
                    } else {
                        throw new Error("Invalid Question Type");
                    }
                }))
                const newPart = await Parts.create({
                    name:part.name,
                    instruction:part.instruction,
                    description:part.description,
                    time:part.time,
                    content:part.content,
                    policies:part.policies,
                    items:itemIds
                })
                return String(newPart._id) 
            }))
            const newAssessment = await Assessment.create({
                type,
                title,
                time,
                parts:partIds,
                templateType
            })
            return String(newAssessment._id);
    }
}