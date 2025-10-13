/**
 * Interface for Student Repository operations.
 * Defines CRUD methods for student data management.
 * All methods must be implemented by subclasses.
 */
export default class IStudentRepository {

    /**
     * Constructor to prevent direct instantiation of the interface.
     */
    constructor() {
 
    }

    /**
     * Retrieve all students.
     * @returns {Promise<Array>} A promise that resolves to an array of students.
     */
    async all() {
        throw new Error("Not implemented");
    }


    /**
     * Find a student by ID.
     * @param {string|number} id - The ID of the student to find.
     * @returns {Promise<Object|null>} A promise that resolves to the student object or null if not found.
     */
    async find(id) {
        throw new Error("Not implemented");
    }


    /**
     * Create a new student.
     * @param {Object} data - The data for the new student.
     * @returns {Promise<Object>} A promise that resolves to the created student object.
     */
    async create(data) {
        throw new Error("Not implemented");
    }


    /**
     * Update an existing student.
     * @param {string|number} id - The ID of the student to update.
     * @param {Object} data - The updated data for the student.
     * @returns {Promise<Object>} A promise that resolves to the updated student object.
     */
    async update(id, data) {
        throw new Error("Not implemented");
    }


    /**
     * Delete a student by ID.
     * @param {string|number} id - The ID of the student to delete.
     * @returns {Promise<void>} A promise that resolves when the student is deleted.
     */
    async delete(id) {
        throw new Error("Not implemented");
    }
}