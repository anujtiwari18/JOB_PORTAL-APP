// errormidleware // next function
const errorMiddelware = (err, req, res, next) => {
    console.log(err)
    // for validation error logic
    const defaultErrors = { // defAULT OBJECT
        statusCode: 500,
        message: err,
    };
    //res.status(500).send({
    //  success: false,
    //message: "something went wrong",
    //err,

    //});
    // missing filed error
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400
        defaultErrors.message = object.value(err.errors).map(item => item.message).json(',');
    }
    // DUPLICATE ERRORS
    if (err.code && err.code === 11000) {
        defaultErrors.statusCode = 400;
        defaultErrors.message = `${object.keys(err.keyValue)} field has to be unique`;
    }
    res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });

};

export default errorMiddelware;