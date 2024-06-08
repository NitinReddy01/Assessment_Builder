import { QuesitonType } from "../models/FIB_Schema";
import MTF from "../models/MTF_Schema";

export class MTFItem {
    private question: QuesitonType[];
    private leftOptions: QuesitonType[];
    private rightOptions: QuesitonType[];
    private answers: {
        leftAnswer: QuesitonType;
        rightAnswer: QuesitonType[];
    }[];
    private time: string;
    private type:string;
    private tag?: string;

    constructor(
        question: QuesitonType[],
        leftOptions: QuesitonType[],
        rightOptions: QuesitonType[],
        answers: { leftAnswer: QuesitonType; rightAnswer: QuesitonType[] }[],
        time: string,
        type:string,
        tag?: string
    ) {
        this.question = question;
        this.leftOptions = leftOptions;
        this.rightOptions = rightOptions;
        this.answers = answers;
        this.time = time;
        this.type = type;
        this.tag = tag ?? "";
    }
    async create() {
        const mtf = await MTF.create({
            question: this.question,
            leftOptions: this.leftOptions,
            rightOptions: this.rightOptions,
            answers: this.answers,
            time: this.time,
            tag: this.tag ?? ""
        });
        return String(mtf._id);
    }
    evaluate(studentAnswers: { leftAnswer: QuesitonType; rightAnswer: QuesitonType[] }[], weightage: string): number {
        const weight = Number(weightage);
        if (isNaN(weight)) {
            throw new Error("Invalid weightage value");
        }
    
        for (const ans of this.answers) {
            if (ans.leftAnswer.contentType === "string") {
                const matchingAnswer = studentAnswers.find(studAns => 
                    studAns.leftAnswer.contentType === "string" &&
                    studAns.leftAnswer.key === ans.leftAnswer.key &&
                    ans.rightAnswer.every(rightAns => 
                        studAns.rightAnswer.some(studentRightAns => 
                            studentRightAns.contentType === "string" && 
                            studentRightAns.key === rightAns.key
                        )
                    )
                );
                if (!matchingAnswer) {
                    return 0;
                }
            }
        }
    
        return weight;
    }    
}
