import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Download } from "lucide-react";
import Layout from "../components/Layout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../images/MEGALogolight.png'; // استيراد الصورة

interface Revenue {
  revenueID: number;
  amount: number;
  revenueDate: string;
  description: string;
  relatedEntityID: number | null;
  RevenueTypeId: number;
  revenueTypeName: string;
  currency: number;
  currencyName: string;
  relatedEntityName: string;
}

interface Course {
  courseID: number;
  courseName: string;
}

const Revenues: React.FC = () => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState({
    revenueType: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    sortOrder: "asc",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    revenueID: 0,
    revenueType: 1, // Default to Course
    amount: 0,
    revenueDate: new Date().toISOString().split("T")[0],
    description: "",
    relatedEntityID: null as number | null,
    currency: 2, // Default to JOD (assuming 1=USD, 2=JOD based on modal options)
    isUpdate: false,
  });

  useEffect(() => {
    fetchRevenues();
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchRevenues();
  }, [filters]);

  const fetchRevenues = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );
      const response = await axios.post(
        "https://megaverse.runasp.net/api/Revenue/GetRevenues",
        payload
      );
      // Apply type assertion here
      setRevenues(response.data as Revenue[]);
    } catch (error) {
      console.error("Error fetching revenues:", error);
      setError("Failed to fetch revenues. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.post(
        "https://megaverse.runasp.net/api/Course/GetCourses",
        {}
      );
      // Apply type assertion here
      setCourses(response.data as Course[]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleAddOrUpdateRevenue = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("FormData before creating payload:", formData); // Debugging line

      const payload = {
        revenueID: formData.revenueID,
        amount: formData.amount,
        revenueDate: formData.revenueDate,
        description: formData.description,
        relatedEntityID: formData.relatedEntityID,
        revenueType: formData.revenueType, // تأكد من إرسال revenueType
        currency: formData.currency, // تأكد من إرسال currency
        isUpdate: formData.isUpdate,
      };

      console.log("Payload being sent:", payload); // Debugging line

      await axios.post(
        "https://megaverse.runasp.net/api/Revenue/AddOrUpdateRevenue",
        payload
      );
      fetchRevenues();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving revenue:", error);
      setError("Failed to save revenue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRevenue = async (id: number) => {
    setLoading(true);
    setError("");

    try {
      await axios.delete(
        `https://megaverse.runasp.net/api/Revenue/DeleteRevenue/${id}`
      );
      fetchRevenues();
    } catch (error) {
      console.error("Error deleting revenue:", error);
      setError("Failed to delete revenue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      revenueID: 0,
      revenueType: 1,
      amount: 0,
      revenueDate: new Date().toISOString().split("T")[0],
      description: "",
      relatedEntityID: null,
      currency: 2, // Reset to JOD
      isUpdate: false,
    });
  };

  const handleEditRevenue = (revenue: Revenue) => {
    console.log("Editing Revenue:", revenue);
    setFormData({
      revenueID: revenue.revenueID,
      revenueType: revenue.RevenueTypeId || 1, // Fallback to Course
      amount: revenue.amount,
      revenueDate: revenue.revenueDate.split("T")[0],
      description: revenue.description,
      relatedEntityID: revenue.relatedEntityID,
      currency: revenue.currency || 2, // Fallback to JOD
      isUpdate: true,
    });
    setShowModal(true);
  };

  const handleSort = () => {
    const newOrder = filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters({ ...filters, sortOrder: newOrder });
    // Note: Consider if sorting should be handled by API or reapplied after fetch
    setRevenues((prev) =>
      [...prev].sort((a, b) =>
        newOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      )
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const imgWidth = 15;
    const imgHeight = 15;
    // Ensure logo is loaded correctly or handle potential error
    try {
      if (logo) {
         doc.addImage(logo, 'PNG', 15, 10, imgWidth, imgHeight);
      } else {
        console.warn("Logo image not loaded for PDF generation.");
      }
    } catch (imgError) {
        console.error("Error adding image to PDF:", imgError);
    }


    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MEGAcerse Academy Revenues", 58, 20); // تعديل الموقع حسب الحاجة

    const today = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(today);
    doc.text(today, pageWidth - textWidth - 10, 20);

    // إعداد الجدول
    const headers = [
      "Type",
      "Amount",
      "Currency",
      "Date",
      "Description",
      "Related Entity",
    ];
    const data = revenues.map((rev) => [
      rev.revenueTypeName,
      rev.amount,
      rev.currencyName,
      new Date(rev.revenueDate).toLocaleDateString(),
      rev.description,
      rev.relatedEntityName || "N/A",
    ]);

    // حساب مجموع العمود "Amount"
    const totalAmount = revenues.reduce((sum, rev) => sum + rev.amount, 0);

    // إضافة صف المجموع إلى البيانات (Consider using autoTable footer option for better structure)
    data.push(["Total Amount", totalAmount.toFixed(2), "", "", "", ""]); // Added toFixed(2) for currency format

    // إضافة الجدول إلى الـ PDF
    autoTable(doc, {
      startY: 30, // بدء الجدول بعد الصورة والنص
      head: [headers],
      body: data,
      // Example of using footer:
      // showFoot: 'lastPage',
      // footStyles: { fontWeight: 'bold' },
      // foot: [['Total Amount', totalAmount.toFixed(2), '', '', '', '']]
    });

    // حفظ الـ PDF
    doc.save("revenues.pdf");
  };


  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Revenues Management</h2>
            <button
              className="flex items-center bg-[#3CD2F9] text-white px-5 py-3 rounded-lg shadow-md hover:bg-[#32B7E3] transition duration-200 font-semibold"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} /> Add Revenue
            </button>
          </div>

          <div className="filters flex flex-wrap gap-4 mb-4">
            <select
              className="border p-2 rounded"
              value={filters.revenueType}
              onChange={(e) =>
                setFilters({ ...filters, revenueType: e.target.value })
              }
            >
              <option value="">Select Revenue Type</option>
              <option value="1">Course</option>
              <option value="2">Event</option>
              <option value="3">Activity</option>
            </select>
            <input
              type="date"
              className="border p-2 rounded"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              placeholder="Start Date"
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              placeholder="End Date"
            />
            <input
              type="number"
              className="border p-2 rounded"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
              placeholder="Min Amount"
              min="0" // Optional: prevent negative numbers
            />
            <input
              type="number"
              className="border p-2 rounded"
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
              placeholder="Max Amount"
              min="0" // Optional: prevent negative numbers
            />
            <button
              className="flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300"
              onClick={handleSort}
            >
              Sort by Amount {filters.sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </button>
            <button
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={generatePDF}
              disabled={loading || revenues.length === 0} // Disable if loading or no data
            >
              <Download size={16} className="mr-1" /> Generate PDF
            </button>
          </div>

          {loading && <p className="text-blue-500 text-center my-4">Loading revenues...</p>}
          {error && <p className="text-red-500 text-center my-4 bg-red-100 p-2 rounded">{error}</p>}

          {!loading && !error && revenues.length === 0 && (
             <p className="text-gray-500 text-center my-4">No revenues found matching the criteria.</p>
          )}

          {revenues.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border p-2">Type</th>
                      <th className="border p-2">Amount</th>
                      <th className="border p-2">Currency</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Related Entity</th>
                      <th className="border p-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenues.map((revenue) => (
                      <tr key={revenue.revenueID} className="hover:bg-gray-50">
                        <td className="border p-2">{revenue.revenueTypeName}</td>
                        <td className="border p-2">{revenue.amount.toFixed(2)}</td> {/* Display currency format */}
                        <td className="border p-2">{revenue.currencyName}</td>
                        <td className="border p-2">
                          {new Date(revenue.revenueDate).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{revenue.description}</td>
                        <td className="border p-2">{revenue.relatedEntityName || "N/A"}</td>
                        <td className="border p-2">
                           <div className="flex justify-center items-center space-x-2">
                             <button
                               className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                               title="Edit Revenue"
                               onClick={() => handleEditRevenue(revenue)}
                               disabled={loading} // Disable while other actions are loading
                             >
                               <Pencil size={16} />
                             </button>
                             <button
                               className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                               title="Delete Revenue"
                               onClick={() => handleDeleteRevenue(revenue.revenueID)}
                               disabled={loading} // Disable while other actions are loading
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

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {formData.isUpdate ? "Update Revenue" : "Add Revenue"}
              </h2>
              <div className="space-y-3">
                  <select
                    className="border p-2 w-full mb-2 rounded"
                    value={formData.revenueType}
                    onChange={(e) =>
                      setFormData({ ...formData, revenueType: Number(e.target.value), relatedEntityID: null }) // Reset related entity when type changes
                    }
                  >
                    <option value="1">Course</option>
                    <option value="2">Event</option>
                    <option value="3">Activity</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    className="border p-2 w-full mb-2 rounded"
                    value={formData.amount}
                    onChange={(e) =>
                      // Ensure positive number
                      setFormData({ ...formData, amount: Math.max(0, Number(e.target.value)) })
                    }
                    min="0"
                    step="0.01" // Allow decimals for currency
                  />
                  <select
                    className="border p-2 w-full mb-2 rounded"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: Number(e.target.value) })
                    }
                  >
                    <option value="1">USD</option>
                    <option value="2">JOD</option>
                  </select>
                  <input
                    type="date"
                    className="border p-2 w-full mb-2 rounded"
                    value={formData.revenueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, revenueDate: e.target.value })
                    }
                    max={new Date().toISOString().split("T")[0]} // Prevent future dates
                  />
                  <textarea
                    placeholder="Description"
                    className="border p-2 w-full mb-2 rounded"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                  {formData.revenueType === 1 && ( // Only show if type is Course
                    <select
                      className="border p-2 w-full mb-2 rounded"
                      value={formData.relatedEntityID || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          // Handle empty string value from "Select Course" option
                          relatedEntityID: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.courseID} value={course.courseID}>
                          {course.courseName}
                        </option>
                      ))}
                    </select>
                  )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                  onClick={handleAddOrUpdateRevenue}
                  disabled={loading || !formData.amount || (formData.revenueType === 1 && !formData.relatedEntityID)} // Basic validation example
                >
                  {loading ? "Saving..." : (formData.isUpdate ? "Update" : "Add")}
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Revenues;