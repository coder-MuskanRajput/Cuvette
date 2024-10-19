export const generateError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (err.name === "MongoServerError" && err.message.includes("E11000 duplicate key error collection: UniAuth.user_models")) {
        err.message = 'User already exists';
    }else if (err.name === "MongoServerError" && err.message.includes("E11000 duplicate key error collection: UniAuth.templates")) { 
        err.message = 'Template With this name already exists'
    } else if(err.name === "MongoServerError" && err.message.includes("Cast to ObjectId failed")) {
        err.message = 'Template not available';
    }
    

    // console.error(err);

    res.status(statusCode).json({
        success: false,
        message: err.message,
        errorName: err.name,
        stack:  err.stack ,
    });
};
