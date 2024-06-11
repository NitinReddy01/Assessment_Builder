import { useNavigate } from "react-router-dom";

interface AssessmentCardProps{
    assessment:{    
        _id:string,
        title:string,
        type:string,
        templateType:string;
    }
}

export default function AssessmentCard({assessment}:AssessmentCardProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 border border-neutral-200 rounded-lg p-4" >
      <div className="flex justify-between font-bold cursor-pointer" onClick={()=>navigate(`/view-assessment/${assessment._id}`)} >
        Title - {assessment.title}
      </div>
      <div>
        Type - {assessment.type}
      </div>
      <div>
        Template - {assessment.templateType}
      </div>
    </div>
  )
}
