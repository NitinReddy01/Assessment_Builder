import FIB, { QuesitonType } from "../models/FIB_Schema";

export class FIBItem{
    private question: QuesitonType[];
    private answers: QuesitonType[];
    private time: string;
    private tag?:string;
    private type:string;

    constructor(question:QuesitonType[],answers:QuesitonType[],time:string,type:string,tag?:string){
        this.question = question;
        this.answers = answers;
        this.time = time;
        this.type = type;
        if(tag) {
            this.tag = tag;
        }
    }

    async create(){
        const fib = await FIB.create({
            question:this.question,
            answers:this.answers,
            time:this.time,
            type:this.type,
            tag:this.tag??""
        })
        return String(fib._id);
    }

    evaluate(studentAnswer:QuesitonType[],weightage:string){
        const weight = Number(weightage);
        if (isNaN(weight)) {
            throw new Error("Invalid weightage value");
        }
        for (const ans of this.answers) {
            if (ans.contentType === "string") {
                const matchingAnswer = studentAnswer.find(studAns => studAns.contentType === "string" && studAns.key === ans.key);
                if (!matchingAnswer) {
                    return 0;
                }
            }
        }
        return weight;
    }

}