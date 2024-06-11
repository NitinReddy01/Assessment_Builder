import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "../api/axios";
import { PartsList } from "./ViewTemplate";
import { Parts } from "./CreateTemplate";

interface Assessment {
    title:string,
    time:string,
    templateType:string,
    type:string,
    parts:Parts[]
}

export default function ViewAssessment() {
    const {id} = useParams();
    const [loading,setLoading] = useState(true);
    const [assessment,setAssessment] = useState<Assessment>();

    useEffect(()=>{
       const getAssessment = async ()=>{
        try {
            const res = await axios.get(`/assessment/${id}`);
            setAssessment(res.data.assessment);
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
       }
       getAssessment();
    },[id])

    if(!id) {
        return "Invalid Assessment ID"
    }

    if(loading) {
        return "loading..."
    }
    if(!assessment) {
        return "Something went wrong"
    }
  return (
    <div className="">
      <PartsList  template={assessment} />
    </div>
  )
}
