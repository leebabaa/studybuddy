import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Sample quiz questions for each course
const quizQuestions = {
  DSA: [
    { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: "O(log n)" },
    { question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Tree"], answer: "Stack" },
    { question: "What is a binary tree?", options: ["Linear structure", "Nodes with at most 2 children", "Circular list", "Single node"], answer: "Nodes with at most 2 children" },
    { question: "What does DFS stand for?", options: ["Depth-First Search", "Data File System", "Dynamic Fast Search", "Depth File Structure"], answer: "Depth-First Search" },
    { question: "Which sorting algorithm is the fastest for large datasets?", options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Selection Sort"], answer: "Quick Sort" },
    { question: "What is a linked list?", options: ["Array of elements", "Nodes connected by pointers", "Tree structure", "Hash table"], answer: "Nodes connected by pointers" },
    { question: "What is the space complexity of a hash table?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: "O(n)" },
    { question: "Which algorithm finds the shortest path in a graph?", options: ["Dijkstra’s", "Bubble Sort", "Merge Sort", "Binary Search"], answer: "Dijkstra’s" },
    { question: "What is recursion?", options: ["Looping", "Function calling itself", "Sorting", "Searching"], answer: "Function calling itself" },
    { question: "What is a queue?", options: ["LIFO", "FIFO", "Random access", "Tree"], answer: "FIFO" },
  ],
  PYTHON: [
    { question: "What is Python’s primary use?", options: ["Web development", "Data analysis", "Game development", "All of the above"], answer: "All of the above" },
    { question: "Which keyword defines a function?", options: ["func", "def", "function", "define"], answer: "def" },
    { question: "What is a list in Python?", options: ["Immutable", "Ordered and mutable", "Key-value pairs", "Single value"], answer: "Ordered and mutable" },
    { question: "How do you handle exceptions?", options: ["if-else", "try-except", "while", "for"], answer: "try-except" },
    { question: "What does `len()` do?", options: ["Adds items", "Returns length", "Sorts list", "Removes items"], answer: "Returns length" },
    { question: "Which is a Python library?", options: ["React", "NumPy", "Bootstrap", "jQuery"], answer: "NumPy" },
    { question: "What is `self` in Python?", options: ["Variable", "Class instance", "Loop counter", "Function"], answer: "Class instance" },
    { question: "What does `print()` do?", options: ["Inputs data", "Outputs to console", "Sorts data", "Stores data"], answer: "Outputs to console" },
    { question: "How do you create a dictionary?", options: ["[]", "{}", "()", "<>"], answer: "{}" },
    { question: "What is a tuple?", options: ["Mutable list", "Immutable sequence", "Key-value pair", "Function"], answer: "Immutable sequence" },
  ],
  JAVA: [
    { question: "What is Java primarily known for?", options: ["Web apps", "Platform independence", "Mobile games", "Data science"], answer: "Platform independence" },
    { question: "Which keyword creates a class?", options: ["class", "def", "struct", "type"], answer: "class" },
    { question: "What is an interface?", options: ["Concrete class", "Abstract blueprint", "Variable", "Loop"], answer: "Abstract blueprint" },
    { question: "How do you handle exceptions in Java?", options: ["try-catch", "if-else", "while", "switch"], answer: "try-catch" },
    { question: "What does `public static void main` do?", options: ["Loop", "Entry point", "Variable", "Class"], answer: "Entry point" },
    { question: "Which is a Java collection?", options: ["ArrayList", "Python", "React", "CSS"], answer: "ArrayList" },
    { question: "What is polymorphism?", options: ["Single form", "Multiple forms", "Static data", "Linear code"], answer: "Multiple forms" },
    { question: "What does `extends` do?", options: ["Implements", "Inherits", "Loops", "Conditions"], answer: "Inherits" },
    { question: "What is a thread?", options: ["Execution path", "Variable", "Class", "Method"], answer: "Execution path" },
    { question: "What is `final` in Java?", options: ["Mutable", "Constant", "Loop", "Condition"], answer: "Constant" },
  ],
};

const CourseContent = () => {
  const { courseName } = useParams();
  const [activeSection, setActiveSection] = useState("Course Name");
  const [quizState, setQuizState] = useState({
    started: false,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    timeLeft: 600, // 10 minutes in seconds
    completed: false,
    score: 0,
  });
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // Normalize courseName to match quizQuestions keys (uppercase)
  const normalizedCourseName = courseName ? courseName.toUpperCase() : "";

  // Load stored score from localStorage on mount
  useEffect(() => {
    const storedScore = localStorage.getItem(`quizScore_${normalizedCourseName}`);
    setQuizState({
      started: false,
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      timeLeft: 600,
      completed: false,
      score: storedScore ? parseInt(storedScore, 10) : 0,
    });
  }, [normalizedCourseName]);

  // Generate 10 random quiz questions and update state in one go
  const startQuiz = () => {
    setIsQuizLoading(true);
    const allQuestions = quizQuestions[normalizedCourseName] || [];
    if (allQuestions.length === 0) {
      console.error(`No quiz questions found for course: ${normalizedCourseName}`);
      setIsQuizLoading(false);
      return;
    }
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuizState({
      started: true,
      questions: selected,
      currentQuestionIndex: 0,
      userAnswers: {},
      timeLeft: 600,
      completed: false,
      score: 0,
    });
    setIsQuizLoading(false);
  };

  // Timer countdown
  useEffect(() => {
    if (quizState.started && quizState.timeLeft > 0 && !quizState.completed) {
      const timer = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeLeft <= 1) {
            endQuiz();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    } else if (quizState.timeLeft === 0 && !quizState.completed) {
      endQuiz();
    }
  }, [quizState.started, quizState.timeLeft, quizState.completed]);

  // Handle answer selection
  const handleAnswer = (answer) => {
    setQuizState((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [prev.currentQuestionIndex]: answer,
      },
    }));
  };

  // Navigate to next question or end quiz
  const nextQuestion = () => {
    setQuizState((prev) => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      } else {
        endQuiz();
        return prev;
      }
    });
  };

  // End quiz, calculate score, and store it
  const endQuiz = () => {
    setQuizState((prev) => {
      let calculatedScore = 0;
      prev.questions.forEach((q, index) => {
        if (prev.userAnswers[index] === q.answer) {
          calculatedScore += 1;
        }
      });
      localStorage.setItem(`quizScore_${normalizedCourseName}`, calculatedScore);
      return { ...prev, completed: true, score: calculatedScore };
    });
  };

  // Format time left
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calculate percentage
  const getScorePercentage = () => {
    return quizState.score > 0 ? ((quizState.score / 10) * 100).toFixed(0) + "%" : "N/A";
  };

  return (
    <div className="d-flex min-vh-100 text-white" style={{ background: "linear-gradient(to bottom, black, #003300)" }}>
      {/* Sidebar Section */}
      <div
        className="d-flex flex-column p-4"
        style={{
          width: "250px",
          backgroundColor: "#222",
          minHeight: "100vh",
          boxShadow: "2px 0 5px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h5 className="text-center fw-bold mb-3">Course Navigation</h5>
        {["Course Name", "Course Material", "Quiz", "Notes", "Course Info"].map((item) => (
          <div
            key={item}
            className={`p-3 mb-2 text-center fw-bold rounded ${activeSection === item ? "active-section" : ""}`}
            style={{
              backgroundColor: activeSection === item ? "#198754" : "#0d6efd",
              color: "white",
              cursor: "pointer",
              transition: "background 0.3s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#198754")}
            onMouseOut={(e) => (e.target.style.backgroundColor = activeSection === item ? "#198754" : "#0d6efd")}
            onClick={() => setActiveSection(item)}
          >
            {item}
          </div>
        ))}
        {/* Score Display */}
        <div className="text-center mt-4">
          <span className="d-block fw-bold mb-2">Score</span>
          <div
            className="score-circle text-center fw-bold mx-auto"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "#198754",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            {getScorePercentage()}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-grow-1 d-flex flex-column justify-content-between p-4">
        {/* Course Content Window */}
        <div className="content-window flex-grow-1 bg-dark p-4 rounded">
          {activeSection === "Course Name" && (
            <h2 className="text-center fw-bold">{courseName} Content</h2>
          )}
          {activeSection === "Course Material" && (
            <h2 className="text-center fw-bold">Course Materials Coming Soon</h2>
          )}
          {activeSection === "Quiz" && !quizState.started && !quizState.completed && (
            <div className="d-flex flex-column justify-content-center align-items-center h-100">
              <h2 className="text-center fw-bold mb-4">Ready to Test Your Knowledge?</h2>
              <button
                className="btn btn-primary fw-bold px-4 py-2"
                onClick={startQuiz}
                style={{
                  backgroundColor: "#0d6efd",
                  transition: "background 0.3s ease-in-out",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#198754")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#0d6efd")}
              >
                Start Quiz
              </button>
            </div>
          )}
          {activeSection === "Quiz" && quizState.started && !quizState.completed && quizState.questions.length > 0 && !isQuizLoading && (
            <div className="quiz-container h-100 d-flex flex-column">
              <div className="d-flex justify-content-between mb-3">
                <h4>Quiz - Question {quizState.currentQuestionIndex + 1}/{quizState.questions.length}</h4>
                <div className="timer text-danger fw-bold">{formatTime(quizState.timeLeft)}</div>
              </div>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100}%` }}
                  aria-valuenow={(quizState.currentQuestionIndex + 1) / quizState.questions.length * 100}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="card bg-dark text-white p-4 flex-grow-1">
                <h5 className="mb-3">{quizState.questions[quizState.currentQuestionIndex]?.question}</h5>
                <div className="d-flex flex-column gap-2">
                  {quizState.questions[quizState.currentQuestionIndex]?.options.map((option, idx) => (
                    <label key={idx} className="form-check">
                      <input
                        type="radio"
                        name={`question-${quizState.currentQuestionIndex}`}
                        value={option}
                        checked={quizState.userAnswers[quizState.currentQuestionIndex] === option}
                        onChange={() => handleAnswer(option)}
                        className="form-check-input"
                      />
                      <span className="ms-2">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-primary mt-4 align-self-end"
                onClick={nextQuestion}
                disabled={!quizState.userAnswers[quizState.currentQuestionIndex]}
              >
                {quizState.currentQuestionIndex < quizState.questions.length - 1 ? "Next" : "Submit"}
              </button>
            </div>
          )}
          {activeSection === "Quiz" && quizState.completed && quizState.questions.length > 0 && (
            <div className="quiz-results text-center h-100 d-flex flex-column justify-content-center">
              <h2>Quiz Completed!</h2>
              <p className="mt-3">Your Score: {quizState.score} / {quizState.questions.length}</p>
              <p>Percentage: {((quizState.score / quizState.questions.length) * 100).toFixed(2)}%</p>
              <button
                className="btn btn-success mt-3"
                onClick={() => setQuizState((prev) => ({ ...prev, started: false, completed: false }))}
              >
                Retake Quiz
              </button>
            </div>
          )}
          {activeSection === "Quiz" && quizState.started && quizState.questions.length === 0 && (
            <h2 className="text-center fw-bold">No Quiz Available for {courseName}</h2>
          )}
          {activeSection === "Quiz" && isQuizLoading && (
            <h2 className="text-center fw-bold">Loading Quiz...</h2>
          )}
          {activeSection === "Notes" && (
            <h2 className="text-center fw-bold">Notes Coming Soon</h2>
          )}
          {activeSection === "Course Info" && (
            <h2 className="text-center fw-bold">Course Info Coming Soon</h2>
          )}
        </div>

        {/* Navigation Buttons (for non-quiz sections) */}
        {activeSection !== "Quiz" && (
          <div className="navigation d-flex justify-content-between px-5 py-3">
            <button
              className="fw-bold px-4 py-2 border-0 rounded"
              style={{
                backgroundColor: "#0d6efd",
                color: "white",
                transition: "background 0.3s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#198754")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#0d6efd")}
            >
              Prev
            </button>
            <button
              className="fw-bold px-4 py-2 border-0 rounded"
              style={{
                backgroundColor: "#0d6efd",
                color: "white",
                transition: "background 0.3s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#198754")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#0d6efd")}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Inline Styles */}
      <style>{`
        .content-window {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 0;
        }
        .quiz-container {
          width: 100%;
        }
        .form-check-input:checked {
          background-color: #198754;
          border-color: #198754;
        }
        .active-section {
          background-color: #198754 !important;
        }
        .score-circle {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CourseContent;