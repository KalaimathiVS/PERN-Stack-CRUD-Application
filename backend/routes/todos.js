import { Router } from "express";
import pool from "../db.js";

console.log("🔥 TODOS ROUTE FILE LOADED (NEW VERSION)");

const router = Router();

// Create a new todo
router.post("/", async (req, res) => {
  try {
    let {
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
      status
    } = req.body;

    const sql = `
      INSERT INTO "Employee" (
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
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;

    const values = [
      employee_code,
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      date_of_joining,
      department,
      designation,
      reporting_manager_id || null, // ✅ correct
      status
    ];

    const result = await pool.query(sql, values);
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all todos
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT * FROM "Employee"`;
    const allTodos = await pool.query(sql);
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a todo
router.put("/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;
    
    let { employee_code,first_name,last_name,email,phone_number,
      date_of_birth,date_of_joining,department,
      designation,reporting_manager_id,status} = req.body; 
      console.log("RAW reporting_manager_id 👉", reporting_manager_id);
      console.log("TYPE 👉", typeof reporting_manager_id);
   
    if (
      reporting_manager_id === "" ||
      reporting_manager_id === null ||
      reporting_manager_id === undefined ||
      Number(reporting_manager_id) === 0 ||
      Number.isNaN(Number(reporting_manager_id)))
      {
  reporting_manager_id = null;
} 
else {
  reporting_manager_id = Number(reporting_manager_id);
}   //Foreignkey cant send null so we fixing in API

    const updatedTodo = await pool.query(
      `UPDATE "Employee" SET employee_code=$1,first_name=$2,last_name=$3,email=$4,
      phone_number=$5,date_of_birth=$6,date_of_joining=$7,
      department=$8,designation=$9,reporting_manager_id=$10,
      status=$11 WHERE employee_id = $12 RETURNING *`,
      [employee_code,first_name,last_name,email,phone_number,date_of_birth,date_of_joining,department,designation,
        reporting_manager_id,status, employee_id]
    );
    if (updatedTodo.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({
      message: "Employee details was updated!",
      todo: updatedTodo.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a todo
router.delete("/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;
    const deletedTodo = await pool.query(
      `DELETE FROM "Employee" WHERE employee_id = $1 RETURNING *`,[employee_id]
    );
    if (deletedTodo.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json("Employee was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
