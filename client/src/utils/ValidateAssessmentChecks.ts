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
            for(let fibAnswers of item.fibAnswers!){
                if(fibAnswers.key.trim()==="") return 0
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
    if(!item.tag.trim()) return false; // put this in CreateAssessment file
    if(!item.question[0].key.trim()) return false;
    if(!item.leftOptions?.length || !item.rightOptions?.length) return false
    if(!item.mtfAnswers) return false;
    for(let mtfs of item.mtfAnswers){
        if(!mtfs.leftAnswer!.key.trim() || !mtfs.rightAnswer!.key.trim()) return false
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
        for(let part of assessment.parts){
            for(let item of part.items){
                let curItem:Item = item
                if(item.questionType=="FIB") if(!ValidateFIB(curItem)) return false 
                if(item.questionType === "MTF") if(!ValidateMTF(curItem)) return false;
                if(item.questionType === "MCQ" ) if(!ValidateMCQ(curItem)) return false;
            }
        }
    }
    return true;
}