import express from 'express'
import userAuth from '../middelwares/authmiddleware.js';
import { updateUserController } from '../controllers/userControllers.js';



// router object
const router = express.Router();


// router 
// get user //Get

//update user || put
router.put('/update-user', userAuth, updateUserController);
export default router;