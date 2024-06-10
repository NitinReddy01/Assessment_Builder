import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Assessments() {
  const [loading,setLoading] = useState(true);
  const [assessments,setAssessments] = useState([]);

  useEffect(()=>{

    const getTemplates = async ()=>{
        try {
            const res = await axios.get('/all-assessments');
            console.table(res.data.assessments)
            setAssessments(res.data.assessments);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    getTemplates();
},[axios])

  return (
    <div>
      Assessments
    </div>
  )
}
