import React from "react";

export default function About() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About SmartTutor</h1>
      <p style={styles.text}>
        SmartTutor is an AI-powered doubt-solving platform where users can ask questions 
        and get instant answers. It is designed to help students and professionals learn 
        faster and more effectively.
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
    color: "#007bff",
  },
  text: {
    fontSize: "18px",
    color: "#555",
    maxWidth: "600px",
    margin: "0 auto",
  },
};
