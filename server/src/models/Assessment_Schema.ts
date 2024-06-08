import mongoose from "mongoose";

export interface IAsessment{
    type:string;
    title:string;
    time:string;
    parts:Array<mongoose.Schema.Types.ObjectId>;
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