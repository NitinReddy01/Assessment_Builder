import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "../api/axios";



export default function CreateAssessment() {
    
    const {template} = useParams();
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const getTemplate = async ()=>{
            try {
                const res = await axios.get(`/template/${template}`);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getTemplate();
    },[axios])

    if(loading) {
        return "loading..."
    }

  return (
    <div>
      
    </div>
  )
}
