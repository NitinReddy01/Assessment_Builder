import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { axiosPrivate } from "../api/axios";
import { Template } from "./CreateTemplate";
import {
  FIB,
  MCQ,
  MTF,
  ViewFIBQuestion,
  ViewMCQQuestion,
  ViewMTFQuestion,
} from "../components/Questions";
interface Part {
  _id: string;
  name: string;
  instruction: string;
  description: string;
  time: string;
  content: { key: string };
  items: {
    questionId: FIB | MCQ | MTF;
    questionType: "FIB" | "MCQ" | "MTF";
  }[];
  policies: {
    grade: Policy[];
  };
}

interface Policy {
  questionType: string;
  weightage: string;
}
export const PartsList = ({ template }: { template: Template }) => {
  const [editableTemplate, setEditableTemplate] = useState<Template>(template);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (partIndex: number, field: keyof Part, value: string) => {
    const newParts = editableTemplate.parts ? [...editableTemplate.parts] : [];
    newParts[partIndex] = { ...newParts[partIndex], [field]: value };
    setEditableTemplate({ ...editableTemplate, parts: newParts });
  };

  const handlePolicyChange = (partIndex: number, policyIndex: number, field: keyof Policy, value: string) => {
    const newParts = editableTemplate.parts ? [...editableTemplate.parts] : [];
    const newPolicies = [...newParts[partIndex].policies.grade];
    newPolicies[policyIndex] = { ...newPolicies[policyIndex], [field]: value };
    newParts[partIndex].policies.grade = newPolicies;
    setEditableTemplate({ ...editableTemplate, parts: newParts });
  };

  const SubmitEditData=()=>{

    console.log(editableTemplate)
    //  send a put rest to router /update-template with editable Template
    
    axios.put("/update-template",{
      template:editableTemplate
    }).then((Res)=>{
      console.log(Res)
    })

    



  }


  console.log(template)
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="mb-4 p-[12px 50px 12px 50px] pt-3 pr-14 pb-3 pl-14 bg-primary-500 text-white rounded"
      >
        {isEditing ? "View" : "Edit"}
      </button>
      <button
        onClick={SubmitEditData}
        className="ml-2 mb-4 p-[12px 50px 12px 50px] pt-3 pr-14 pb-3 pl-14 bg-primary-500 text-white rounded"
      >
        {"Save"}
      </button>
      <h1 className="text-2xl font-bold mb-4">{editableTemplate.title}</h1>
      <h1 className="text-2xl font-bold mb-4">{editableTemplate.type}</h1>
      <p className="text-lg mb-6">
        <strong>Time:</strong> {editableTemplate.time}
      </p>
      <div className="space-y-6">
        {editableTemplate.parts &&
          editableTemplate.parts.map((part, partIndex) => (
            <div key={part._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={part.name}
                    onChange={(e) => handleInputChange(partIndex, 'name', e.target.value)}
                    className="border p-2 w-full"
                  />
                ) : (
                  part.name
                )}
              </h2>
              <p className="mb-2">
                <strong>Description:</strong>
                {isEditing ? (
                  <textarea
                    value={part.description}
                    onChange={(e) => handleInputChange(partIndex, 'description', e.target.value)}
                    className="border p-2 w-full"
                  />
                ) : (
                  part.description
                )}
              </p>
              <p className="mb-2">
                <strong>Instruction:</strong>
                {isEditing ? (
                  <textarea
                    value={part.instruction}
                    onChange={(e) => handleInputChange(partIndex, 'instruction', e.target.value)}
                    className="border p-2 w-full"
                  />
                ) : (
                  part.instruction
                )}
              </p>
              <p className="mb-2">
                <strong>Time:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={part.time}
                    onChange={(e) => handleInputChange(partIndex, 'time', e.target.value)}
                    className="border p-2 w-full"
                  />
                ) : (
                  part.time
                )}
              </p>
              <p className="mb-4">
                <strong>Content:</strong> {part.content.key ?part.content.key:part.content.contentType}
              </p>
              <div>
                <h4 className="text-lg font-medium mb-2">Questions:</h4>
                {part.items && part.items.length > 0 ? (
                  part.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {item.questionId && (
                        <div>
                          {item.questionType === "FIB" ? (
                            <ViewFIBQuestion
                              questionIndex={itemIndex}
                              time={item.questionId.time}
                              tag={(item.questionId as FIB).tag}
                              answers={(item.questionId as FIB).answers}
                              question={(item.questionId as FIB).question}
                            />
                          ) : item.questionType === "MCQ" ? (
                            <ViewMCQQuestion
                              time={item.questionId.time}
                              tag={(item.questionId as MCQ).tag}
                              question={(item.questionId as MCQ).question}
                              options={(item.questionId as MCQ).options}
                              answers={(item.questionId as MCQ).answers}
                              questionIndex={itemIndex}
                            />
                          ) : item.questionType === "MTF" ? (
                            <ViewMTFQuestion
                              answers={(item.questionId as MTF).answers}
                              time={item.questionId.time}
                              tag={(item.questionId as MTF).tag}
                              question={(item.questionId as MCQ).question}
                              leftOptions={(item.questionId as MTF).leftOptions}
                              rightOptions={(item.questionId as MTF).rightOptions}
                              questionIndex={itemIndex}
                            />
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No items</p>
                )}
              </div>
              <div>
                <h4 className="text-lg font-medium mt-4 mb-2">Policies:</h4>
                {part.policies && part.policies.grade.length > 0 ? (
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Question Type</th>
                        <th className="px-4 py-2">Weightage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {part.policies.grade.map((policy, policyIndex) => (
                        <tr key={policyIndex}>
                          <td className="border px-4 py-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={policy.questionType}
                                onChange={(e) =>
                                  handlePolicyChange(partIndex, policyIndex, 'questionType', e.target.value)
                                }
                                className="border p-2 w-full"
                              />
                            ) : (
                              policy.questionType
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={policy.weightage}
                                onChange={(e) =>
                                  handlePolicyChange(partIndex, policyIndex, 'weightage', e.target.value)
                                }
                                className="border p-2 w-full"
                              />
                            ) : (
                              policy.weightage
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No policies</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const ViewTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`/template/${id}`);
        setTemplate(res.data.template);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTemplate();
  }, [id]);

  if (!id) {
    return <div>Invalid</div>;
  }

  return <div>{template && <PartsList template={template} />}</div>;
};

export default ViewTemplate;
