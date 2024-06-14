import { useState } from 'react';
import InputField from '../components/InputField';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AudioQuestion, FIB, MCQ, MTF } from '../components/Questions';
import { TemplateTimeValidate, getPartsTime, validateTimeInput, validatePartsTime } from '../utils/ValidationChecks';


import PartEditModal from '../components/PartEditModal';

export interface Parts {
  _id?: string
  name: string;
  instruction: string;
  description: string;
  time: string;
  content: {
    contentType: string;
    key: string;
  };
  policies: {
    grade: {
      questionType: string;
      weightage: number;
    }[];
  };
  items: {
    questionType: string,
    questionId?: (FIB | MCQ | MTF | AudioQuestion)
  }[]
}

export interface Template {
  title?: string
  type: string;
  time?: string;
  parts?: Parts[];
}

function CreateTemplate() {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template>({
    type: '',
    time: '',
    parts: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [newPart, setNewPart] = useState<Parts>({
    name: '',
    instruction: '',
    description: '',
    time: '',
    content: {
      contentType: 'text',
      key: ''
    },
    policies: {
      grade: [{ questionType: 'FIB', weightage: 0 }, { questionType: 'MCQ', weightage: 0 }, { questionType: 'MTF', weightage: 0 }]
    },
    items: []
  });

  // 

  const [parts, setParts] = useState<Parts[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);




  // 

  const handleViewPart = (index: number) => {
    setSelectedIndex(selectedIndex === index ? -1 : index);
  }

  const openDialog = () => {
    if(!template.type.trim()){
      alert("Enter Template type")
      return
    }
    if(!template.time?.trim()){
      alert("Enter Template Time Duration")
      return;
    }
    if(template.time && !TemplateTimeValidate(template)){
      alert("Enter Valid Template Time Duration")
      return;
    }
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPart((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartPolicy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const index = name === 'FIB' ? 0 : name === 'MCQ' ? 1 : 2;

    setNewPart((prev) => {
      const updatedPolicies = { ...prev.policies };
      updatedPolicies.grade[index].weightage = Number(value);
      return {
        ...prev,
        policies: updatedPolicies,
      };
    });
  };



  const addNewPart = (a: any) => {
    if(!newPart.name.trim()){
      alert("Enter Name")
      return;
    }
    if(!newPart.instruction.trim()){
      alert("Enter instructions")
      return;
    }
    if(!newPart.description.trim()){
      alert("Enter Description")
      return
    }
    if(!newPart.time.trim()){
      alert("Enter Time Duration")
      return
    }
    if(!validateTimeInput(newPart.time)){
      alert("Enter valid Time Duration")
      return
    }
    if(newPart.time && !getPartsTime(template.parts,template.time,newPart.time)){
      alert("Parts Time Duration Exceeds Template Time")
      return
    }
   
    setTemplate((prev) => ({
      ...prev,
      parts: [...(prev.parts ?? []), newPart],
    }));
    setNewPart({
      name: '',
      instruction: '',
      description: '',
      time: '',
      content: {
        contentType: 'text',
        key: ''
      },
      policies: {
        grade: [{ questionType: 'FIB', weightage: 0 }, { questionType: 'MCQ', weightage: 0 }, { questionType: 'MTF', weightage: 0 }]
      },
      items: []
    });
    setIsOpen(false);
    }

    const handleAddItem = (questionType: string) => {
      setNewPart((prev) => {
        const updatedItems = [...prev.items, { questionType }];
        return {
          ...prev,
          items: updatedItems,
        };
      });
  };

  const handleRemoveItem = (index: number) => {
    setNewPart((prev) => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const handleSaveTemplate = async () => {
   
    try {
      if(!template.type.trim()){
        alert("Enter Template type")
        return
      }
      if(!template.time?.trim()){
        alert("Enter Template time")
        return;
      }
      if(!TemplateTimeValidate(template)){
        alert("Enter Valid Template Time Duration")
        return;
      }
      if(!validatePartsTime(template.parts,parseInt(template.time))){
        alert("Please check Time Durations")
        return
      }
        await axios.post('/add-template', {
          template
        })
        alert("Template Created")
        navigate(-1);
    } catch (error) {
      console.log(error);
      alert("Creation Failed")
    }
  }

  //  code

  const handleSave = (updatedData: Parts) => {
    
    if (editingPartIndex !== null) {
     
      const updatedParts = [...parts];
      updatedParts[editingPartIndex] = updatedData;
      setParts(updatedParts);
    } else {
     
      setParts([...parts, updatedData]);

      
      let obj={
        "parts": [...parts,updatedData],
        type:template.type,
        time:template.time

      }
      setTemplate(obj)
      
    }
    setIsModalOpen(false);
    setEditingPartIndex(null);
  };


  const handleAddPart = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartIndex(null);
  };


  const handleEditPart = (index: number) => {
    setEditingPartIndex(index);
    setIsModalOpen(true);
  };

  
  return (
    <div>
      {/* <PartManager /> */}
      <div className="px-16">
        <div className="flex justify-between mb-4 bg-neutral-300 rounded-lg p-10">
          <div className="flex items-center font-bold text-xl">Create Template</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputField label={"Template Type"} name={'type'} value={template.type} onChange={handleChange} />
          <InputField label={"Template time (eg 10m, 20m)"} name={'time'} value={template.time ?? ""} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <div className='grid grid-cols-5'>
            <div className='flex items-center'>Create Parts</div>
            <button
              className="px-4 py-2 rounded-lg border-2 border-primary-500 border-dotted text-primary-800"
              onClick={handleAddPart}
            >
              + Add Part
            </button>
          </div>
          <div className="flex gap-4">
            {template.parts &&
              template.parts.map((part, index) => (
                <div key={index}>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`p-2 ${selectedIndex === index ? "bg-primary-500" : "bg-slate-400"} rounded-full`}
                      onClick={() => handleViewPart(index)}
                    >
                      <div className={`p-1 bg-neutral-100 rounded-full`} />
                    </div>
                    <div>
                      {part.name}
                    </div>
                  </div>

                </div>
              ))}
            {/* {isOpen && (
              // <div className="fixed inset-0 z-50 flex gap-4 items-center justify-center overflow-auto bg-black bg-opacity-50">
              //   <div className="relative flex flex-col gap-4 bg-neutral-100 w-[90%] p-16 rounded-lg">
              //     <div className="flex justify-between">
              //       <h2 className="text-xl font-bold">Enter Part Details</h2>
              //       <button onClick={closeDialog} className="text-gray-600 hover:text-gray-900">
              //         X
              //       </button>
              //     </div>
              //     <div className="mt-4 grid grid-cols-2 gap-4">
              //       <InputField label={"Part Name"} name={'name'} value={newPart.name} onChange={handlePartInputChange} />
              //       <InputField label={"Part Instruction"} name={'instruction'} value={newPart.instruction} onChange={handlePartInputChange} />
              //       <InputField label={"Part Description"} name={'description'} value={newPart.description} onChange={handlePartInputChange} />
              //       <InputField label={"Part Time (eg 10m 20m)"} name={"time"} value={newPart.time} onChange={handlePartInputChange} />
              //     </div>
              //     <div>
              //       <div className='flex gap-4'>
              //         <div>
              //           Content
              //           <span className="text-error-800">*</span>
              //         </div>
              //         <select className='border px-4 rounded'>
              //           <option>Text</option>
              //         </select>
              //       </div>
              //     </div>
              //     <div className='grid grid-cols-4 gap-4'>
              //       <div className='border border-primary-500 p-2 hover:bg-primary-500 hover:text-neutral-100 hover:font-semibold border-dotted rounded-lg' onClick={() => { handleAddItem("AudioQuestion") }}>Add Audio Question</div>
              //       <div className='border border-primary-500 p-2 hover:bg-primary-500 hover:text-neutral-100 hover:font-semibold border-dotted rounded-lg' onClick={() => { handleAddItem("MCQ") }}>Add MCQ</div>
              //       <div className='border border-primary-500 p-2 hover:bg-primary-500 hover:text-neutral-100 hover:font-semibold border-dotted rounded-lg' onClick={() => { handleAddItem("FIB") }}>Add FIB</div>
              //       <div className='border border-primary-500 p-2 hover:bg-primary-500 hover:text-neutral-100 hover:font-semibold border-dotted rounded-lg' onClick={() => { handleAddItem("MTF") }}>Add MTF</div>
              //     </div>
              //     {
              //       newPart.items && newPart.items.map((item, index) => {
              //         return <div key={index}>
              //           <div className='flex gap-4'><span>{index + 1} . </span><span>{item.questionType}</span><span className='text-error-800 cursor-pointer font-bold' onClick={() => {handleRemoveItem(index)}}>X</span></div>
              //         </div>
              //       })
              //     }
              //     <div className='grid grid-cols-2'>
              //       <div>
              //         <div className='my-4'>Policy<span className="text-error-800">*</span></div>
              //         <div className='grid grid-cols-2'>
              //           <div>
              //             <div className='border p-2 rounded-l-lg mb-1'>Fill In The Blanks</div>
              //             <div className='border p-2 rounded-l-lg mb-1'>Multiple Choice Questions</div>
              //             <div className='border p-2 rounded-l-lg mb-1'>Match The Following</div>
              //           </div>
              //           <div>
              //             <input
              //               type="number"
              //               name={"FIB"}
              //               value={newPart.policies.grade[0].weightage}
              //               placeholder={`Enter weightage for FIB`}
              //               onChange={handlePartPolicy}
              //               className="p-2 border rounded-r-lg mb-1"
              //             />
              //             <input
              //               type="number"
              //               name={"MCQ"}
              //               value={newPart.policies.grade[1].weightage}
              //               placeholder={`Enter weightage for MCQ`}
              //               onChange={handlePartPolicy}
              //               className="p-2 border rounded-r-lg mb-1"
              //             />
              //             <input
              //               type="number"
              //               name={"MTF"}
              //               value={newPart.policies.grade[2].weightage}
              //               placeholder={`Enter weightage for MTF`}
              //               onChange={handlePartPolicy}
              //               className="p-2 border rounded-r-lg mb-1"
              //             />
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //     <div className="bottom-0 absolute mb-2 flex items-end justify-end right-4 w-full gap-4">
              //       <button onClick={closeDialog} className="px-4 py-2 border-2 border-primary-500 rounded-full">
              //         Close
              //       </button>
              //       <button onClick={addNewPart} className="px-4 py-2 font-semibold text-white bg-primary-500 rounded-full hover:bg-primary-800">
              //         Add Part
              //       </button>
              //     </div>
              //   </div>
              // </div>
              // <PartEditModal   
              // isOpen={isOpen}
              // initialData={newPart}
              // onSave={addNewPart}
              // onClose={closeDialog} 
              // setIsOpen={openDialog}
              // />
              <ExamplePage/>
            )} */}

            {isModalOpen && (
              <PartEditModal
                isOpen={isModalOpen}
                initialData={editingPartIndex !== null ? parts[editingPartIndex] : undefined}
                onSave={handleSave}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
        {parts.map((part, index) => (
          <div key={index} className="border rounded p-4 mb-4">
            <div>Part Name: {part.name}</div>
            <div>Part Description: {part.description}</div>
            <div>Part Time: {part.time}</div>
            <div>Part Policy:</div>
            <div>
              {part.policies.grade.map((policyIndividual, index) => (
                <div key={index} className="grid grid-cols-8 gap-4">
                  <div>Question Type: {policyIndividual.questionType}</div>
                  <div>Weightage: {policyIndividual.weightage}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleEditPart(index)}
              className="px-4 py-2 mt-2 font-semibold text-white bg-primary-500 rounded-full hover:bg-primary-800"
            >
              Edit Part
            </button>
          </div>
        ))}

        {/* {
          selectedIndex !== -1 ? (
            <DisplayPart
              name={template.parts![selectedIndex].name}
              instruction={template.parts![selectedIndex].instruction}
              description={template.parts![selectedIndex].description}
              time={template.parts![selectedIndex].time}
              policy={template.parts![selectedIndex].policies}
            />
          ) : null
        } */}
      </div>
      <div className='bottom-0 left-0 fixed border w-full h-16 flex justify-end'>
        <button className='border-2 bg-primary-500 px-4 mt-2 mb-4 rounded-full flex items-center text-neutral-100' onClick={handleSaveTemplate}>Save Template</button>
      </div>
    </div>
  );
}

export default CreateTemplate;
