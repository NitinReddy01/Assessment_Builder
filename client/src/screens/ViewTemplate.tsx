import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { Template } from "./CreateTemplate";
import {
  FIB,
  MCQ,
  MTF,
  ViewFIBQuestion,
  ViewMCQQuestion,
  ViewMTFQuestion,
} from "../components/Questions";

export const PartsList = ({ template }: { template: Template }) => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{template.type}</h1>
      <p className="text-lg mb-6">
        <strong>Time:</strong> {template.time}
      </p>
      <div className="space-y-6">
        {template.parts &&
          template.parts.map((part) => (
            <div key={part._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{part.name}</h2>
              <p className="mb-2">
                <strong>Description:</strong> {part.description}
              </p>
              <p className="mb-2">
                <strong>Instruction:</strong> {part.instruction}
              </p>
              <p className="mb-2">
                <strong>Time:</strong> {part.time}
              </p>
              <p className="mb-4">
                <strong>Content:</strong> {part.content.contentType}
              </p>
              <div>
                <h4 className="text-lg font-medium mb-2">Questions:</h4>
                {part.items && part.items.length > 0 ? (
                  part.items.map((item, itemIndex) => {
                    return (
                      <div key={itemIndex}>
                        <div> {item.questionType} </div>
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
                                leftOptions={
                                  (item.questionId as MTF).leftOptions
                                }
                                rightOptions={
                                  (item.questionId as MTF).rightOptions
                                }
                                questionIndex={itemIndex}
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })
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
                      {part.policies.grade.map((policy, i) => (
                        <tr key={i}>
                          <td className="border px-4 py-2">
                            {policy.questionType}
                          </td>
                          <td className="border px-4 py-2">
                            {policy.weightage}
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

const ViewTemplate = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState<Template>();
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/template/${id}`);
        setTemplate(res.data.template);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [id]);

  if (!id) {
    return "Invalid";
  }

  return <div>{template && <PartsList template={template!} />}</div>;
};

export default ViewTemplate;
