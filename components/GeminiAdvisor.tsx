import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MonitoredFile } from '../types';

interface GeminiAdvisorProps {
  file: MonitoredFile;
  onClose: () => void;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ file, onClose }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeFile = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is not configured.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are a BIM Manager expert. Analyze this Revit file status:
        File Name: ${file.name}
        Size: ${file.sizeMB} MB
        Users Active: ${file.usersActive}
        Improper Local Lock: ${file.hasLocalLock ? "YES (Critical)" : "No"}

        Provide 3 short, actionable bullet points to optimize this file or solve the issue.
        Focus on Revit best practices (Audit, Purge, Compact, User discipline).
        Keep it under 100 words.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAnalysis(response.text || "No advice generated.");
    } catch (err: any) {
      console.error(err);
      setError("Failed to consult Gemini AI. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger analysis on mount if not already done
  React.useEffect(() => {
    analyzeFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="font-bold text-white">AI Health Advisor</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <p className="text-slate-400 text-sm">Analyzing: <span className="text-white font-medium">{file.name}</span></p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-indigo-400 animate-pulse text-sm">Consulting Gemini...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-lg text-sm border border-red-900/50">
              {error}
            </div>
          )}

          {!loading && !error && analysis && (
            <div className="prose prose-invert prose-sm">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 whitespace-pre-wrap text-slate-300 leading-relaxed">
                {analysis}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-950 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAdvisor;