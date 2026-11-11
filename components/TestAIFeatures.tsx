import React, { useState } from 'react';
import { generateSummary, calculateTriageRisk } from '../services/geminiService';

export const TestAIFeatures: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testDischargeSummary = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult('');
    
    try {
      const testNotes = "Patient presented with acute chest pain. ECG showed ST elevation. Diagnosed with Acute Myocardial Infarction. Admitted to CCU, treated with thrombolytics. Condition stable. Discharged with advice for cardiac rehab and medication adherence.";
      const result = await generateSummary(testNotes);
      setTestResult(`Discharge Summary Test Result:\n${result}`);
    } catch (e) {
      setError('Failed to generate discharge summary: ' + (e as Error).message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const testTriageRisk = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult('');
    
    try {
      const result = await calculateTriageRisk("Severe chest pain radiating to left arm", 45, "Male");
      setTestResult(`Triage Risk Test Result:\nRisk Score: ${result.score}\nJustification: ${result.justification}`);
    } catch (e) {
      setError('Failed to calculate triage risk: ' + (e as Error).message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-srm-darkgray mb-4">AI Features Test</h2>
      <p className="text-gray-600 mb-6">
        This page tests if the Gemini API is properly configured and working.
      </p>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={testDischargeSummary}
          disabled={isLoading}
          className="bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Testing...' : 'Test Discharge Summary'}
        </button>
        
        <button
          onClick={testTriageRisk}
          disabled={isLoading}
          className="bg-srm-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Testing...' : 'Test Triage Risk'}
        </button>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-srm-blue"></div>
          <p className="ml-4 font-semibold">Testing AI features...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
          <p className="font-semibold">Test Result:</p>
          <pre className="whitespace-pre-wrap mt-2">{testResult}</pre>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="font-semibold text-blue-800">Information:</p>
        <p className="text-blue-700 mt-1">
          If the tests are successful, it means your API key is properly configured and the AI features are working.
          If you see mock data or error messages, please check your API key configuration.
        </p>
      </div>
    </div>
  );
};