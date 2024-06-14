import { useEffect, useState } from "react";
import AssessmentCard from "../components/AssessmentCard";
import { Link } from "react-router-dom";
import axios from "../api/axios";

import ConfirmationModal from "../components/Modals/CofirmationModal";

export interface IAssessment {
  _id: string;
  title: string;
  type: string;
  templateType: string;
}

export interface ITemplate {
  _id: string;
  type: string;
}

export default function Assessments() {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [template, setTemplate] = useState("none");
  const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const getAssessments = async () => {
      try {
        let res = await axios.get("/all-assessments");
        setAssessments(res.data.assessments);
        res = await axios.get("/all-templates");
        setTemplates(res.data.templates);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getAssessments();
  }, []);

  if (loading) {
    return "Loading...";
  }

  const handleAssessmentDeletion = (id: string) => {
    // console.log(id)
    try {
      axios
        .delete(`/assessment/${id}`)
        .then((res) => {
          // console.log(res);
          setAssessments(assessments.filter(item => item._id !== id));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {console.log(err)}finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const confirmDelete = (id: string) => {
    // console.log(id)
    setDeleteId(id);
    setShowModal(true);
}

  return (
    <>
      <div>
        <div className="flex justify-between mb-4 bg-neutral-300 rounded-lg p-10">
          <div className="flex items-center font-bold text-xl">Assessments</div>
          <button
            className="px-4 py-2 font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-800"
            onClick={() => setIsModelOpen(true)}
          >
            + Create Assessment
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {assessments && assessments.length === 0 ? (
            "No assessments created"
          ) : (
            <>
              {assessments &&
                assessments.map((assessment) => {
                  return (
                    <div key={assessment._id}>
                      <AssessmentCard assessment={assessment} />
                      <button
                        className="border-2 rounded-2xl border-red-700 p-2"
                        onClick={() => { confirmDelete(assessment._id) }}
                      >
                        delete
                      </button>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
      {isModelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-neutral-100 p-16 rounded-lg flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div>Choose Template</div>
              <select
                onChange={(e) => setTemplate(e.target.value)}
                value={template}
              >
                <option value={"none"}>Select Template</option>
                {templates.map((template) => {
                  return (
                    <option key={template._id} value={template._id}>
                      {template.type}
                    </option>
                  );
                })}
              </select>
              <Link
                to={"/create-template"}
                className="cursor-pointer border border-primary-500 rounded-lg p-2"
              >
                Create new template
              </Link>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className=" p-2 border-2 w-28 border-primary-500 rounded-full"
                onClick={() => setIsModelOpen(false)}
              >
                Close
              </button>
              <Link
                to={template !== "none" ? `/create-assessment/${template}` : ""}
                className="px-4 py-2 font-semibold text-white bg-primary-500 rounded-full hover:bg-primary-800"
              >
                Create Assessment
              </Link>
            </div>
          </div>
          
        </div>
      )}

                 <ConfirmationModal
                      show={showModal}
                      onClose={() => setShowModal(false)}
                      onConfirm={() => deleteId && handleAssessmentDeletion(deleteId)}
                      title="Confirm Delete"
                      message="Are you sure you want to delete this assessment?"
                      caution="Caution : Deleting this assessment will delete all parts and questions related to this assessment."
                  />
    </>
  );
}
