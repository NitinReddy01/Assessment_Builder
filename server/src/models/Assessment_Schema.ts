import mongoose from "mongoose";

export interface IAsessment{
    type:string;
    title:string;
    time:string;
    parts:Array<mongoose.Schema.Types.ObjectId>;
    templateType:string;
    month:number;
    week:number;
    bucket:string;
    Class:number;
}

const assessmentSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true,
        trim:true
    },
    Class:{
        type:Number,
        required:true,
        trim:true
    },

    title:{
        type:String,
        required:true,
        trim:true
    },
    templateType:{
        type:String,
        trim:true,
        default:"-"
    },
    time:{
        type:String,
        required:true,
        trim:true
    },
    bucket:{
        type:String,
        required:false,
        trim:true
    },
    month:{
        type:Number,
        required:false,
        trim:true
    },
    week:{
        type:Number,
        required:false,
        trim:true
    },
    parts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Parts",
        default:[]   
    }]
})

const Assessment = mongoose.model<IAsessment>("Assessment", assessmentSchema);
export default Assessment;