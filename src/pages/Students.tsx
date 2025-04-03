import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Layout from "../components/Layout";

interface Student {
  studentID: number;
  fullName: string;
  fullNameInArabic: string;
  address: string;
  email: string;
  phoneNumber: string;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    studentID: 0,
    fullName: "",
    fullNameInArabic: "",
    address: "",
    email: "",
    phoneNumber: "",
    isUpdate: false,
  });
  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
    fullNameInArabic: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // Fetch students initially with empty filters
    fetchStudents({}); // Fetch all initially or based on default filters if any
  }, []); // Run only once on mount

  useEffect(() => {
    // Debounce fetching logic could be added here for better performance
    const handler = setTimeout(() => {
      fetchStudents(filters);
    }, 500); // Example: wait 500ms after last filter change

    return () => {
      clearTimeout(handler); // Cleanup timeout on unmount or filter change
    };
  }, [filters]); // Re-fetch when filters change (with debounce)


  const fetchStudents = async (currentFilters: object) => {
    setLoading(true);
    setError("");
    // Filter out empty string values from the filters object before sending
    const activeFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, value]) => value !== "")
    );
    try {
      const response = await axios.post(
        "https://megaverse.runasp.net/api/Student/GetStudentsByFilter",
        activeFilters // Send only active filters
      );
      // Apply type assertion here
      setStudents(response.data as Student[]);
    } catch (error) {
      console.error("Error fetching students:", error); // Log the actual error
      setError("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateStudent = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "https://megaverse.runasp.net/api/Student/AddOrUpdateStudent",
        formData
      );
      fetchStudents(filters); // Refetch with current filters to update the list
      handleCloseModal(); // Use a separate function to close modal and reset form
    } catch (error) {
      console.error("Error saving student:", error); // Log the actual error
      // Provide more specific error if possible (e.g., from response)
      setError("Failed to save student. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    // Optional: Add confirmation dialog before deleting
    if (!window.confirm(`Are you sure you want to delete student ID ${id}?`)) {
        return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.delete(
        `https://megaverse.runasp.net/api/Student/DeleteStudent/${id}`
      );
      // Refetch students after successful deletion
      fetchStudents(filters);
      // Optionally close modal if the deleted student was being edited
      if (formData.studentID === id) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error deleting student:", error); // Log the actual error
      setError("Failed to delete student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to open the modal for adding
  const handleAddStudentClick = () => {
    setFormData({ // Reset form data for adding
      studentID: 0,
      fullName: "",
      fullNameInArabic: "",
      address: "",
      email: "",
      phoneNumber: "",
      isUpdate: false,
    });
    setShowModal(true);
  };

  // Function to open the modal for editing
  const handleEditStudentClick = (student: Student) => {
      setFormData({ ...student, isUpdate: true });
      setShowModal(true);
  };

  // Function to close modal and reset form
  const handleCloseModal = () => {
      setShowModal(false);
      setFormData({
          studentID: 0,
          fullName: "",
          fullNameInArabic: "",
          address: "",
          email: "",
          phoneNumber: "",
          isUpdate: false,
      });
      setError(""); // Clear previous form errors
  };

  // Handler for filter input changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFilters(prevFilters => ({
          ...prevFilters,
          [name]: value
      }));
  };


  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Students Management</h2>
            <button
              className="flex items-center gap-2 bg-[#3CD2F9] text-white px-5 py-3 rounded-lg shadow-md hover:bg-[#32B7E3] transition duration-200 font-semibold"
              onClick={handleAddStudentClick}
            >
              <Plus size={20} /> Add Student
            </button>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded bg-gray-50">
            <input
              type="text"
              name="fullName" // Add name attribute for handler
              placeholder="Filter by Full Name"
              className="border p-2 rounded"
              value={filters.fullName}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="fullNameInArabic" // Add name attribute
              placeholder="Filter by Name (Arabic)"
              className="border p-2 rounded"
              value={filters.fullNameInArabic}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="email" // Add name attribute
              placeholder="Filter by Email"
              className="border p-2 rounded"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="phoneNumber" // Add name attribute
              placeholder="Filter by Phone"
              className="border p-2 rounded"
              value={filters.phoneNumber}
              onChange={handleFilterChange}
            />
             <input
              type="text"
              name="address" // Add name attribute
              placeholder="Filter by Address"
              className="border p-2 rounded"
              value={filters.address}
              onChange={handleFilterChange}
            />
          </div>

          {/* Loading and Error Display */}
          {loading && <p className="text-blue-500 text-center my-4">Loading students...</p>}
          {error && !showModal && <p className="text-red-500 text-center my-4 bg-red-100 p-2 rounded">{error}</p>} {/* Show general error only when modal is closed */}
          {!loading && !error && students.length === 0 && (
              <p className="text-gray-500 text-center my-4">No students found matching the criteria.</p>
          )}

          {/* Students Table */}
          {students.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Full Name</th>
                    <th className="border p-2">Full Name (Arabic)</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Phone</th>
                    <th className="border p-2">Address</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentID} className="hover:bg-gray-50">
                      <td className="border p-2">{student.studentID}</td>
                      <td className="border p-2">{student.fullName}</td>
                      <td className="border p-2">{student.fullNameInArabic}</td>
                      <td className="border p-2">{student.email}</td>
                      <td className="border p-2">{student.phoneNumber}</td>
                      <td className="border p-2">{student.address}</td>
                      <td className="border p-2">
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                                title="Edit Student"
                                onClick={() => handleEditStudentClick(student)}
                                disabled={loading}
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                title="Delete Student"
                                onClick={() => handleDeleteStudent(student.studentID)}
                                disabled={loading}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Update Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {formData.isUpdate ? "Update Student" : "Add Student"}
              </h2>
              {/* Display form-specific error inside modal */}
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="border p-2 w-full rounded"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Full Name (Arabic)"
                    className="border p-2 w-full rounded"
                    value={formData.fullNameInArabic}
                    onChange={(e) =>
                      setFormData({ ...formData, fullNameInArabic: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="border p-2 w-full rounded"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full rounded"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <input
                    // Consider type="tel" for better mobile usability
                    type="text"
                    placeholder="Phone Number"
                    className="border p-2 w-full rounded"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                  onClick={handleCloseModal} // Use the dedicated close function
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
                  onClick={handleAddOrUpdateStudent}
                  disabled={loading || !formData.fullName || !formData.email} // Example basic validation
                >
                   {loading ? "Saving..." : (formData.isUpdate ? "Update" : "Add")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Students;