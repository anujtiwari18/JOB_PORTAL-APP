import express from 'express'
import userAuth from '../middelwares/authmiddleware.js';
import { createJobController, deleteController, getAllJobsController, jobStatscontroller, updateController } from '../controllers/jobsController.js';


const router = express.Router()

//routes
// Create job methods|| post
router.post('/create-job', userAuth, createJobController);


//GET JOBS || GET
router.get('/get-job', userAuth, getAllJobsController);


//UPDATE JOBS || PUT|| PATCH
router.patch('/update-job/:id', userAuth, updateController)

// DELETE JOBS || DELETE
router.delete('/delete-job/:id', userAuth, deleteController);

//  JOBS STATS FILTER ||GET
router.get('/job-state', userAuth, jobStatscontroller)




export default router;