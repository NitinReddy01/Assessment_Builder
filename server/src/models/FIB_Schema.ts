import mongoose, { Document } from "mongoose";

export interface QuesitonType{
    contentType:string;
    key:string;
}

export interface IFIB extends Document {
    question: QuesitonType[];
    answers: QuesitonType[];
    time: string;
    tag:string;
    type:string;
}

const fibSchema = new mongoose.Schema<IFIB>({
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
    },
    tag: {
        type: String,
        trim: true,
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

const FIB = mongoose.model<IFIB>("FIB", fibSchema);
export default FIB;
