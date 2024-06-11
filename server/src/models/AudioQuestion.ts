import mongoose from "mongoose";
import { QuesitonType } from "./FIB_Schema";

export interface IAudioQuestion{
    question:QuesitonType[];
    time:string;
    questionType:string;
}

const audioQuestionSchema = new mongoose.Schema<IAudioQuestion>({
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
    }
});

const AudioQuestion = mongoose.model<IAudioQuestion>("AudioQuestion",audioQuestionSchema);
export default AudioQuestion;