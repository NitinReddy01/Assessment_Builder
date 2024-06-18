import React, { useState, useEffect } from 'react';
import { AudioQuestion, FIB, MCQ, MTF } from '../components/Questions';
import InputField from './InputField';

interface PartEditModalProps {
    isOpen: boolean;
    initialData?: Parts;
    onSave: (updatedData: Parts) => void;
    onClose: () => void;
    
}

export interface Parts {
    _id?: string;
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
        questionType: string;
        questionId?: FIB | MCQ | MTF | AudioQuestion;
    }[];
}

const PartEditModal: React.FC<PartEditModalProps> = ({
    isOpen,
    initialData,
    onSave,
    onClose,
    
}) => {
    const [editedData, setEditedData] = useState<Parts>({
        name: '',
        instruction: '',
        description: '',
        time: '',
        content: {
            contentType: 'text',
            key: '',
        },
        policies: {
            grade: [
                { questionType: 'FIB', weightage: 0 },
                { questionType: 'MCQ', weightage: 0 },
                { questionType: 'MTF', weightage: 0 },
            ],
        },
        items: [],
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setEditedData(initialData);
        }
    }, [isOpen, initialData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePartPolicy = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        const index =
            name === 'FIB' ? 0 : name === 'MCQ' ? 1 : name === 'MTF' ? 2 : -1;

        if (index !== -1) {
            setEditedData((prev) => {
                const updatedPolicies = { ...prev.policies };
                updatedPolicies.grade[index].weightage = Number(value);
                return {
                    ...prev,
                    policies: updatedPolicies,
                };
            });
        }
    };

    const handleAddItem = (questionType: string): void => {
        const newItem = {
            questionType,
            
        };

        setEditedData((prev) => ({
            ...prev,
            items: [...prev.items, newItem],
        }));
    };

    const handleRemoveItem = (index: number): void => {
        setEditedData((prev) => {
            const updatedItems = [...prev.items];
            updatedItems.splice(index, 1);
            return {
                ...prev,
                items: updatedItems,
            };
        });
    };

    const handleSaveChanges = (): void => {
        onSave(editedData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="relative flex flex-col gap-4 bg-white w-[90%] p-16 rounded-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Enter Part Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        X
                    </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <InputField
                        label="Part Name"
                        name="name"
                        value={editedData.name}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Part Instruction"
                        name="instruction"
                        value={editedData.instruction}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Part Description"
                        name="description"
                        value={editedData.description}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Part Time"
                        name="time"
                        value={editedData.time}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex gap-4">
                    <div>
                        Content
                        <span className="text-red-800">*</span>
                    </div>
                    <select className="border px-4 rounded">
                        <option>Text</option>
                    </select>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div
                        className="border border-primary-500 p-2 hover:bg-primary-500 hover:text-neutral-100 hover:font-semibold border-dotted rounded-lg"
                        onClick={() => {
                            handleAddItem('AudioQuestion');
                        }}
                    >
                        Add Audio Question
                    </div>
                    <div
                        className="border border-primary-500 p-2 hover:bg-primary-500 hover:text-neutral-100 hover:font-semibold border-dotted rounded-lg"
                        onClick={() => {
                            handleAddItem('MCQ');
                        }}
                    >
                        Add MCQ
                    </div>
                    <div
                        className="border border-primary-500 p-2 hover:bg-primary-500 hover:text-neutral-100 hover:font-semibold border-dotted rounded-lg"
                        onClick={() => {
                            handleAddItem('FIB');
                        }}
                    >
                        Add FIB
                    </div>
                    <div
                        className="border border-primary-500 p-2 hover:bg-primary-500 hover:text-neutral-100 hover:font-semibold border-dotted rounded-lg"
                        onClick={() => {
                            handleAddItem('MTF');
                        }}
                    >
                        Add MTF
                    </div>
                </div>
                {editedData.items &&
                    editedData.items.map((item, index) => (
                        <div key={index}>
                            <div className="flex gap-4">
                                <span>{index + 1} . </span>
                                <span>{item.questionType}</span>
                                <span
                                    className="text-error-800 cursor-pointer font-bold"
                                    onClick={() => {
                                        handleRemoveItem(index);
                                    }}
                                >
                                    X
                                </span>
                            </div>
                        </div>
                    ))}
                <div className="grid grid-cols-2">
                    <div>
                        <div className="my-4">
                            Policy
                            <span className="text-error-800">*</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>
                                <div className="border p-2 rounded-l-lg mb-1">
                                    Fill In The Blanks
                                </div>
                                <div className="border p-2 rounded-l-lg mb-1">
                                    Multiple Choice Questions
                                </div>
                                <div className="border p-2 rounded-l-lg mb-1">
                                    Match The Following
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <input
                                    type="number"
                                    name="FIB"
                                    value={
                                        editedData.policies.grade[0].weightage
                                    }
                                    placeholder={`Enter weightage for FIB`}
                                    onChange={handlePartPolicy}
                                    className="p-2 border rounded-r-lg mb-1"
                                />
                                <input
                                    type="number"
                                    name="MCQ"
                                    value={
                                        editedData.policies.grade[1].weightage
                                    }
                                    placeholder={`Enter weightage for MCQ`}
                                    onChange={handlePartPolicy}
                                    className="p-2 border rounded-r-lg mb-1"
                                />
                                <input
                                    type="number"
                                    name="MTF"
                                    value={
                                        editedData.policies.grade[2].weightage
                                    }
                                    placeholder={`Enter weightage for MTF`}
                                    onChange={handlePartPolicy}
                                    className="p-2 border rounded-r-lg mb-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-0 absolute mb-2 flex items-end justify-end right-4 w-full gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border-2 border-primary-500 rounded-full"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 font-semibold text-white bg-primary-500 rounded-full hover:bg-primary-800"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartEditModal;
