import mongoose from "mongoose";

export interface IAsessment{
    type:string;
    title:string;
    time:string;
    parts:Array<mongoose.Schema.Types.ObjectId>;
    templateType:string;
}

const assessmentSchema = new mongoose.Schema({
    type:{
        type:String,
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
    parts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Parts",
        default:[]   
    }]
})

const Assessment = mongoose.model<IAsessment>("Assessment", assessmentSchema);
export default Assessment;