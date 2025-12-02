
function errorHandler(err, req, res, next) {
    console.error(err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
}

function notFoundHandler(req, res) {
    res.status(404).json({error: 'Route not found'});
}

module.exports = {errorHandler, notFoundHandler};