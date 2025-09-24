import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import * as studentController from "../controllers/studentController";

const studentRouter = Router();

const handleValidationErrors = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

studentRouter.post(
    "/join",
    body("pollId").notEmpty().isMongoId(),
    body("studentName").notEmpty().trim().isLength({ min: 2, max: 50 }),
    handleValidationErrors,
    studentController.joinPoll,
);

studentRouter.post(
    "/answer",
    body("pollId").notEmpty().isMongoId(),
    body("questionId").notEmpty(),
    body("studentName").notEmpty().trim(),
    body("selectedOption").isInt({ min: 0 }),
    handleValidationErrors,
    studentController.submitAnswer,
);

studentRouter.get(
    "/poll/:pollId/current-question",
    param("pollId").isMongoId(),
    handleValidationErrors,
    studentController.getCurrentQuestion,
);

export default studentRouter;
