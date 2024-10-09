import Candidate from "../schema/CandidateSchema";
import { Request, Response } from "express";

export const fetchAllCandidates =  (req: Request, res: Response) => {
    res.status(200).json({"Message":"This experiment is good in TypScript"})
    // try {
    //     const candidates = await Candidate.find();
    //     res.status(200).json(candidates);
    // } catch (error) {
    //     res.status(500).json({ message: "Error fetching candidates", error });
    // }
};
export const fetchIndividualCandidate=async (req: Request, res: Response)=>{
    const candidate=await Candidate.findById(req.params.id);
    if(!candidate){
        res.status(400)
        throw new Error ("Candidate do not exist");
    }
    res.status(200).json(`Here we found application for the candidate ${req.body.name}`)
    
    }
