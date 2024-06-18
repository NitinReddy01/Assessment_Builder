import { Schema, Types } from "mongoose";
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

export interface AssessmentParts {
    name: string;
    instruction: string;
    description: string;
    time: string;
    content: QuesitonType;
    policies: {
        grade: {
            questionType: string;
            weightage: string
        }[]
    };
    items: (IMCQ | IMTF | IFIB | IAudioQuestion)[]
}

export interface ITemplate {
    type: string,
    time: string,
    parts: IParts[]
}

export interface AssessmentTemplate {
    type: string,
    time: string,
    parts: AssessmentParts[]
}
export class AssessmentBuilder {

    // FIXME: need to handle duplicate of templates (type must be unique)


    async createTemplate(template: ITemplate) {
        let partsId = await Promise.all(template.parts.map(async (part) => {
            const itemIds = part.items.map(item => {
                return { questionType: item.questionType };
            })
            const newPart = await Parts.create({
                name: part.name,
                instruction: part.instruction,
                description: part.description,
                time: part.time,
                content: part.content,
                policies: part.policies,
                items: itemIds
            })
            return String(newPart._id)
        }))
        const temp = await Template.create({
            type: template.type,
            time: template.time,
            parts: partsId
        })
        return String(temp._id);
    }



    // 


    async updateTemplate(templateId: string, template: ITemplate) {
        try {
            // Find the template by ID
            const templateToUpdate = await Template.findById(templateId);
            if (!templateToUpdate) {
                throw new Error("Template not found");
            }

            // Process each part in the template
            const updatedParts = await Promise.all(template.parts.map(async (part: any) => {
                let partToUpdate;

                // Try to find the part by _id
                if (Types.ObjectId.isValid(part._id)) {
                    partToUpdate = await Parts.findOneAndUpdate(
                        { "_id": new Types.ObjectId(part._id) }, // Find by _id
                        {
                            $set: {
                                instruction: part.instruction,
                                name: part.name,
                                description: part.description,
                                time: part.time,
                                content: part.content,
                                policies: part.policies
                            }
                        },
                        { new: true, upsert: true } // Options: return the updated document, create if not found
                    );
                } else {
                    // Create a new part if _id is not valid
                    partToUpdate = await Parts.create({
                        instruction: part.instruction,
                        name: part.name,
                        description: part.description,
                        time: part.time,
                        content: part.content,
                        policies: part.policies
                    });
                }
             

                if (partToUpdate._id) {
                    return partToUpdate._id;
                } 
            }));

           
            // Update the template with the updatedParts array
            templateToUpdate.type = template.type;
            templateToUpdate.time = template.time;

            const existingPartsIds = templateToUpdate.parts.map(id => id.toString());
            // for (const partId of updatedParts) {
            //     const partIdString = partId!.toString();
            //     if (!existingPartsIds.includes(partIdString)) {
            //         templateToUpdate.parts.push(partId); 
            //     }
            // }

           
            await templateToUpdate.save();
            

            return String(templateToUpdate._id);
        } catch (error) {
            console.error("Error updating template:", error);           
            
        }
    }


    // 




    // FIXME: need to handle duplicate of assessments ( title must be unique )
    async createAssessment(title: string, assessment: AssessmentParts[], type: string, time: string, templateType: string) {
        let partIds = await Promise.all(assessment.map(async (part) => {
            const itemIds = await Promise.all(part.items.map(async (item) => {
                if (item.questionType === "FIB") {
                    const newFib = new FIBItem(item.question, (item as IFIB).answers, item.time, item.questionType, (item as IFIB).tag);
                    const id = await newFib.create();
                    return { questionType: item.questionType, questionId: id };
                }
                else if (item.questionType === "MCQ") {
                    const newMcq = new MCQItem(item.question, ((item as IMCQ).options), (item as IMCQ).answers, item.time, item.questionType, (item as IMCQ).tag)
                    const id = await newMcq.create();
                    return { questionType: item.questionType, questionId: id };
                } else if (item.questionType === "MTF") {
                    let mtfItem = item as IMTF;
                    const newMTF = new MTFItem(mtfItem.question, mtfItem.leftOptions, mtfItem.rightOptions, mtfItem.answers, mtfItem.time, mtfItem.questionType, mtfItem.tag);
                    const id = await newMTF.create();
                    return { questionType: item.questionType, questionId: id };
                } else if (item.questionType === "AudioQuestion") {
                    const newAudio = new AudioQuestionItem(item.question, item.questionType, item.time);
                    const id = await newAudio.create();
                    return { questionType: item.questionType, questionId: id }
                } else {
                    throw new Error("Invalid Question Type");
                }
            }))
            const newPart = await Parts.create({
                name: part.name,
                instruction: part.instruction,
                description: part.description,
                time: part.time,
                content: part.content,
                policies: part.policies,
                items: itemIds
            })
            return String(newPart._id)
        }))
        const newAssessment = await Assessment.create({
            type,
            title,
            time,
            parts: partIds,
            templateType
        })
        return String(newAssessment._id);
    }
}