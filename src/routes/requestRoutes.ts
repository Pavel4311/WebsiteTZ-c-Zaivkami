import { Router } from "express";
import {
  createRequest,
  getRequests,
  assignMaster,
  takeInProgress,
  completeRequest,
  cancelRequest,
} from "../controllers/requestController";

const router = Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.post("/assign", assignMaster);
router.post("/:requestId/take", takeInProgress);
router.post("/:requestId/complete", completeRequest);
router.post("/:requestId/cancel", cancelRequest);

export default router;
