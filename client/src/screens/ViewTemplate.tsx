import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../api/axios"
import { Template } from "./CreateTemplate";

const PartsList = ({ template }: { template: Template }) => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">{template.type}</h1>
            <p className="text-lg mb-6"><strong>Time:</strong> {template.time}</p>
            <div className="space-y-6">
                {template.parts && template.parts!.map((part) => (
                    <div key={part._id} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{part.name}</h2>
                        <p className="mb-2"><strong>Description:</strong> {part.description}</p>
                        <p className="mb-2"><strong>Instruction:</strong> {part.instruction}</p>
                        <p className="mb-2"><strong>Time:</strong> {part.time}</p>
                        <p className="mb-4"><strong>Content:</strong> {part.content.contentType}</p>
                        <div>
                            <h4 className="text-lg font-medium mb-2">Items:</h4>
                            {part.items && part.items.length > 0 ? (
                                <ul className="list-disc list-inside ml-4">
                                    {part.items.map((item, i) => (
                                        <li key={i}>{item.questionType}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No items</p>
                            )}
                        </div>
                        <div>
                            <h4 className="text-lg font-medium mt-4 mb-2">Policies:</h4>
                            {part.policies && part.policies.length > 0 ? (
                                <ul className="list-disc list-inside ml-4">
                                    <li>
                                        <div>
                                            <span>Question Type</span>
                                            <span>weightage</span>
                                        </div>
                                    </li>
                                    {part.policies.map((policy, i) => (
                                        <li key={i}>
                                            <div>
                                                <span>{policy.grade.questionType}</span>
                                                <span>{policy.grade.weightage}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
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
    const { id } = useParams()
    const [template,setTemplate] = useState<Template>()
    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(`/template/${id}`)
            console.log(res.data.template)
            setTemplate(res.data.template)
        }
        fetch()
    }, [id])
    return (
        <div>
            {template && <PartsList template={template!} />}
        </div>
    )
}

export default ViewTemplate
