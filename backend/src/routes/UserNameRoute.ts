import express from 'express'
import { createUniqueUserName, searchUserName } from '../controller/UserNameController';
const router=express.Router();
router.post('/create',createUniqueUserName)
router.post('/check',searchUserName)
export default router;