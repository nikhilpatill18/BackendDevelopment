// way-1
/* const asynchandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)

    }
    catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
} */

/// most useed way in the production based code 
const asynchandler = (requesthandler) => {
    return (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next)).catch((err) => {
            next(err)
        })
    }
}
export { asynchandler }