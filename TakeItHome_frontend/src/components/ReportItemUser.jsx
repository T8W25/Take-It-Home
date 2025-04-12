import React, { useState } from "react";
import axios from "axios";

const ReportItemUser = ({ itemId, userId }) => {
  const [reportMessage, setReportMessage] = useState("");
  const [reportType, setReportType] = useState("item");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reportData = {
      reportType,
      itemId,
      userId,
      message: reportMessage,
    };

    try {
      await axios.post("https://take-it-home-8ldm.onrender.com/api/reports", reportData);
      alert("Report submitted successfully!");
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("There was an error submitting your report.");
    }
  };

  return (
    <div>
      <h2>Report {reportType === "item" ? "Item" : "User"}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={reportMessage}
          onChange={(e) => setReportMessage(e.target.value)}
          placeholder="Provide details about why you are reporting this item/user"
          required
        />
        <button type="submit">Submit Report</button>
      </form>
      <button onClick={() => setReportType(reportType === "item" ? "user" : "item")}>
        Report {reportType === "item" ? "User" : "Item"}
      </button>
    </div>
  );
};

export default ReportItemUser;
