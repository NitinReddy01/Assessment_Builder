import mongoose from "mongoose";
import { QuesitonType } from "./FIB_Schema";

export interface IAudioQuestion{
    question:QuesitonType[];
    time:string;
    type:string;
}

const audioQuestionSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required:true,
        trim: true,
    }
});

const AudioQuestion = mongoose.model("AudioQuestion",audioQuestionSchema);
export default AudioQuestion;