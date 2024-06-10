import { useEffect, useState } from "react"
import axios from "../api/axios";


export default function Templates() {

    const [templates,setTemplates] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{

        const getTemplates = async ()=>{
            try {
                const res = await axios.get('/all-templates');
                console.table(res.data.templates)
                setTemplates(res.data.templates);
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
      Templates
    </div>
  )
}
