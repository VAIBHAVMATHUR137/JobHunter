import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { jobID } from "../schema/JobIDschema";

export const createJobID = () =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { username, jobID: id } = req.body;
      
      if (!username || !id) {
        res.status(400).json({ message: "Username and jobID are required" });
        return;
      }
      
      const newJob = await jobID.create({ username, jobID: id });
      res.status(201).json(newJob);
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
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ message: "Job ID is required" });
        return;
      }
      
      const jobRecord = await jobID.findOne({ jobID: id });
      
      if (!jobRecord) {
        res.status(404).json({ message: "No job found with this ID" });
        return;
      }
      
      res.status(200).json(jobRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong on the server" });
    }
  });

export const deleteJobID = () =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ message: "Job ID is required" });
        return;
      }
      
      const result = await jobID.deleteOne({ jobID: id });
      
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