import jobsModel from "../models/jobsModel.js"
import mongoose from "mongoose";
import moment from "moment";

export const createJobController = async (req, res, next) => {
    const { company, position } = req.body
    if (!company || !position) {
        next('Please Provide All field')

    }
    req.body.createdBy = req.user.userId
    const job = await jobsModel.create(req.body)
    res.status(201).json({ job });

};
// ========GET JOB======
export const getAllJobsController = async (req, res, next) => {
    // ALL JOB FILTER CODE= const jobs = await jobsModel.find({ createdBy: req.user.userId })
    const { status, workType, search, sort } = req.query
    // condition for searching
    // make query string
    const queryOject = {
        createdBy: req.user.userId
    }
    // logic filter
    if (status && status !== 'all') {
        queryOject.status = status

    }
    if (workType && workType !== 'all') {
        queryOject.workType = workType

    }
    if (search) {
        queryOject.position = { $regex: search, $options: 'i' };
    }
    let queryResult = jobsModel.find(queryOject)
    // sorting
    if (sort == 'latest') {
        queryResult = queryResult.sort('-createdAt')
    }
    if (sort == 'oldest') {
        queryResult = queryResult.sort('createdAt')
    }
    if (sort == 'a-z') {
        queryResult = queryResult.sort('position')
    }
    if (sort == 'A-Z') {
        queryResult = queryResult.sort('-position')
    }
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    queryResult = queryResult.skip(skip).limit(limit);
    // jobs count
    const totalJobs = await jobsModel.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);
    const jobs = await queryResult;


    res.status(200).json({
        totalJobs, //jobs.length,
        jobs,
        numOfPage,
    });



};

// ======== UPDATE JOBS =====
export const updateController = async (req, res, next) => {
    // const {} destructre
    const { id } = req.params
    const { company, position } = req.body
    //validation
    if (!company || !position) {
        // we make a next in middle ware so it easy to print something only write next
        next('please provide all fields')
    }
    // find job
    const job = await jobsModel.findOne({ _id: id })
    // validation 
    if (!job) {
        next(`no job found with this id ${id}`)
    }
    if (!req.user.userId == job.createdBy.toString()) {

        next('you not Authorize to update this job')
        return;

    }
    const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true

    })
    res.status(200).json({ updateJob });



};
export const deleteController = async (req, res, next) => {
    const { id } = req.params;
    //  const { company, position } = req.body
    // if (!company || !position) {
    // we make a next in middle ware so it easy to print something only write next
    //   next('please provide all fields')
    //}
    // find job
    const job = await jobsModel.findOne({ _id: id });
    // validation 
    if (!job) {
        next(`no job found with this id ${id}`)
    }
    if (!req.user.userId == job.createdBy.toString()) {

        next('you not Authorize to update this job')
        return;

    }

    await job.deleteOne();
    res.status(200).json({ message: "Success ,Job Deleted" });

};

// JOB ADD AND FILTERS
export const jobStatscontroller = async (req, res) => {
    // with the help model we will called agregation pipeline
    const stats = await jobsModel.aggregate([{
        // search user job
        $match: {
            createdBy: new mongoose.Types.ObjectId(req.user.userId)

        },


    },
    {
        $group: {
            _id: "$status",
            count: { $sum: 1 },
        },
    },
    ])
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,

    };

    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)


            },
        },
        {
            $group: {
                _id: {
                    year: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        }

    ]);
    //  monthlyApplication = monthlyApplication.map(item => {
    //    const { _id: { year, month }, count } = item
    //  const date = moment().month(month - 1).year(year).format('MMM Y')
    //return { date, count }
    //}).reverse();



    res.status(200).json({ totlaJob: stats.length, defaultStats, monthlyApplication });

};