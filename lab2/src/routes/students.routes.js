import { Router } from 'express';
import StudentController from '../controllers/students/student.controller.js';
import { studentSchema } from '../schemas/students.schema.js';
import validateSchema from '../utils/validation/validateSchema.js';


const studentsRouter = Router();


studentsRouter.get('/', StudentController.all);
studentsRouter.get('/:id', StudentController.find);
studentsRouter.post('/', validateSchema(studentSchema), StudentController.create);
studentsRouter.put('/:id', validateSchema(studentSchema), StudentController.update);
studentsRouter.delete('/:id', StudentController.delete);

export default studentsRouter;