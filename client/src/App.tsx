import { useState } from 'react';
import './App.css'; // Assuming you have a CSS file for styling
import InputField from './components/InputField';

interface Parts {
  name: string;
  instruction: string;
  description: string;
  time: string;
  content: {
    contentType: string,
    key: string
  }
  policies: {
    grade: {
      questionType: string;
      weightage: number;
    };
  }[];
}

interface Template {
  type: string;
  duration?: string;
  parts?: Parts[];
}

function App() {
  const [template, setTemplate] = useState<Template>({
    type: '',
    duration: '',
    parts: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [newPart, setNewPart] = useState<Parts>({
    name: '',
    instruction: '',
    description: '',
    time: '',
    content: {
      contentType: 'text',
      key: ''
    },
    policies: [{
      grade: {
        questionType: 'FIB',
        weightage: 0
      }
    },
    {
      grade: {
        questionType: 'MCQ',
        weightage: 0
      }
    }, {
      grade: {
        questionType: 'MTF',
        weightage: 0
      }
    }],
  });

  const handleViewPart = (index:number)=>{
    setSelectedIndex(index)
  }

  const openDialog = () => {
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
    const index = name === "FIB" ? 0 : name === "MCQ" ? 1 : 2;
  
    setNewPart((prev) => {
      const updatedPolicies = [...(prev.policies || [])];
      if (!updatedPolicies[index]) {
        updatedPolicies[index] = { grade: { questionType: name, weightage: value as unknown as  number } };
      }
      updatedPolicies[index] = {
        ...updatedPolicies[index],
        grade: {
          ...updatedPolicies[index].grade,
          questionType: name,
          weightage: Number(value),
        },
      };
      return {
        ...prev,
        policies: updatedPolicies,
      };
    });
  };
  
  
  const addNewPart = () => {
    setTemplate((prev) => ({
      ...prev,
      parts: [...prev.parts!, newPart],
    }));
    setNewPart({
      name: '',
      instruction: '',
      description: '',
      time: '',
      content: {
        contentType: '',
        key: ''
      },
      policies: [],
    });
    setIsOpen(false);
  };

  const handleSave = ()=>{
    console.log(template)
  }


  return (
    <div>
      <div className="p-16">
      <div className="text-[2rem] font-bold">Create New Template</div>
      <div className="grid grid-cols-2 gap-2">
        <InputField label={"Template Type"} name={'type'} value={template.type} onChange={handleChange} />
        <InputField label={"Template Duration"} name={'duration'} value={template.duration ?? ""} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-2">
        Create Parts
        <div className="flex gap-4">
          {template.parts &&
            template.parts.map((part, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div className={`p-2 ${selectedIndex===index ? "bg-primary-500" :"bg-slate-400"} rounded-full`} onClick={()=>handleViewPart(index)}>
                  <div className={`p-1 bg-neutral-100 rounded-full`} />
                </div>
                <div>
                  {part.name}
                </div>
              </div>
            ))}
          <button
            className="px-4 py-2 rounded-lg border-2 border-primary-500 border-dotted text-primary-800"
            onClick={openDialog}
          >
            + Add Part
          </button>

          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
              <div className="relative bg-neutral-100 w-[90%] p-16 rounded-lg">
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold">Enter Part Details</h2>
                  <button onClick={closeDialog} className="text-gray-600 hover:text-gray-900">
                    X
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <InputField label={"Part Name"} name={'name'} value={newPart.name} onChange={handlePartInputChange} />
                  <InputField label={"Part Instruction"} name={'instruction'} value={newPart.instruction} onChange={handlePartInputChange} />
                  <InputField label={"Part Description"} name={'description'} value={newPart.description} onChange={handlePartInputChange} />
                  <InputField label={"Part Time"} name={"time"} value={newPart.time} onChange={handlePartInputChange} />
                </div>
                <div>
                  <div className='flex gap-4'>
                    <div>
                       Content
                      <span className="text-error-800">*</span>
                    </div>
                    <select className='border px-4 rounded'>
                      <option>Text</option>
                    </select>
                  </div>
                </div>
                <div className='grid grid-cols-2'>
                  <div>
                    <div className='my-4'>Policy<span className="text-error-800">*</span></div>
                    <div className='grid grid-cols-2'>
                      <div>
                        <div className='border p-2 rounded-l-lg mb-1'>Fill In The Blanks</div>
                        <div className='border p-2 rounded-l-lg mb-1'>Multiple Choice Questions</div>
                        <div className='border p-2 rounded-l-lg mb-1'>Match The Following</div>
                      </div>
                      <div>
                        <input
                          type="number"
                          name={"FIB"}
                          value={newPart.policies[0].grade.weightage}
                          placeholder={`Enter weightage for FIB`}
                          onChange={handlePartPolicy}
                          className="p-2 border rounded-r-lg mb-1"
                        />
                        <input
                          type="number"
                          name={"MCQ"}
                          value={newPart.policies[1].grade.weightage}
                          placeholder={`Enter weightage for MCQ`}
                          onChange={handlePartPolicy}
                          className="p-2 border rounded-r-lg mb-1"
                        />
                        <input
                          type="number"
                          name={"MTF"}
                          value={newPart.policies[2].grade.weightage}
                          placeholder={`Enter weightage for MTF`}
                          onChange={handlePartPolicy}
                          className="p-2 border rounded-r-lg mb-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={closeDialog} className="px-4 py-2 border-2 border-primary-500 rounded-full">
                    Close
                  </button>
                  <button onClick={addNewPart} className="px-4 py-2 font-semibold text-white bg-primary-500 rounded-full hover:bg-primary-800">
                    Add Part
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
    <div className='bottom-0 fixed border w-full h-16 flex justify-end'>
      <button className='border-2 bg-primary-500 px-4 mt-2 mb-4 rounded-full flex items-center text-neutral-100' onClick={handleSave}>Save Template</button>
    </div>
    </div>
  );
}

export default App