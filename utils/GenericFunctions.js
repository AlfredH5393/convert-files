class GenericFunctions {

    static genericResponse(msg = '', body, statusCode = 200, errors = [], totalRows = 0){
        return {
            msg,
            body,
            statusCode,
            errors: errors,
            totalRows
        }
    }
    static genericResponseNoData(msg = '', statusCode = 200){
        return {
            msg,
            statusCode
        }
    }
}

module.exports = GenericFunctions;