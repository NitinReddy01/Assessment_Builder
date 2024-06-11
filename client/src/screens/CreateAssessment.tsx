import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "../api/axios";
import { Question } from "../components/Questions";
import AssessmentForm from "../components/AssessmentForm";

export interface AssessmentParts {
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
        };
        }[];
    items:{
      questionType:string,
      question: Question
    }[];
  }

export default function CreateAssessment() {
    
    const {template} = useParams();
    const [loading,setLoading] = useState(true);
    const [title,setTitle] = useState('');
    const [time,setTime] = useState('');
    const [type,setType] = useState('');
    const [parts,setParts] = useState<AssessmentParts[]>([]);

    useEffect(()=>{
        const getTemplate = async ()=>{
            try {
                const res = await axios.get(`/template/${template}`);
                console.log(res.data);
                setTime(res.data.time);
                setParts(res.data.template.parts);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        if(template && template!=="none") getTemplate();
    },[axios])

    if(loading) {
        return "loading..."
    }

  return (
    <div>
      <AssessmentForm title={title} setTime={setTime} time ={time} setParts={setParts} setTitle={setTitle} type={type} setType={setType}  parts={parts}/>
    </div> 
  )
}
