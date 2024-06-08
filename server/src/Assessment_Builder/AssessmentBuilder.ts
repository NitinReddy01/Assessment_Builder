import mongoose from "mongoose";
import { QuesitonType } from "../models/FIB_Schema";
import Parts from "../models/TemplateParts_Schema";
import Template from "../models/Template_Schema";

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
}

export interface Template{
    type:string,
    time:string,
    parts:Parts[]
}

export class AssessmentBuilder{
    private template:Template | null;

    constructor(template?:Template){
        this.template = template??null;
    }

    async createTemplate(template:Template){
        let partsId  = await Promise.all(template.parts.map(async (part)=>{
            const newPart = await Parts.create({
                name:part.name,
                instruction:part.instruction,
                description:part.description,
                time:part.time,
                content:part.content,
                policies:part.policies
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

}