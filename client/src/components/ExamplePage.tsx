import React, { useState } from 'react';
import PartEditModal, { Parts } from './PartEditModal';

const ExamplePage = () => {
    // State to hold list of parts
    const [parts, setParts] = useState<Parts[]>([]);

    // State to manage modal visibility and part being edited
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);

    // Function to open modal for editing a specific part
    const handleEditPart = (index: number) => {
        setEditingPartIndex(index);
        setIsModalOpen(true);
    };

    // Function to save changes made in the modal
    const handleSave = (updatedData: Parts) => {
        if (editingPartIndex !== null) {
            // Update existing part
            const updatedParts = [...parts];
            updatedParts[editingPartIndex] = updatedData;
            setParts(updatedParts);
        } else {
            // Add new part
            setParts([...parts, updatedData]);
        }
        setIsModalOpen(false);
        setEditingPartIndex(null);
    };

    // Function to add a new part
    const handleAddPart = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal without saving changes
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPartIndex(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Example Page</h1>
            <div className="mb-4">
                <button
                    onClick={handleAddPart}
                    className="px-4 py-2 font-semibold text-white bg-primary-500 rounded-full hover:bg-primary-800"
                >
                    Add New Part
                </button>
            </div>

          
            {parts.map((part, index) => (
                <div key={index} className="border rounded p-4 mb-4">
                    <h2 className="text-xl font-bold">{part.name}</h2>
                    <p>{part.instruction}</p>
                    <p>{part.description}</p>
                    <p>{part.time}</p>
                    <button
                        onClick={() => handleEditPart(index)}
                        className="px-4 py-2 mt-2 font-semibold text-white bg-primary-500 rounded-full hover:bg-primary-800"
                    >
                        Edit Part
                    </button>
                </div>
            ))}
            {/* {isModalOpen && (
                <PartEditModal
                    isOpen={isModalOpen}
                    initialData={editingPartIndex !== null ? parts[editingPartIndex] : undefined}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    setIsOpen={setIsModalOpen}
                />
            )} */}
        </div>
    );
};

export default ExamplePage;
