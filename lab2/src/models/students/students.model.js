
import JsonStudentRepository from "../../repositories/students/JsonStudentRepository.js"

/**
 * Model class for student operations.
 * Provides static methods to interact with the student repository.
 */
export default class StudentModel {
    /**
     * The repository instance used for data operations.
     * @type {JsonStudentRepository}
     */
    static repo = new JsonStudentRepository();

    /**
     * Retrieve all students.
     * @returns {Promise<Array>} A promise that resolves to an array of students.
     */
    static async all() {
        return this.repo.all();
    }

    /**
     * Find a student by ID.
     * @param {string|number} id - The ID of the student to find.
     * @returns {Promise<Object|null>} A promise that resolves to the student object or null if not found.
     */
    static async find(id) {
        return this.repo.find(id);
    }

    /**
     * Create a new student.
     * @param {Object} data - The data for the new student.
     * @returns {Promise<Object>} A promise that resolves to the created student object.
     */
    static async create(data) {
        return this.repo.create(data);
    }

    /**
     * Update an existing student.
     * @param {string|number} id - The ID of the student to update.
     * @param {Object} data - The updated data for the student.
     * @returns {Promise<Object>} A promise that resolves to the updated student object.
     */
    static async update(id, data) {
        return this.repo.update(id, data);
    }

    /**
     * Delete a student by ID.
     * @param {string|number} id - The ID of the student to delete.
     * @returns {Promise<void>} A promise that resolves when the student is deleted.
     */
    static async delete(id) {
        return this.repo.delete(id);
    }
}