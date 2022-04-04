const {Router} = require('express');
const { convertWordToPdf, convertWordToPdfTwo } = require('../controller/convert-files');

const router =  Router()

router.post("/withLibreoffice",convertWordToPdf)

router.post("/withDocxPdf",convertWordToPdfTwo)

module.exports = router;