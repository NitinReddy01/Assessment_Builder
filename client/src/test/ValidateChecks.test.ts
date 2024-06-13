import {describe, expect, it} from 'vitest';
import { TemplateTimeValidate, isNumeric } from '../utils/ValidationChecks';
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

describe("Check IsNumeric Function",()=>{
    it("Should be true", ()=>{
        expect(isNumeric("20")).toBe(true)
        expect(isNumeric("2021")).toBe(true)
        expect(isNumeric("4232")).toBe(true)
        expect(isNumeric("1")).toBe(true)
    })
    it("Should be false", ()=>{
        expect(isNumeric("20m")).toBe(false)
        expect(isNumeric("2awf021")).toBe(false)
        expect(isNumeric("wwdd4awa232")).toBe(false)
        expect(isNumeric("awd1awd")).toBe(false)
    })
})