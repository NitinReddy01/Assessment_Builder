import {CreateAssessment, Answer} from "../components/AssessmentForm";

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
export function ValidateFIB(item:Item){
    if(!item.tag.trim()) return false; // put this in CreateAssessment file
    if(!item.question) return false;
    if(!item.fibAnswers) return false
    if(!item.question[0].key.trim()) return false
    if(item.question[0].key){
        const FIBCount = (item.question[0].key.match(/__/g)||[]).length
        const getValidFIBs= ()=>{
            for(let i of item.fibAnswers!){
                if(i.key.trim()==="") return 0
            }
            return item.fibAnswers!.length
        }
        const validateFIBAnswers = getValidFIBs()
        if(!validateFIBAnswers) return false
        if(FIBCount != validateFIBAnswers) return false;
    }
    return true;
}

export function ValidateMTF(item:Item){
    if(!item.tag) return false; // put this in CreateAssessment file
    if(!item.question) return false;
    if(!item.leftOptions?.length || !item.rightOptions?.length) return false
    if(!item.mtfAnswers) return false;
    for(let i of item.mtfAnswers){
        if(!i.leftAnswer!.key.trim() || !i.rightAnswer!.key.trim()) return false
    }
    if(item.leftOptions.length != item.mtfAnswers.length) return false
    return true;
}

export function ValidateMCQ(item:Item){
    if(!item.tag.trim()) return false; // put this in CreateAssessment file
    if(!item.question) return false
    if(!item.question[0].key.trim()) return false
    if(!item.options) return false
    let k = item.options.every(i => i.key.value) && item.options.some(i => i.key.isAnswer);
    return k;
}

export function ValidateAssessmentItems(assessment:CreateAssessment){
    if(assessment.parts){
        for(let i of assessment.parts){
            for(let j of i.items){
                let jItem:Item = j
                if(j.questionType=="FIB") if(!ValidateFIB(jItem)) return false 
                if(j.questionType === "MTF") if(!ValidateMTF(jItem)) return false;
                if(j.questionType === "MCQ" ) if(!ValidateMCQ(jItem)) return false;
            }
        }
    }
    return true;
}