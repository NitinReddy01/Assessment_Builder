export interface QuesitonType{
    contentType:string;
    key:string;
}

export interface FIB {
    question: QuesitonType[];
    answers: QuesitonType[];
    time: string;
    tag:string;
    type:string;
}

export interface MCQ {
    type:string;
    question: QuesitonType[];
    options: QuesitonType[];
    answers: QuesitonType[];
    time:string;
    tag?:string;
}

export interface MTF {
    question: QuesitonType[];
    leftOptions:QuesitonType[],
    rightOptions:QuesitonType[],
    answers: {
        leftAnswer: QuesitonType;
        rightAnswer: QuesitonType[];
    }[];
    time:string;
    tag?:string;
    type:string;
}

export interface AudioQuestion{
    question:QuesitonType[];
    time:string;
    type:string;
}

export type Question = FIB | MCQ | MTF | AudioQuestion;
