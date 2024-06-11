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

export interface Parts{
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
    items:{questionType:string,questionId:mongoose.Schema.Types.ObjectId}[]
}

export interface ITemplate{
    type:string,
    time:string,
    parts:Parts[]
}

export interface AssessmentTemplate{
    type:string,
    time:string,
    parts:AssessmentParts[]
}

export interface PopulatedTemplate {
    type:string,
    time:string,
    parts:IParts[];
}

export class AssessmentBuilder{
    // private template:PopulatedTemplate | null = null;

    //  constructor(templateId?:string){
    //     if(templateId) {
    //         Template.findById(templateId).populate<{"parts":IParts[]}>("parts").then(template=>{
    //             if(template) {
    //                 this.template = template;
    //                 console.log(template);
    //             }
    //         }).catch(err=>{
    //             console.log(err);
    //         });
    //     }
    // }

    async createTemplate(template:ITemplate){
        let partsId  = await Promise.all(template.parts.map(async (part)=>{
            const itemIds  = part.items.map(item=>{
                return {questionType:item.questionType};
            })
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

    async createAssessment(title:string,assessment:AssessmentTemplate,type:string,time:string){
            let partIds = await Promise.all(assessment.parts.map(async (part)=>{
                const itemIds  = await Promise.all(part.items.map(async (item)=>{
                    if(item.type==="FIB") {
                        const newFib = new FIBItem(item.question,(item as IFIB ).answers ,item.time,item.type);
                        const id = await newFib.create();
                        return {questionType:item.type,questionId:id};
                    } else if(item.type === "MCQ") {
                        const newMcq = new MCQItem(item.question,((item as IMCQ ).options),(item as IMCQ).answers ,item.time,item.type)
                        const id = await newMcq.create();
                        return {questionType:item.type,questionId:id};
                    } else if(item.type === "MTF") {
                        let mtfItem = item as IMTF;
                        const newMTF = new MTFItem(mtfItem.question,mtfItem.leftOptions,mtfItem.rightOptions,mtfItem.answers,mtfItem.time,mtfItem.type);
                        const id = await newMTF.create();
                        return {questionType:item.type,questionId:id};
                    } else if(item.type === "AudioQuestion") {
                        const newAudio = new AudioQuestionItem(item.question,item.type,item.time);
                        const id = await newAudio.create();
                        return {questionType:item.type,questionId:id}
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
                parts:partIds
            })
            return String(newAssessment._id);
    }
}