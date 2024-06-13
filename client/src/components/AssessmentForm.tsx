import React, { ChangeEvent, useEffect, useState } from "react";
import { AssessmentParts } from "../screens/CreateAssessment";
import InputField from "./InputField";
import ToggleButton from "./buttons/ToggleButton";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { validateTimeInput, validatePartsTime } from "../utils/ValidationChecks";

interface AssessmentFormProps {
  template: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  parts: AssessmentParts[];
  setParts: React.Dispatch<React.SetStateAction<AssessmentParts[]>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}

interface Answer {
  contentType: string;
  key: string;
}
interface CreateParts {
  name: string;
  instruction: string;
  description: string;
  time: string;
  content: Answer;
  policies: {
    grade: {
      questionType: string;
      weightage: number;
    }[];
  };
  items: {
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
    }[];
  }[];
}
interface CreateAssessment {
  title: string;
  templateType: string;
  type: string;
  time: string;
  parts?: CreateParts[];
}

const AssessmentForm = ({
  template,
  title,
  parts,
  setParts,
  time,
  type,
}: AssessmentFormProps) => {

  const navigate = useNavigate();

  const handlePartChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    partIndex: number
  ) => {
    const { name, value } = e.target;
    setParts((prev) => {
      const updatedParts = [...prev];
      const updatedPart = name === 'content' 
        ? { 
            ...updatedParts[partIndex], 
            content: {
              ...updatedParts[partIndex].content,
              key: value
            }
          }
        : { 
            ...updatedParts[partIndex], 
            [name]: value 
          };
      updatedParts[partIndex] = updatedPart;
      return updatedParts;
    });
  };
  function handleQuestionChange(
    e: ChangeEvent<HTMLInputElement>,
    partIndex: number,
    questionIndex: number
  ) {
    setAssessments((prev) => {
      let updatedAssessment = { ...prev };
      updatedAssessment.parts![partIndex].items[questionIndex].question[0].key =
        e.target.value;
      return updatedAssessment;
    });
  }

  function handleFIBQuestionChange(
    e: ChangeEvent<HTMLInputElement>,
    partIndex: number,
    questionIndex: number
  ) {
    const matches = e.target.value.match(/__/g);
    const blanksCount = matches ? matches.length : 0;

    setAssessments((prev) => {
      let updatedAssessment = { ...prev };
      updatedAssessment.parts![partIndex].items[questionIndex].question[0].key =
        e.target.value;
      updatedAssessment.parts![partIndex].items[questionIndex].fibAnswers =
        Array.from({ length: blanksCount }, () => ({
          contentType: "text",
          key: "",
        }));
      return updatedAssessment;
    });
  }
  function handleFIBAnswersChange(
    e: ChangeEvent<HTMLInputElement>,
    partIndex: number,
    questionIndex: number,
    answerIndex?: number
  ) {
    setAssessments((prev) => {
      let updatedAssessment = { ...prev };
      updatedAssessment.parts![partIndex].items[questionIndex].fibAnswers![
        answerIndex!
      ].key = e.target.value;
      return updatedAssessment;
    });
  }

  function addMCQOption(partIndex: number, questionIndex: number) {
    setAssessments((prev) => {
      const updatedAssessment = { ...prev };
      const currentOptions =
        updatedAssessment.parts![partIndex].items[questionIndex].options || [];
      updatedAssessment.parts![partIndex].items[questionIndex].options = [
        ...currentOptions,
        { contentType: "text", key: { value: "", isAnswer: false } },
      ];
      return updatedAssessment;
    });
  }

  function handleMCQOptionChange(
    e: ChangeEvent<HTMLInputElement>,
    partIndex: number,
    questionIndex: number,
    optionIndex: number
  ) {
    setAssessments((prev) => {
      const updatedAssessment = { ...prev };
      updatedAssessment.parts![partIndex].items[questionIndex].options![
        optionIndex
      ].key.value = e.target.value;
      return updatedAssessment;
    });
  }

  function removeMCQOption(
    partIndex: number,
    questionIndex: number,
    optionIndex: number
  ) {
    setAssessments((prev) => {
      const updatedAssessment = { ...prev };
      const options =
        updatedAssessment.parts![partIndex].items[questionIndex].options || [];
      updatedAssessment.parts![partIndex].items[questionIndex].options =
        options.filter((_, idx) => idx !== optionIndex);
      return updatedAssessment;
    });
  }

  function handleMCQAnswers(
    partIndex: number,
    questionIndex: number,
    optionIndex: number,
    add: boolean
  ) {
    setAssessments((prev) => {
      const updatedAssessment = { ...prev };
      updatedAssessment.parts![partIndex].items[questionIndex].options![
        optionIndex
      ].key.isAnswer = add;
      return updatedAssessment;
    });
  }

  function addMTFOptions(partIndex: number, questionIndex: number) {
    setAssessments((prev) => {
      const updatedAssessment = { ...prev };
      updatedAssessment.parts![partIndex].items![
        questionIndex
      ].leftOptions!.push({ contentType: "text", key: "" });
      updatedAssessment.parts![partIndex].items![
        questionIndex
      ].rightOptions!.push({ contentType: "text", key: "" });
      updatedAssessment.parts![partIndex].items![
        questionIndex
      ].mtfAnswers!.push({
        leftAnswer: { contentType: "text", key: "" },
        rightAnswer: { contentType: "text", key: "" },
      });
      return updatedAssessment;
    });
  }

  function handleMTFOptionsChange(
    e: ChangeEvent<HTMLInputElement>,
    partIndex: number,
    questionIndex: number,
    optionIndex: number,
    left: boolean
  ) {
    if (left) {
      setAssessments((prev) => {
        const updatedAssessment = { ...prev };
        updatedAssessment.parts![partIndex].items![questionIndex].leftOptions![
          optionIndex
        ].key = e.target.value;
        return updatedAssessment;
      });
    } else {
      setAssessments((prev) => {
        const updatedAssessment = { ...prev };
        updatedAssessment.parts![partIndex].items![questionIndex].rightOptions![
          optionIndex
        ].key = e.target.value;
        return updatedAssessment;
      });
    }
  }

  function handleMTFAnswers(
    e: ChangeEvent<HTMLSelectElement>,
    partIndex: number,
    questionIndex: number,
    leftOptionIndex: number,
    leftOption: string
  ) {
    setAssessments((prev) => {
      const updatedAssessment = { ...prev };
      updatedAssessment.parts![partIndex].items![questionIndex].mtfAnswers![
        leftOptionIndex
      ].rightAnswer! = { contentType: "text", key: e.target.value };
      updatedAssessment.parts![partIndex].items![questionIndex].mtfAnswers![
        leftOptionIndex
      ].leftAnswer! = { contentType: "text", key: leftOption };
      return updatedAssessment;
    });
  }

  const [assessment, setAssessments] = useState<CreateAssessment>({
    templateType: template,
    title,
    type,
    time,
  });

  useEffect(() => {
    const partsAssessments: CreateParts[] = parts.map((part) => ({
      name: part.name,
      instruction: part.instruction,
      description: part.description,
      time: part.time,
      content: part.content,
      policies: part.policies,
      items: part.items.map((item) => {
        const baseItem = {
          questionType: item.questionType,
          tag: "",
          question: [{ contentType: "text", key: "" }],
        };

        switch (item.questionType) {
          case "FIB":
            return {
              ...baseItem,
              fibAnswers: [],
            };
          case "MCQ":
            return {
              ...baseItem,
              options: [],
            };
          case "MTF":
            return {
              ...baseItem,
              leftOptions: [],
              rightOptions: [],
              mtfAnswers: [],
            };
          case "AudioQuestion":
            return baseItem;
          default:
            return baseItem;
        }
      }),
    }));
    setAssessments((prev) => {
      let updatedAssessment = { ...prev };
      updatedAssessment.parts = partsAssessments;
      return updatedAssessment;
    });
  }, [parts]);

  const handleTagChange = (
    e: ChangeEvent<HTMLInputElement>,
    partIndex: number,
    questionIndex: number
  ) => {
    setAssessments((prev) => {
      let updatedAssessment = { ...prev };
      updatedAssessment.parts![partIndex].items[questionIndex].tag =
        e.target.value;
      return updatedAssessment;
    });
  };

  const handleSubmit = async () => {
    if(!assessment.title.trim()){
      alert("Enter Assessment Title")
      return
    }
    if(!assessment.type.trim()){
      alert("Enter Assessment Type")
      return
    }
    if(!assessment.time.trim()){
      alert("Enter Assessment time Duration")
      return;
    }
    if(!validateTimeInput(assessment.time)){
      alert("Enter valid assessment Time Duraion")
      return
    }
    if(!validatePartsTime(assessment.parts,parseInt(assessment.time))){
      alert("Part Duration and Assessment Duration must be Equal")
      return
    }
    try {
      await axios.post("/add-assessment", { assessment });
      alert("Assessment Created");
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 z-10 mb-16">
        <h2 className="text-2xl font-bold mb-4">Create Assessment</h2>
        <div className="mb-4">
          <InputField
            label="Title"
            name="title"
            value={assessment.title}
            onChange={(e) =>
              setAssessments((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <InputField
            label="Type"
            name="type"
            value={assessment.type}
            onChange={(e) =>
              setAssessments((prev) => ({ ...prev, type: e.target.value }))
            }
          />
          <InputField
            label="Time Limit (minutes)"
            name="time"
            value={assessment.time}
            onChange={(e) =>
              setAssessments((prev) => ({ ...prev, time: e.target.value }))
            }
          />
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold">Parts</h3>
          <ul className="list-disc mt-2">
            {assessment.parts &&
              assessment.parts!.map((part, partIndex) => (
                <div
                  key={partIndex}
                  className="mb-4 border border-neutral-200 p-4 rounded-lg"
                >
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
                  {part.content.contentType === "text" ? (
                    <InputField
                      label="Paragraph"
                      name="content"
                      value={part.content.key}
                      onChange={(e) => handlePartChange(e, partIndex)}
                    />
                  ) : null}
                  <div>Items:</div>
                  {part.items.map((item, questionIndex) => {
                    switch (item.questionType) {
                      case "AudioQuestion":
                        return (
                          <>
                            
                            <InputField
                              label={`Audio Question `}
                              name={"Audio Question"}
                              value={item.question[0].key}
                              onChange={(e) =>
                                handleQuestionChange(
                                  e,
                                  partIndex,
                                  questionIndex
                                )
                              }
                            />
                          </>
                        );
                      case "MCQ":
                        return (
                          <div key={questionIndex}>
                            <div className="flex justify-between">
                              <p className="font-bold">{`Question ${
                                questionIndex + 1
                              } - MCQ  `}</p>
                            </div>
                            <InputField
                              label={`Enter MCQ Question`}
                              name={"MCQ Question"}
                              value={item.question[0].key}
                              onChange={(e) =>
                                handleQuestionChange(
                                  e,
                                  partIndex,
                                  questionIndex
                                )
                              }
                            />
                            <InputField
                              label="Question Tag"
                              name="question tag"
                              value={item.tag}
                              onChange={(e) =>
                                handleTagChange(e, partIndex, questionIndex)
                              }
                            />
                            <div>
                              {item.options &&
                                item.options!.map((option, optionIndex) => {
                                  return (
                                    <div
                                      key={optionIndex}
                                      className="flex justify-between items-center rounded-lg bg-neutral-300 mb-3"
                                    >
                                      <div className="mb-3">
                                        <input
                                          type="text"
                                          value={option.key.value}
                                          placeholder={`Option ${
                                            optionIndex + 1
                                          }`}
                                          onChange={(e) =>
                                            handleMCQOptionChange(
                                              e,
                                              partIndex,
                                              questionIndex,
                                              optionIndex
                                            )
                                          }
                                          className="px-2 pt-2 w-full rounded-lg bg-inherit outline-none"
                                        />
                                      </div>
                                      <div className="flex mr-4">
                                        <ToggleButton
                                          checked={option.key.isAnswer}
                                          handleToggle={(checked: boolean) => {
                                            handleMCQAnswers(
                                              partIndex,
                                              questionIndex,
                                              optionIndex,
                                              checked
                                            );
                                          }}
                                          label="Mark as correct answer"
                                        />
                                        <div
                                          className="cursor-pointer pt-1"
                                          onClick={() => {
                                            removeMCQOption(
                                              partIndex,
                                              questionIndex,
                                              optionIndex
                                            );
                                          }}
                                        >
                                          X
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              <div className="w-36 h-14">
                                <button
                                  className="bg-primary-500 p-2 font-semibold text-neutral-100 rounded-xl"
                                  onClick={() =>
                                    addMCQOption(partIndex, questionIndex)
                                  }
                                >
                                  + Add Option
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      case "MTF":
                        return (
                          <div key={questionIndex}>
                            <>
                              <div className="flex justify-between">
                                <p className="font-bold">{`Question ${
                                  questionIndex + 1
                                } - Match the Following `}</p>
                              </div>
                              <InputField
                                label={"Enter MTF Question"}
                                name={"mtfQuestion"}
                                value={item.question[0].key}
                                onChange={(e) => {
                                  handleQuestionChange(
                                    e,
                                    partIndex,
                                    questionIndex
                                  );
                                }}
                              />
                              <InputField
                                label="Question Tag"
                                name="question tag"
                                value={item.tag}
                                onChange={(e) =>
                                  handleTagChange(e, partIndex, questionIndex)
                                }
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  Add Options (Column 1 )
                                  {item.leftOptions &&
                                    item.leftOptions!.map(
                                      (leftOption, leftOptionIndex) => {
                                        return (
                                          <div
                                            key={leftOptionIndex}
                                            className="rounded-lg bg-neutral-300 mb-3"
                                          >
                                            <input
                                              type="text"
                                              value={leftOption.key}
                                              placeholder={`Option ${
                                                leftOptionIndex + 1
                                              }`}
                                              className="outline-none  w-full p-2 bg-inherit"
                                              onChange={(e) => {
                                                handleMTFOptionsChange(
                                                  e,
                                                  partIndex,
                                                  questionIndex,
                                                  leftOptionIndex,
                                                  true
                                                );
                                              }}
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                                <div>
                                  Add Options (Column 2)
                                  {item.rightOptions &&
                                    item.rightOptions!.map(
                                      (rightOption, rightOptionIndex) => {
                                        return (
                                          <div
                                            key={rightOptionIndex}
                                            className="rounded-lg bg-neutral-300 mb-3"
                                          >
                                            <input
                                              type="text"
                                              value={rightOption.key}
                                              placeholder={`Option ${
                                                rightOptionIndex + 1
                                              }`}
                                              className="outline-none w-full p-2 bg-inherit"
                                              onChange={(e) => {
                                                handleMTFOptionsChange(
                                                  e,
                                                  partIndex,
                                                  questionIndex,
                                                  rightOptionIndex,
                                                  false
                                                );
                                              }}
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              </div>
                              <div className="w-36 h-14">
                                <button
                                  className="bg-primary-500 p-2 font-semibold text-neutral-100 rounded-xl"
                                  onClick={() =>
                                    addMTFOptions(partIndex, questionIndex)
                                  }
                                >
                                  + Add Option
                                </button>
                              </div>
                              Correct Relationship
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  {item.leftOptions!.map(
                                    (leftOption, leftOptionIndex) => {
                                      return (
                                        <div
                                          key={leftOptionIndex}
                                          className="rounded-lg bg-neutral-300 mb-3"
                                        >
                                          <input
                                            type="text"
                                            value={leftOption.key}
                                            placeholder={`Option ${
                                              leftOptionIndex + 1
                                            }`}
                                            className="outline-none  w-full p-2 bg-inherit"
                                            disabled
                                          />
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                                <div>
                                  {item.leftOptions &&
                                    item.leftOptions.map(
                                      (leftOption, leftOptionIndex) => {
                                        return (
                                          <div
                                            key={leftOptionIndex}
                                            className="rounded-lg bg-neutral-300 mb-3 h-10"
                                          >
                                            <select
                                              value={
                                                item.mtfAnswers![
                                                  leftOptionIndex
                                                ].rightAnswer!.key
                                              }
                                              className="p-2 w-full bg-inherit"
                                              onChange={(e) => {
                                                handleMTFAnswers(
                                                  e,
                                                  partIndex,
                                                  questionIndex,
                                                  leftOptionIndex,
                                                  leftOption.key
                                                );
                                              }}
                                            >
                                              <option value="">
                                                Select Answer
                                              </option>
                                              {item.rightOptions!.map(
                                                (rightOption, ind) => {
                                                  return (
                                                    <option
                                                      key={ind}
                                                      value={rightOption.key}
                                                    >
                                                      {rightOption.key}
                                                    </option>
                                                  );
                                                }
                                              )}
                                            </select>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              </div>
                            </>
                          </div>
                        );
                      case "FIB":
                        return (
                          <div key={questionIndex}>
                            <p className="font-bold">{`Question ${
                              questionIndex + 1
                            } - Fill In The Blanks `}</p>
                            <InputField
                              label="Add FIB Question (__ represents blank)"
                              name={"FIB Question"}
                              value={item.question[0].key}
                              onChange={(e) => {
                                handleFIBQuestionChange(
                                  e,
                                  partIndex,
                                  questionIndex
                                );
                              }}
                            />
                            <InputField
                              label="Question Tag"
                              name="question tag"
                              value={item.tag}
                              onChange={(e) =>
                                handleTagChange(e, partIndex, questionIndex)
                              }
                            />
                            {item.fibAnswers!.map((fibAnswer, answerIndex) => {
                              return (
                                <>
                                  <InputField
                                    label={`Enter Blank ${answerIndex + 1}`}
                                    name={`Blank ${answerIndex + 1}`}
                                    value={fibAnswer.key}
                                    onChange={(e) => {
                                      handleFIBAnswersChange(
                                        e,
                                        partIndex,
                                        questionIndex,
                                        answerIndex
                                      );
                                    }}
                                  />
                                </>
                              );
                            })}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              ))}
          </ul>
        </div>
      </div>
      <div className="fixed bottom-0 w-full flex justify-end border-t p-2 z-0 bg-white">
        <button
          className="z-0 flex items-center mr-10 border p-2 rounded-xl bg-primary-500 text-neutral-100 font-semibold"
          onClick={handleSubmit}
        >
          Create Assessment
        </button>
      </div>
    </>
  );
};

export default AssessmentForm;
