class ApiError extends Error{
    constructor(
        statusCode,
        messsage,
        errors = [],
        stack = ""
    ){
        super(messsage);
        this.statusCode = statusCode;
        this.errors = errors;
        this.message = messsage;
        this.data = null;
        
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
module.exports = ApiError;