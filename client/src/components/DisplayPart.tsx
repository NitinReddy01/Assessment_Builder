const DisplayPart = ({
    name,
    instruction,
    description,
    time,
    policy,
  }: {
    name: string;
    instruction: string;
    description: string;
    time: string;
    policy: {
      grade: {
        questionType: string;
        weightage: number;
      };
    }[];
  }) => {
    return (
      <div>
        <div>Part Name: {name}</div>
        <div>Part Instructions: {instruction}</div>
        <div>Part Description: {description}</div>
        <div>Part Time: {time}</div>
        <div>Part Policy:</div>
        <div>
          {policy.map((policyIndividual, index) => (
            <div key={index} className="grid grid-cols-8 gap-4">
              <div>Question Type: {policyIndividual.grade.questionType}</div>
              <div>Weightage: {policyIndividual.grade.weightage}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default DisplayPart;
  
