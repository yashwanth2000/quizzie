import express from "express";
import {
  createPoll,
  getPoll,
  deletePoll,
  updatePoll,
  getAllPolls,
  getPollByCode,
  updatePollAnalytics,
} from "../controller/poll.controller.js";
import verifyToken from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create-poll", verifyToken, createPoll);
router.get("/get/:id", verifyToken, getPoll);
router.get("/get-all", verifyToken, getAllPolls);
router.get("/code/:pollCode", getPollByCode);
router.delete("/delete/:id", verifyToken, deletePoll);
router.patch("/update/:id", verifyToken, updatePoll);
router.patch("/analytics/:pollCode", updatePollAnalytics);

export default router;
