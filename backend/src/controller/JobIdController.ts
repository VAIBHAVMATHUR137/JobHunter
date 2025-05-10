import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { jobIDSchema } from "../schema/JobIDschema";

export const createJobID = () =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { username, jobID } = req.body;

      if (!username || !jobID) {
        res.status(400).json({ message: "Username and jobID are required" });
        return;
      }

      const newJob = await jobIDSchema.create({ username, jobID });
      res.status(201).json({"Message":"Job ID created successfully"});
    } catch (error: any) {
      console.error(error);

      if (error.code === 11000) {
        res.status(409).json({ message: "Same job already exists" });
        return;
      }
      res.status(500).json({ message: "Something went wrong on the server" });
    }
  });

export const screenJobID = () =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { jobID } = req.params;

      if (!jobID) {
        res.status(400).json({ message: "Job ID is required" });
        return;
      }

      const jobRecord = await jobIDSchema.findOne({ jobID });

      if (jobRecord) {
        res.status(409).json({ message: "This jobID already exists" });
        return;
      }

      res.status(200).json({ Message: "This jobID is available" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong on the server" });
    }
  });

export const deleteJobID = () =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { jobID } = req.params;

      if (!jobID) {
        res.status(400).json({ message: "Job ID is required" });
        return;
      }

      const result = await jobIDSchema.deleteOne({ jobID});

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "No such job exists" });
        return;
      }

      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Cannot delete the job" });
    }
  });
