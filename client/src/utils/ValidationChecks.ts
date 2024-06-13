import { Template,Parts } from "../screens/CreateTemplate";


function isNumeric(value:string) {
    return /^-?\d+$/.test(value);
}

export function validateTimeInput(time:string){
    if(!time.trim()){
        return false
    }
    if(!time.endsWith('m')) return false;
    if(!isNumeric(time.slice(0,time.length-1))) return false;
    if(parseInt(time)==0) return false
    return true
}

export function getPartsTime(parts?:Parts[],templateTime?:string,newPartTime?:string){
        let TotalTime = 0;
        if(parts){
            for(let i of parts){
                if(i.time && validateTimeInput(i.time)){
                TotalTime += parseInt(i.time)
            }
        }
        if(templateTime!=null && newPartTime && TotalTime+parseInt(newPartTime) > parseInt(templateTime)){
            return false
        }
        return true;
    }
}

export function validatePartsTime(parts?:Parts[],templateTime?:number){
    let TotalTime = 0
    if(parts){
        for(let i of parts){
            if(i.time && validateTimeInput(i.time)){
            TotalTime += parseInt(i.time)
            }
            else{
                return false;
            }
        }
    }
    if(TotalTime === templateTime)
    return true;
    else{
        return false;
    }
}

export function TemplateTimeValidate(template:Template){
    if(template.time && validateTimeInput(template.time)){
        return true;
    }
    else return false;
}