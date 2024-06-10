
interface AssessmentCardProps{
    assessment:{    
        _id:string,
        title:string,
        type:string,
        templateType:string;
    }
}

export default function AssessmentCard({assessment}:AssessmentCardProps) {
  return (
    <div className="flex flex-col gap-4 border border-neutral-200 rounded-lg p-4 cursor-pointer" >
      <div className="flex justify-between font-bold">
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
