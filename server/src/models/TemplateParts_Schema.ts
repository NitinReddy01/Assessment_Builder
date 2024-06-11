import mongoose, { Document } from "mongoose";
import { QuesitonType } from "./FIB_Schema";

export interface IParts extends Document {
    name:string
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
    items:Array<mongoose.Schema.Types.ObjectId>
}

const partsSchema = new mongoose.Schema({
    instruction:{
        type:String,
        required:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    time:{
        type:String,
        required:true,
        trim:true
    },
    content: {
        type:{
        contentType:{
            type:String,
            required:true
        },
        key:{
            type:String,
            required:false
        }
        },
    },
    policies:{
        grade:[{
            questionType:{
                type:String
            },
            weightage:{
                type:String,
            }
        }]
    },
    items:[{
        questionType: {
            type: String,
            required: true,
            enum: ["FIB", "MCQ", "MTF","AudioQuestion"],
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "items.questionType",
        },
    }]

})

const Parts = mongoose.model<IParts>("Parts", partsSchema);
export default Parts;