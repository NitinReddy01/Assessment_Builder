import AudioQuestion from "../models/AudioQuestion_Schema";
import { QuesitonType } from "../models/FIB_Schema";

export class AudioItem{
    private question:QuesitonType[];

    constructor(question:QuesitonType[]) {
        this.question = question;
    }

    async create(time:string){
        const audioQuestion = await AudioQuestion.create({
            question:this.question,
            type:"audio",
            time
        })
        return audioQuestion._id;
    }
}