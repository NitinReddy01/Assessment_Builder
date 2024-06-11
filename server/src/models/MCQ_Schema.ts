import mongoose, { Document } from "mongoose";
import { QuesitonType } from "./FIB_Schema";

export interface IMCQ extends Document {
    questionType:string;
    question: QuesitonType[];
    options: QuesitonType[];
    answers: QuesitonType[];
    time:string;
    tag?:string;
}


const mcqSchema = new mongoose.Schema<IMCQ>({
    question: {
        type:[{
        contentType:{
            type:String,
            required:true
        },
        key:{
            type:String,
            required:true
        }
        }],
        default:[]
    },
    time: {
        type: String,
        trim: true,
    },
    questionType: {
        type: String,
        required:true,
        trim: true,
    },
    tag: {
        type: String,
        trim: true,
    },
    options: {
        type:[{
        contentType:{
            type:String,
            required:true
        },
        key:{
            type:String,
            required:true
        }
        }],
        default:[]
    },
    answers: {
        type:[{
        contentType:{
            type:String,
            required:true
        },
        key:{
            type:String,
            required:true
        }
        }],
        default:[]
    },
});

const MCQ = mongoose.model<IMCQ>("MCQ", mcqSchema);
export default MCQ;
