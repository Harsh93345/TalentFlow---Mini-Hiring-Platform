import { useCandidateStore } from '@/stores/candidate-response-store';
import { type Assessment } from '@/lib/database';
import { createAssessmentResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AssessmentFormProps {
    assessment: Assessment;
    setPreviewAssessmentId: React.Dispatch<React.SetStateAction<string | null>>;
}


export const AssessmentForm = ({ assessment, setPreviewAssessmentId }: AssessmentFormProps) => {
  const { responses, setResponse } = useCandidateStore();
  const { toast } = useToast();

  const handleChange = (questionId: string, value: any) => {
    setResponse(questionId, value);
  };

  const isQuestionVisible = (question: any) => {
    if (!question.condition) return true;
    const { questionId, value } = question.condition;
    return responses[questionId] === value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAssessmentResponse({
        assessmentId: assessment.id,
        candidateId: 'candidate-temp',
        responses,
        completedAt: new Date().toISOString(),
      });
      toast({
        title: 'Assessment Saved',
        description: 'Your assessment has been saved successfully',
      });
      setPreviewAssessmentId(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save assessment',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {assessment.sections.map((section) => (
        <div key={section.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
          <p className="text-sm text-gray-500 mb-6">{section.description}</p>

          <div className="space-y-6">
            {section.questions.map((q, qIndex) => {
              if (!isQuestionVisible(q)) return null;

              return (
                <div
                  key={q.id}
                  className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{`Q${qIndex + 1}: ${q.question}`}</span>
                    <span className="text-xs text-gray-400 capitalize">{q.type}</span>
                  </div>

                  {q.type === 'short-text' && (
                    <input
                      type="text"
                      value={responses[q.id] || ''}
                      maxLength={q.validation?.maxLength}
                      required={q.required}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  )}

                  {q.type === 'long-text' && (
                    <textarea
                      value={responses[q.id] || ''}
                      maxLength={q.validation?.maxLength}
                      required={q.required}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded h-24 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  )}

                  {q.type === 'numeric' && (
                    <input
                      type="number"
                      value={responses[q.id] || ''}
                      min={q.validation?.min}
                      max={q.validation?.max}
                      required={q.required}
                      onChange={(e) => handleChange(q.id, e.target.valueAsNumber)}
                      className="w-32 border border-gray-300 p-2 rounded focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  )}

                  {['single-choice', 'multi-choice'].includes(q.type) && (
                    <div className="space-y-2 mt-2">
                      {q.options?.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type={q.type === 'single-choice' ? 'radio' : 'checkbox'}
                            name={q.id}
                            value={opt}
                            checked={
                              q.type === 'single-choice'
                                ? responses[q.id] === opt
                                : responses[q.id]?.includes(opt)
                            }
                            required={q.required && q.type === 'single-choice'}
                            onChange={(e) => {
                              if (q.type === 'single-choice') handleChange(q.id, opt);
                              else {
                                const prev = responses[q.id] || [];
                                if (e.target.checked) handleChange(q.id, [...prev, opt]);
                                else handleChange(q.id, prev.filter((v: string) => v !== opt));
                              }
                            }}
                            className="accent-blue-500"
                          />
                          <span className="text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Responses
        </button>
      </div>
    </form>
  );
};