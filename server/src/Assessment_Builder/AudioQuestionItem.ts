import AudioQuestion from "../models/AudioQuestion";
import { QuesitonType } from "../models/FIB_Schema";

export class AudioQuestionItem{
    private question:QuesitonType[];
    private type:string;
    private time:string;

    constructor(question:QuesitonType[],type:string,time:string){
        this.question = question;
        this.type = type;
        this.time = time;
    }

    async create(){
        const audioQuestion = await AudioQuestion.create({
            question:this.question,
            type:this.type,
            time:this.time,
        })
        return String(audioQuestion._id);
    }

    // TODO: need to add evaluate function later for evaluation audio assessments
}