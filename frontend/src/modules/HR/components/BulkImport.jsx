import React, { useState } from "react";

function BulkImport({ onImport }) {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) return alert("Please select a CSV file first.");
    onImport(file);
    setFile(null);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload CSV
      </button>
    </div>
  );
}

export default BulkImport;
