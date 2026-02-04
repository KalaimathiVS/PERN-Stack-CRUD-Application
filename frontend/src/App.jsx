import { useEffect, useState } from "react";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { API_URL } from "./api.js";

function App() {
  const [employee_code, setEmployee_code] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [date_of_birth, setdate_of_birth] = useState("");
  const [date_of_joining, setdate_of_joining] = useState("");
  const [department, setdepartment] = useState("");
  const [designation, setdesignation] = useState("");
  const [reporting_manager_id, setreporting_manager_id] = useState("");
  const [status, setstatus] = useState("");

  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  const [editedEmployee_code, setEditedEmployee_code] = useState("");
  const [editedfirst_name, setEditedfirst_name] = useState("");
  const [editedlast_name, setEditedlast_name] = useState("");
  const [editedemail, setEditedemail] = useState("");
  const [editedphone_number, setEditedphone_number] = useState("");
  const [editeddate_of_birth, setEditeddate_of_birth] = useState("");
  const [editeddate_of_joining, setEditeddate_of_joining] = useState("");
  const [editeddepartment, setEditeddepartment] = useState("");
  const [editeddesignation, setEditeddesignation] = useState("");
  const [editedreporting_manager_id, setEditedreporting_manager_id] = useState("");
  const [editedstatus, setEditedstatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch {
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {getTodos();}, []);
 
  // For Delete
const handleDelete = async (employee_id) => {
  console.log("DELETING EMPLOYEE ID 👉", employee_id);

  try {
    await axios.delete(`${API_URL}/todos/${employee_id}`);

    // remove deleted employee from UI immediately
    setTodos(todos.filter(todo => todo.employee_id !== employee_id));
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Delete failed. Employee may be referenced as Manager.");
  }
};

const handleEdit = (todo) => {
  setEditingTodo(todo.employee_id);
  setEditedEmployee_code(todo.employee_code);
  setEditedfirst_name(todo.first_name);
  setEditedlast_name(todo.last_name);
  setEditedemail(todo.email);
  setEditedphone_number(todo.phone_number);
  setEditeddate_of_birth(todo.date_of_birth);
  setEditeddate_of_joining(todo.date_of_joining);
  setEditeddepartment(todo.department);
  setEditeddesignation(todo.designation);
  setEditedreporting_manager_id(todo.reporting_manager_id);
  setEditedstatus(todo.status);
};
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/todos`, {
        employee_code,
        first_name,
        last_name,
        email,
        phone_number,
        date_of_birth,
        date_of_joining,
        department,
        designation,
        reporting_manager_id,
        status,
      });
      setTodos([...todos, res.data]);
    } catch {
      setError("Failed to add details");
    }
  };
  const handleUpdate = async (employee_id) => {
    console.log("UPDATING EMPLOYEE ID 👉", employee_id);
    try {
      await axios.put(`${API_URL}/todos/${employee_id}`, {
        employee_code: editedEmployee_code,
        first_name: editedfirst_name,
        last_name: editedlast_name,
        email: editedemail,
        phone_number: editedphone_number,
        date_of_birth: editeddate_of_birth,
        date_of_joining: editeddate_of_joining,
        department: editeddepartment,
        designation: editeddesignation,
        
        //Convert string into Number to get Edit button working
        reporting_manager_id:
        editedreporting_manager_id === ""? null: Number(editedreporting_manager_id),
        status: editedstatus,
      });

      setEditingTodo(null);
      getTodos();
    } catch (err) {
      console.error(err.response?.data || err.message);
    alert("Update failed. Check Manager ID / backend API.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-6xl p-8">
        <h1 className="text-3xl font-bold justify-center items-center mb-6">EMPLOYEE MANAGEMENT</h1>

        {/* ✅ FORM — 3 INPUTS PER ROW */}
        <form
          onSubmit={onSubmitForm}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border p-4 rounded-lg mb-8"
        >
          <input className="input" value={employee_code} onChange={e => setEmployee_code(e.target.value)} placeholder="Employee Code" />
          <input className="input" value={first_name} onChange={e => setfirst_name(e.target.value)} placeholder="First Name" />
          <input className="input" value={last_name} onChange={e => setlast_name(e.target.value)} placeholder="Last Name" />
          <input className="input" value={email} onChange={e => setemail(e.target.value)} placeholder="Email" />
          <input className="input" value={phone_number} onChange={e => setphone_number(e.target.value)} placeholder="Phone Number" />
          <input className="input" value={date_of_birth} onChange={e => setdate_of_birth(e.target.value)} placeholder="Date of Birth" />
          <input className="input" value={date_of_joining} onChange={e => setdate_of_joining(e.target.value)} placeholder="Date of Joining" />
          <input className="input" value={department} onChange={e => setdepartment(e.target.value)} placeholder="Department" />
          <input className="input" value={designation} onChange={e => setdesignation(e.target.value)} placeholder="Designation" />
          <input className="input" value={reporting_manager_id} onChange={e => setreporting_manager_id(e.target.value)} placeholder="Manager ID" />
          <input className="input" value={status} onChange={e => setstatus(e.target.value)} placeholder="Status" />

          <button className="col-span-full bg-blue-500 text-white py-2 rounded-lg">
            Add Employee
          </button>
        </form>

        {/* ✅ LIST */}
        {todos.map((todo) => (
          <div key={todo.employee_id} className="border rounded-lg p-4 mb-4">
            {editingTodo === todo.employee_id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input className="input" value={editedEmployee_code} onChange={e => setEditedEmployee_code(e.target.value)} />
                <input className="input" value={editedfirst_name} onChange={e => setEditedfirst_name(e.target.value)} />
                <input className="input" value={editedlast_name} onChange={e => setEditedlast_name(e.target.value)} />
                <input className="input" value={editedemail} onChange={e => setEditedemail(e.target.value)} />
                <input className="input" value={editedphone_number} onChange={e => setEditedphone_number(e.target.value)} />
                <input className="input" value={editeddate_of_birth} onChange={e => setEditeddate_of_birth(e.target.value)} />
                <input className="input" value={editeddate_of_joining} onChange={e => setEditeddate_of_joining(e.target.value)} />
                <input className="input" value={editeddepartment} onChange={e => setEditeddepartment(e.target.value)} />
                <input className="input" value={editeddesignation} onChange={e => setEditeddesignation(e.target.value)} />
                <input className="input" value={editedreporting_manager_id} onChange={e => setEditedreporting_manager_id(e.target.value)} />
                <input className="input" value={editedstatus} onChange={e => setEditedstatus(e.target.value)} />

                <div className="col-span-full flex gap-2 justify-end">
                  {/* SAVE BUTTON */}
                  <button type="button"   // to save values after editing
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
                  onClick={() => handleUpdate(todo.employee_id)}
                  >
                    <MdOutlineDone />Save</button>
                    {/* CANCEL BUTTON */}
                    <button type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-1"
                    onClick={() => setEditingTodo(null)}>
                      <IoClose />Cancel</button>
                      </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm items-center">
                <span>{todo.employee_code}</span>
                <span>{todo.first_name}</span>
                <span>{todo.last_name}</span>
                <span>{todo.phone_number}</span>
                <span>{todo.department}</span>
                <span>{todo.designation}</span>
                <span>{todo.status}</span>

                <div className="flex gap-2 justify-end  ">
                  <MdModeEditOutline className="cursor-pointer"
                  onClick={() => handleEdit(todo)}/>
                  <FaTrash
                  className="cursor-pointer text-red-500"
                  onClick={() => handleDelete(todo.employee_id)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;