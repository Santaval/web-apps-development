import IStudentRepository from './IStudentRepository.js';

/**
 * JSON-based implementation of IStudentRepository.
 * Handles CRUD operations for students using a JSON file as storage.
 */
export default class JsonStudentRepository extends IStudentRepository {
    /**
     * Path to the JSON file storing student data.
     * @type {string}
     */
    filePath = './src/data/students.json';

    /**
     * Constructor to initialize the repository.
     * Calls the parent constructor to enforce interface implementation.
     */
    constructor() {
        super();
    }


    /**
     * Reads and parses the students JSON file.
     * @returns {Promise<Array>} A promise that resolves to an array of students.
     */
    async readFile() {
        const fs = await import('fs').then(module => module.promises);
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }


    /**
     * Writes the given data array to the students JSON file.
     * @param {Array} data - The array of students to write.
     * @returns {Promise<void>} A promise that resolves when writing is complete.
     */
    async writeFile(data) {
        const fs = await import('fs').then(module => module.promises);
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }


    /**
     * Retrieves all students from the JSON file.
     * @returns {Promise<Array>} A promise that resolves to an array of students.
     */
    async all() {
        return await this.readFile();
    }


    /**
     * Finds a student by their ID (carnet).
     * @param {string|number} id - The ID of the student to find.
     * @returns {Promise<Object|null>} A promise that resolves to the student object or null if not found.
     */
    async find(id) {
        const students = await this.readFile();
        return students.find(student => student.carnet === parseInt(id)) || null;
    }


    /**
     * Creates a new student and adds them to the JSON file.
     * @param {Object} data - The data for the new student.
     * @returns {Promise<Object>} A promise that resolves to the created student object.
     */
    async create(data) {
        const students = await this.readFile();
        const newStudent = data;
        students.push(newStudent);
        await this.writeFile(students);
        return newStudent;
    }


    /**
     * Updates an existing student in the JSON file.
     * @param {string|number} id - The ID of the student to update.
     * @param {Object} data - The updated data for the student.
     * @returns {Promise<Object>} A promise that resolves to the updated student object.
     */
    async update(id, data) {
        const students = await this.readFile();
        const index = students.findIndex(student => student.carnet === parseInt(id));
        if (index === -1) throw new Error("Student not found");
        students[index] = { ...students[index], ...data };
        await this.writeFile(students);
        return students[index];
    }


    /**
     * Deletes a student from the JSON file by their ID (carnet).
     * @param {string|number} id - The ID of the student to delete.
     * @returns {Promise<void>} A promise that resolves when the student is deleted.
     */
    async delete(id) {
        const students = await this.readFile();
        const index = students.findIndex(student => student.carnet === parseInt(id));
        if (index === -1) throw new Error("Student not found");
        students.splice(index, 1);
        await this.writeFile(students);
    }
}