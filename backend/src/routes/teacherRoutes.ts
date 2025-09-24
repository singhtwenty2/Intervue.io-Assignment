import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import * as teacherController from "../controllers/teacherController";

const teacherRouter = Router();

const handleValidationErrors = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

teacherRouter.post(
    "/poll",
    body("title").notEmpty().trim().isLength({ min: 3, max: 100 }),
    handleValidationErrors,
    teacherController.createPoll,
);

teacherRouter.get(
    "/poll/:pollId",
    param("pollId").isMongoId(),
    handleValidationErrors,
    teacherController.getPoll,
);

teacherRouter.post(
    "/poll/:pollId/question",
    param("pollId").isMongoId(),
    body("text").notEmpty().trim().isLength({ min: 5, max: 500 }),
    body("options").isArray({ min: 2, max: 6 }),
    body("options.*").notEmpty().trim().isLength({ min: 1, max: 100 }),
    body("timeLimit").optional().isInt({ min: 10, max: 300 }),
    handleValidationErrors,
    teacherController.addQuestion,
);

teacherRouter.post(
    "/poll/:pollId/question/:questionId/start",
    param("pollId").isMongoId(),
    param("questionId").notEmpty(),
    handleValidationErrors,
    teacherController.startQuestion,
);

teacherRouter.get(
    "/poll/:pollId/results",
    param("pollId").isMongoId(),
    handleValidationErrors,
    teacherController.getPollResults,
);

teacherRouter.get("/polls", teacherController.getPollHistory);

teacherRouter.delete(
    "/poll/:pollId/student/:studentName",
    param("pollId").isMongoId(),
    param("studentName").notEmpty().trim(),
    handleValidationErrors,
    teacherController.removeStudent,
);

export default teacherRouter;
