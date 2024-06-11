import React, { useState } from "react";
import {
  Question,
  FIB,
  MCQ,
  MTF,
  AudioQuestion,
} from "../components/Questions";
import { AssessmentParts } from "../screens/CreateAssessment";
import InputField from "./InputField";
import deleteIcon from "../assets/icons/deleteIcon.svg";

interface AssessmentFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  parts: AssessmentParts[];
  setParts: React.Dispatch<React.SetStateAction<AssessmentParts[]>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}

const AssessmentForm = ({
  title,
  setTitle,
  parts,
  setParts,
  time,
  setTime,
  type,
  setType,
}: AssessmentFormProps) => {
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [currentPart, setCurrentPart] = useState<AssessmentParts>(
    parts[0] || []
  );

  const handlePartChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    partIndex: number
  ) => {
    const { name, value } = e.target;
    setParts((prev) => {
      const updatedParts = [...prev];
      const updatedPart = { ...updatedParts[partIndex], [name]: value };
      updatedParts[partIndex] = updatedPart;
      return updatedParts;
    });
  };

  //   const handleQuestionChange = (newQuestion: Question) => {
  //     const updatedParts = [...parts];
  //     updatedParts[selectedPartIndex].items.question = newQuestion;
  //     setParts(updatedParts);
  //   };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Assessment</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
          Type:
        </label>
        <input
          type="text"
          id="type"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="time" className="block text-gray-700 font-bold mb-2">
          Time Limit (minutes):
        </label>
        <input
          type="number"
          id="time"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold">Parts</h3>
        <ul className="list-disc ml-4">
          {parts.map((part, partIndex) => (
            <div className="mb-4 border border-neutral-200 p-4">
              <InputField
                label="Part Name"
                name="name"
                value={part.name}
                onChange={(e) => handlePartChange(e, partIndex)}
              />
              <InputField
                label="Instruction"
                name="instruction"
                value={part.instruction}
                onChange={(e) => handlePartChange(e, partIndex)}
              />
              <InputField
                label="Description"
                name="description"
                value={part.description}
                onChange={(e) => handlePartChange(e, partIndex)}
              />
              <InputField
                label="Time"
                name="time"
                value={part.time}
                onChange={(e) => handlePartChange(e, partIndex)}
              />
              Items:
              {part.items.map((item, questionIndex) =>
                item.questionType === "FIB" ? (
                  <>
                    <div className="flex justify-between">
                      <p className="font-bold">{`Question ${
                        questionIndex + 1
                      } - Fill In The Blanks `}</p>
                      <div className="flex gap-2">
                        <img
                          className="p-2 cursor-pointer bg-neutral-300 rounded-full "
                          src={deleteIcon}
                          alt="deleteIcon"
                          //   onClick={() => {
                          //     deleteQuestion(questionIndex);
                          //   }}
                        ></img>
                      </div>
                    </div>
                  </>
                ) : null
              )}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center text-base  border-2 border-dashed border-primary-500 rounded-lg py-2 bg-primary-200 cursor-pointer">
                  + MCQ
                </div>
                <div className="text-center text-base  border-2 border-dashed border-primary-500 rounded-lg py-2 bg-primary-200 cursor-pointer">
                  + Fill in the Blanks
                </div>
                <div className="text-center text-base  border-2 border-dashed border-primary-500 rounded-lg py-2 bg-primary-200 cursor-pointer">
                  + Match the following
                </div>
                <div className="text-center text-base  border-2 border-dashed border-primary-500 rounded-lg py-2 bg-primary-200 cursor-pointer">
                  + Audio Question
                </div>
              </div>
            </div>
          ))}
                                          <div
                                    className="text-center text-base  border-2 border-dashed border-primary-500 rounded-lg py-2 bg-primary-200 cursor-pointer"
                                    
                                >
                                    + Add Part
                                </div>
        </ul>
      </div>
    </div>
  );
};

export default AssessmentForm;
