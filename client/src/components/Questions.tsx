import InputField from "./InputField";

export interface QuesitonType {
  contentType: string;
  key: string;
}

export interface FIB {
  question: QuesitonType[];
  answers: QuesitonType[];
  time: string;
  tag: string;
  type: string;
}

export interface MCQ {
  type: string;
  question: QuesitonType[];
  options: QuesitonType[];
  answers: QuesitonType[];
  time: string;
  tag?: string;
}

export interface MTF {
  question: QuesitonType[];
  leftOptions: QuesitonType[];
  rightOptions: QuesitonType[];
  answers: {
    leftAnswer: QuesitonType;
    rightAnswer: QuesitonType[];
  }[];
  time: string;
  tag?: string;
  type: string;
}

export interface AudioQuestion {
  question: QuesitonType[];
  time: string;
  type: string;
}

export type Question = FIB | MCQ | MTF | AudioQuestion;

interface ViewFIBQuestionProps {
  question: QuesitonType[];
  time: string;
  answers: QuesitonType[];
  tag: string;
  questionIndex: number;
}

export const ViewFIBQuestion = ({
  question,
  time,
  answers,
  tag,
  questionIndex,
}: ViewFIBQuestionProps) => {
  return (
    <>
      <div className="flex justify-between">
        <p className="font-bold">{`Question ${
          questionIndex + 1
        } - Fill In The Blanks `}</p>
      </div>
      <>
        {question.map((question, questionIndex) => {
          if (question.contentType === "text") {
            return (
              <div key={questionIndex}>
                <InputField
                  name="question"
                  label="Question"
                  value={question.key}
                  disabled={true}
                />
              </div>
            );
          }
        })}
        <div>tag - {tag}</div>
        <div>Time - {time}</div>
        {answers.map((ans, answerIndex) => {
          if (ans.contentType === "text") {
            return (
              <div key={answerIndex}>
                <InputField
                  value={ans.key}
                  label="Answer"
                  disabled={true}
                  name="anwer"
                />
              </div>
            );
          }
        })}
      </>
    </>
  );
};

interface ViewMCQQuestionProps {
  question: QuesitonType[];
  time: string;
  type: string;
  answers: QuesitonType[];
  tag: string;
  questionIndex: number;
}

export const ViewMCQQuestion = ({
  question,
  time,
  type,
  answers,
  tag,
  questionIndex,
}: ViewMCQQuestionProps) => {
  return (
    <>
      <div className="flex justify-between">
        <p className="font-bold">{`Question ${questionIndex + 1} - MCQ `}</p>
      </div>
      <>
        <div>tag - {tag}</div>
        <div>Time - {time}</div>
        {question.map((q, index) => {
          if (q.contentType === "text") {
            return (
              <div key={index}>
                <InputField
                  name="question"
                  label="Question"
                  value={q.key}
                  disabled={true}
                />
              </div>
            );
          }
        })}
        <div>
          {type === "MCQ" &&
            question.map((q, index) => {
              if (q.contentType === "text") {
                return (
                  <div key={index}>
                    <InputField
                      name="option"
                      label={`Option ${index + 1}`}
                      value={q.key}
                      disabled={true}
                    />
                  </div>
                );
              }
            })}
        </div>
        <div>
          {answers.map((ans, index) => {
            if (ans.contentType === "text") {
              return (
                <div key={index}>
                  <InputField
                    name="answer"
                    label="Correct Answer"
                    value={ans.key}
                    disabled={true}
                  />
                </div>
              );
            }
          })}
        </div>
      </>
    </>
  );
};

interface ViewMTFQuestionProps {
  question: QuesitonType[];
  time: string;
  leftOptions: QuesitonType[];
  rightOptions: QuesitonType[];
  answers: { _id: string; leftOption: string[]; rightOptions: string[] }[];
  tag: string;
  questionIndex: number;
}

export const ViewMTFQuestion = ({
  question,
  time,
  leftOptions,
  rightOptions,
  answers,
  tag,
  questionIndex,
}: ViewMTFQuestionProps) => {
  return (
    <>
      <div className="flex justify-between">
        <p className="font-bold">{`Question ${questionIndex + 1} - MTF `}</p>
      </div>
      <>
        <div>tag - {tag}</div>
        <div>Time - {time}</div>
        {question.map((q, index) => (
          <div key={index}>
            <InputField
              name="question"
              label="Question"
              value={q.key}
              disabled={true}
            />
          </div>
        ))}
        <div>
          {leftOptions.map((option, index) => (
            <div key={index}>
              <InputField
                name="leftOption"
                label={`Left Option ${index + 1}`}
                value={option.key}
                disabled={true}
              />
            </div>
          ))}
        </div>
        <div>
          {rightOptions.map((option, index) => (
            <div key={index}>
              <InputField
                name="rightOption"
                label={`Right Option ${index + 1}`}
                value={option.key}
                disabled={true}
              />
            </div>
          ))}
        </div>

        <div>
          {answers.map((ans, index) => (
            <div key={index}>
              <p>
                {ans.leftOption.map((leftOption, i) => (
                  <span key={i}>
                    {
                      leftOptions.find((option) => option.key === leftOption)
                        ?.key
                    }{" "}
                  </span>
                ))}
                matches{" "}
                {ans.rightOptions.map((rightOption, i) => (
                  <span key={i}>
                    {
                      rightOptions.find((option) => option.key === rightOption)
                        ?.key
                    }{" "}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </>
    </>
  );
};
