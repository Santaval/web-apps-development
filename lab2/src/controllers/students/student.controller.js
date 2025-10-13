import StudentModel from '../../models/students/students.model.js';

/**
 * Controller for handling HTTP requests related to students.
 * Provides static methods for CRUD operations, mapping requests to StudentModel methods.
 */
export default class StudentController {
  /**
   * Get all students.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async all(req, res) {
    try {
      const students = await StudentModel.all();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get a student by ID.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async find(req, res) {
    try {
      const student = await StudentModel.find(req.params.id);
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ error: "Student not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create a new student.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async create(req, res) {
    try {
      const newStudent = await StudentModel.create(req.body);
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update an existing student by ID.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async update(req, res) {
    try {
      const updatedStudent = await StudentModel.update(req.params.id, req.body);
      res.status(200).json(updatedStudent);
    } catch (error) {
      if (error.message === "Student not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * Delete a student by ID.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async delete(req, res) {
    try {
      await StudentModel.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === "Student not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
