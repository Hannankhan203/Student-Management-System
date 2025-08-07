import React, { useState, useEffect } from "react";
import {
  db,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  collection,
} from "../../firebase";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentData = [];

      querySnapshot.forEach((doc) => {
        studentData.push({ id: doc.id, ...doc.data() });
      });

      setStudents(studentData);
    } catch (err) {
      setError("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  }

  const addStudent = async (e) => {
    e.preventDefault();

    const emailExist = students.some((student) => student.email === email);
    if (emailExist) {
      setError("Student with this email already exist");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await addDoc(collection(db, "students"), {
        name,
        email,
        age: Number(age),
        fatherName,
        createdAt: new Date(),
      });

      setName("");
      setEmail("");
      setAge("");
      setFatherName("");
      await fetchStudents();
    } catch (err) {
      setError("Failed to add student");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      setIsLoading(true);
      await deleteDoc(doc(db, "students", studentId));
      await fetchStudents();
    } catch (err) {
      setError("Failed to delete student");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Student Attendance System</h1>
      <form action="" onSubmit={addStudent} className="student-form">
        <h2>Add New Student</h2>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            placeholder="Age"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="5"
            max="25"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fathername">Father's Name:</label>
          <input
            type="text"
            placeholder="Father's Name"
            id="fathername"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            required
          />
        </div>

        <button className="add-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Student"}
        </button>
      </form>

      <div className="student-list">
        <h2>Student Records</h2>
        {isLoading && students.length === 0 ? (
          <p className="loading">Loading Students...</p>
        ) : students.length === 0 ? (
          <p className="no-student">No students fount</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Father's Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>{student.fatherName}</td>
                  <td>
                    <button
                      className="del-btn"
                      onClick={() => deleteStudent(student.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
