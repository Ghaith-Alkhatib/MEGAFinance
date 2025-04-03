import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react"; 
import Layout from "../components/Layout";

interface Instructor {
  instructorID: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Omit<Instructor, 'instructorID'> & { 
    instructorID: number;
    isUpdate: boolean 
  }>({
    instructorID: 0,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isUpdate: false,
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<Instructor[]>(
        "https://megaverse.runasp.net/api/Instructor/GetInstructors"
      );
      setInstructors(response.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      setError("Failed to fetch instructors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateInstructor = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        instructorID: formData.instructorID,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      };

      await axios.post<Instructor>(
        "https://megaverse.runasp.net/api/Instructor/AddOrUpdateInstructor",
        payload
      );
      fetchInstructors();
      setShowModal(false);
      setFormData({
        instructorID: 0,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        isUpdate: false,
      });
    } catch (error) {
      console.error("Error saving instructor:", error);
      setError("Failed to save instructor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstructor = async (id: number) => {
    setLoading(true);
    setError("");

    try {
      await axios.delete(
        `https://megaverse.runasp.net/api/Instructor/DeleteInstructor/${id}`
      );
      fetchInstructors();
    } catch (error) {
      console.error("Error deleting instructor:", error);
      setError("Failed to delete instructor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setFormData({
      ...instructor,
      isUpdate: true,
    });
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Instructors Management</h2>
            <button
              className="flex items-center gap-2 bg-[#3CD2F9] text-white px-5 py-3 rounded-lg shadow-md 
                     hover:bg-[#32B7E3] transition duration-200 font-semibold"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} /> Add Instructor
            </button>
          </div>

          {loading && <p className="text-blue-500">Loading instructors...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">First Name</th>
                <th className="border p-2">Last Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.instructorID} className="text-center">
                  <td className="border p-2">{instructor.instructorID}</td>
                  <td className="border p-2">{instructor.firstName}</td>
                  <td className="border p-2">{instructor.lastName}</td>
                  <td className="border p-2">{instructor.email}</td>
                  <td className="border p-2">{instructor.phoneNumber}</td>
                  <td className="border p-2 flex justify-center space-x-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditInstructor(instructor)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteInstructor(instructor.instructorID)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">
                {formData.isUpdate ? "Update Instructor" : "Add Instructor"}
              </h2>

              <input
                type="text"
                placeholder="First Name"
                className="border p-2 w-full mb-2"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border p-2 w-full mb-2"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full mb-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="border p-2 w-full mb-2"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      instructorID: 0,
                      firstName: "",
                      lastName: "",
                      email: "",
                      phoneNumber: "",
                      isUpdate: false,
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                  onClick={handleAddOrUpdateInstructor}
                  disabled={loading}
                >
                  {loading ? "Processing..." : formData.isUpdate ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Instructors;