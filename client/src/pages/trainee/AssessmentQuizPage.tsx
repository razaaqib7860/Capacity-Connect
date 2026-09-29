import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CertificateModal } from '../../components/CertificateModal';
import { 
  CheckSquare, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const AssessmentQuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    if (id) fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const res = await api.getAssessment(id!);
      setAssessment(res);
    } catch (err) {
      console.error('Error loading assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (result) return; // Locked if submitted
    setSelectedAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!assessment) return;

    const answersArray = (assessment.questions || []).map((_: any, idx: number) => 
      selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
    );

    setSubmitting(true);
    try {
      const res = await api.submitAssessment(id!, answersArray);
      setResult(res);
      if (res.passed && res.certificate) {
        setShowCertModal(true);
      }
    } catch (err: any) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-teal-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Initializing MCQ Assessment...
      </div>
    );
  }

  const questions = assessment?.questions || [];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2.5 py-1 rounded font-mono border border-teal-500/30">
            {assessment?.subject || 'Subject MCQ Assessment'}
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">{assessment?.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Course: <strong className="text-white">{assessment?.course?.title || 'AWS Foundations'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-300 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Clock className="w-4 h-4" /> {assessment?.durationMinutes || 20} Mins
          </div>
          <div className="border-l border-slate-800 pl-4">
            Pass Threshold: <strong className="text-teal-400">{assessment?.passPercentage || 70}%</strong>
          </div>
        </div>
      </div>

      {/* RESULT MODAL BANNER AFTER SUBMISSION */}
      {result && (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 ${result.passed ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/40 border-rose-500/40 text-rose-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              {result.passed ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-10 h-10 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="text-xs font-mono tracking-widest uppercase font-bold text-slate-300">ASSESSMENT RESULT</span>
                <h2 className="text-2xl font-extrabold text-white">
                  {result.passed ? 'PASSED SUCCESSFUL' : 'NEEDS IMPROVEMENT'}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-black text-white font-mono">
                {result.score} / {result.totalMarks}
              </div>
              <span className="text-xs text-teal-400 font-mono font-bold">
                Percentage: {result.percentage}%
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-300">
            {result.passed 
              ? 'Congratulations! You passed the subject assessment. Your trainee competency profile and current skill scores have been updated, and an official verified certificate was generated.'
              : 'You did not reach the passing threshold of 70%. Review the recorded lectures and study materials before re-attempting.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {result.passed && result.certificate && (
              <button
                onClick={() => setShowCertModal(true)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow flex items-center gap-2 transition"
              >
                <Award className="w-4 h-4" /> View Official Certificate
              </button>
            )}
            <Link
              to="/trainee/competencies"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
            >
              View Updated Competency Matrix <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* QUESTIONS LIST */}
      <div className="space-y-6">
        {questions.map((q: any, qIdx: number) => {
          const selectedOpt = selectedAnswers[qIdx];

          return (
            <div key={q._id || qIdx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-teal-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  Question {qIdx + 1} of {totalQuestions}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {q.marks || 20} Marks
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {q.questionText}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {(q.options || []).map((opt: string, optIdx: number) => {
                  const isSelected = selectedOpt === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={!!result}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition flex items-center justify-between ${isSelected ? 'bg-teal-500/20 border-teal-500 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold ${isSelected ? 'bg-teal-500 border-teal-400 text-slate-950' : 'border-slate-700 text-slate-400'}`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBMIT BUTTON */}
      {!result && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Answered {answeredCount} of {totalQuestions} questions
          </span>

          <button
            onClick={handleSubmitQuiz}
            disabled={submitting || answeredCount === 0}
            className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <FileCheck className="w-4 h-4" /> {submitting ? 'Evaluating Quiz...' : 'Submit Assessment Answers'}
          </button>
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {showCertModal && result?.certificate && (
        <CertificateModal
          certificate={result.certificate}
          onClose={() => setShowCertModal(false)}
        />
      )}

    </div>
  );
};
