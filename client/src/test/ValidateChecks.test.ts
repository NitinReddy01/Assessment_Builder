import {describe, expect, it, vi} from 'vitest';
import { TemplateTimeValidate } from '../utils/ValidationChecks';
import { Template,Parts } from '../screens/CreateTemplate';

const p1:Parts = {
    name:"part1",
    instruction: "instruction",
    description: "description",
    time: "10m",
    content: {
        contentType: "content",
        key: "ContentKey",
    },
    policies: {
        grade:[{
            questionType:"questionType",
            weightage:10
        }]
    },
    items: [{
        questionType: "Question",
    }]
}

const t:Template = {
    type:"sample",
    time:"10m",
    parts:[p1]
}

const t1:Template = {
    type:"sample",
    time:"10m",
    parts:[p1,p1]
}

describe("Check Timevalidate Function", () =>{
    it("Should be true", () =>{
        expect(TemplateTimeValidate(t)).toBe(true)
    })
    it("Should be false",()=>{
        expect(TemplateTimeValidate(t1)).toBe(false)
    })
})