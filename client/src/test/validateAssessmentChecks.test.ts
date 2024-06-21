import { describe,it,expect } from "vitest";
import { Answer} from "../components/AssessmentForm";
import { ValidateFIB } from "../utils/ValidateAssessmentChecks";

interface Item {
    questionType: string;
    tag: string;
    question: Answer[];
    fibAnswers?: Answer[];
    options?: {
      contentType: string;
      key: {
        value: string;
        isAnswer: boolean;
      };
    }[];
    leftOptions?: Answer[];
    rightOptions?: Answer[];
    mtfAnswers?: {
      leftAnswer?: Answer;
      rightAnswer?: Answer;
    }[]
}

const FIBQ1 : Answer = {
    contentType:"FIB",
    key:"1+1 __"
}

const FIBA1 : Answer = {
    contentType:"FIB",
    key:"2"
}

const fib1 : Item = {
    questionType:"FIB",
    tag:"1",
    question:[FIBQ1],
    fibAnswers:[FIBA1]
}
//
const FIBQ2 : Answer = {
    contentType:"FIB",
    key:"1+1 __ __"
}

const FIBA2 : Answer = {
    contentType:"FIB",
    key:"2"
}

const fib2 : Item = {
    questionType:"FIB",
    tag:"1",
    question:[FIBQ2],
    fibAnswers:[FIBA2]
}

const FIBQ3 : Answer = {
    contentType:"FIB",
    key:"1+1 __ __"
}

const FIBA3 : Answer = {
    contentType:"FIB",
    key:"  " //false
}

const fib3 : Item = {
    questionType:"FIB",
    tag:"1",
    question:[FIBQ3],
    fibAnswers:[FIBA3]
}

const FIBQ4 : Answer = {
    contentType:"FIB",
    key:"1+1 __ __"
}

const FIBA4 : Answer = {
    contentType:"FIB",
    key:"2"
}

const FIBA42 : Answer = {
    contentType:"FIB",
    key:"2"
}

const fib4 : Item = {
    questionType:"FIB",
    tag:"1",
    question:[FIBQ4],
    fibAnswers:[FIBA4,FIBA42]
}


describe("Check FIB", ()=>{
    it("should be true",()=>{
        expect(ValidateFIB(fib1)).toBe(true)
        expect(ValidateFIB(fib2)).toBe(false)
        expect(ValidateFIB(fib3)).toBe(false)
        expect(ValidateFIB(fib4)).toBe(true)
    })
})