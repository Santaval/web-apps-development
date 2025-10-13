import { ZodError } from 'zod';

/**
 * Middleware to validate the request body against a given schema.
 *
 * @param schema - The Zod schema to validate the request body against.
 * @returns A middleware function that validates the request body and calls the next middleware if valid, or responds with a 400 status code and error message if invalid.
 */
export default function validateSchema(schema) {
    return (req, res, next) => {
      console.log(req.body);
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        console.log(result.error);
        res.status(400).json({ error: result.error });
        return;
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  };
}