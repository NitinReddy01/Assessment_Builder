import mongoose from "mongoose";

export interface ITemplate{
    type:string;
    time:string;
    parts:Array<mongoose.Schema.Types.ObjectId>;
}

const templateSchema = new mongoose.Schema({
    type:{
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

const Template = mongoose.model<ITemplate>("Template", templateSchema);
export default Template;