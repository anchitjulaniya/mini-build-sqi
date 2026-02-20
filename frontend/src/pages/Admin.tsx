import { useState } from "react";
import axios from "axios";
const url = "https://mini-build-sqi.onrender.com";

export default function Admin() {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState("");
  const [result, setResult] = useState<any>(null);

  const savePrompt = () => {
    localStorage.setItem("diagnosticPrompt", prompt);
    alert("Prompt Saved");
  };

  const computeSQI = async () => {
  try {
    if (!data.trim()) {
      alert("Please paste student attempt JSON");
      return;
    }

    const parsed = JSON.parse(data);

    const res = await axios.post(
      "https://mini-build-sqi.onrender.com/api/sqi/compute",
      parsed
    );

    setResult(res.data);
  } catch (error) {
    alert("Invalid JSON format. Please check your input.");
    console.error(error);
  }
};

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary-customizer-payload.json";
    a.click();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Console</h1>

      <textarea
        placeholder="Paste Diagnostic Prompt"
        className="border w-full p-3 mb-3"
        rows={4}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={savePrompt}
        className="bg-green-500 text-white px-4 py-2 rounded mb-6"
      >
        Save Prompt
      </button>

      <textarea
        placeholder="Paste Student Attempt JSON"
        className="border w-full p-3 mb-3"
        rows={8}
        onChange={(e) => setData(e.target.value)}
      />

      <button
        onClick={computeSQI}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Compute SQI
      </button>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">
            Overall SQI: {result.overallSQI}
          </h2>

          <pre className="bg-gray-100 p-3 mt-3 overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>

          <div className="flex gap-3 mt-4">
            <button
              onClick={downloadJSON}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Download JSON
            </button>
            <button
              onClick={() =>(
                navigator.clipboard.writeText(
                  JSON.stringify(result, null, 2))
              )
              }
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Copy JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}