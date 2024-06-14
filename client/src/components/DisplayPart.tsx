import { useState } from "react";
import PartEditModal from "./PartEditModal";

const DisplayPart = ({
    name,
    instruction,
    description,
    time,
    policy,
  }: {
    name: string;
    instruction: string;
    description: string;
    time: string;
    policy: {
      grade: {
        questionType: string;
        weightage: number;
      }[];
    };
  }) => {


    const [isOpen, setIsOpen] = useState(false);
    const [partData, setPartData] = useState({
      name:name,
      instruction:instruction,
      description:description,
      time:time,
      policies:policy,
    });
  
    const handleEditClick = () => {
      setIsOpen(true);
    };
  
    const handleSave = (updatedData: typeof partData) => {
      setPartData(updatedData);
      setIsOpen(false);
    };
  
    const handleCloseModal = () => {
      setIsOpen(false);
    };
   
    return (
      <div>
        <div>Part Name: {partData.name}</div>
        <div>Part Instructions: {partData.instruction}</div>
        <div>Part Description: {partData.description}</div>
        <div>Part Time: {partData.time}</div>
        <div>Part Policy:</div>
        <div>
          {partData.policies.grade.map((policyIndividual, index) => (
            <div key={index} className="grid grid-cols-8 gap-4">
              <div>Question Type: {policyIndividual.questionType}</div>
              <div>Weightage: {policyIndividual.weightage}</div>
            </div>
          ))}
        </div>

        <button onClick={handleEditClick} className="px-4 py-2 bg-primary-500 text-white rounded-md mt-4">
        Edit Part
      </button>
     
      </div>
    );
  };
  
  export default DisplayPart;
  
