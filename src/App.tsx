/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Clock, 
  CalendarCheck, 
  BarChart3, 
  Send, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Loader2
} from 'lucide-react';

interface Prediction {
  prediction: string;
  confidence: number;
}

export default function App() {
  const [formData, setFormData] = useState({
    attendance: '',
    study_hours: '',
    previous_score: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance: parseFloat(formData.attendance),
          study_hours: parseFloat(formData.study_hours),
          previous_score: parseFloat(formData.previous_score),
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed. Is the backend running?');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ attendance: '', study_hours: '', previous_score: '' });
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl mb-4 shadow-lg"
          >
            <GraduationCap size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tight mb-2"
          >
            Academic Performance Predictor
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-500 max-w-md mx-auto"
          >
            Leverage machine learning to predict student outcomes based on academic engagement and history.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-200"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              Student Data
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                  <CalendarCheck size={16} />
                  Attendance Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  placeholder="e.g. 85"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.attendance}
                  onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  Weekly Study Hours
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 20"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.study_hours}
                  onChange={(e) => setFormData({...formData, study_hours: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                  <BarChart3 size={16} />
                  Previous Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  placeholder="e.g. 75"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.previous_score}
                  onChange={(e) => setFormData({...formData, previous_score: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={20} />
                    Predict Result
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Result Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!result && !error && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-neutral-100/50 rounded-3xl border-2 border-dashed border-neutral-200"
                >
                  <BarChart3 size={48} className="text-neutral-300 mb-4" />
                  <p className="text-neutral-500">Enter student details and click predict to see the analysis.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-neutral-200 shadow-sm"
                >
                  <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
                  <p className="text-neutral-600 font-medium">Analyzing data patterns...</p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 p-8 rounded-3xl border border-red-100"
                >
                  <div className="flex items-center gap-3 text-red-600 mb-4">
                    <AlertCircle size={24} />
                    <h3 className="font-bold text-lg">Prediction Error</h3>
                  </div>
                  <p className="text-red-700 mb-6">{error}</p>
                  <button 
                    onClick={handleReset}
                    className="text-red-600 font-medium flex items-center gap-2 hover:underline"
                  >
                    <RefreshCcw size={16} />
                    Try Again
                  </button>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-neutral-200 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 p-4 ${result.prediction === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>
                    {result.prediction === 'Pass' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                  </div>

                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-1">Prediction Result</h3>
                  <div className={`text-5xl font-black mb-6 ${result.prediction === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                    {result.prediction}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-neutral-600">Confidence Score</span>
                        <span className="text-sm font-bold text-neutral-900">{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${result.prediction === 'Pass' ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                      </div>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-xl">
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        This prediction is based on synthetic data trained with scikit-learn. Factors like attendance and study hours have weighted impact on the outcome.
                      </p>
                    </div>

                    <button 
                      onClick={handleReset}
                      className="w-full mt-4 py-2 border border-neutral-200 text-neutral-600 font-medium rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCcw size={16} />
                      New Prediction
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

