const {request, response} = require('express');
const fs = require('fs');
const path = require('path');
const GenericFunctions = require('../utils/GenericFunctions');
const libre = require('libreoffice-convert-win')
const docxConverter = require('docx-pdf');

/**
 * Método para convertir de word a PDF con libreoffice
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const convertWordToPdf = async (req = request, res = response) => {
    try{
        validityUploadFile(req, res)

        const extendConvert = '.pdf'
        const { files } = req.files;
        const extension = getExtension(files);
    
        validityExtension(extension,res);
    
        const uploadPath = getUploadPath(files)
        let responseMoveFile = await moveFile(uploadPath,files);
        if(responseMoveFile.isError){
            return res.status(400).json(GenericFunctions.genericResponseNoData("No fue posible guardar el archivo",400));
        } 
        const enterPath = getUploadPath(files);
        const outputPath = getOuputPath(extendConvert);
        const file = fs.readFileSync(enterPath);
    
        libre.convert(file, extendConvert, undefined, (err, done) => {
            if (err) {
                res.status(500).json(GenericFunctions.genericResponseNoData("Ha ocurrido un error al intentar convertir el archivo",500));
            }
            fs.writeFileSync(outputPath, done);
            fs.unlinkSync(enterPath);
            let base64 = fs.readFileSync(outputPath).toString('base64');
            fs.unlinkSync(outputPath);
            res.status(200).json(GenericFunctions.genericResponse("Archivo convertido correctamente",base64, 200,[],0));
    
        });
    }catch(err){
        res.status(500).json(GenericFunctions.genericResponseNoData("Ha ocurrido un error al intentar realizar la acción",500))
    }
}

/**
 * Método para convertir word a PDF con docx-pdf
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 const convertWordToPdfTwo = async (req = request, res = response) =>{
    try {
        validityUploadFile(req, res)
        const extendConvert = '.pdf'
        const { files } = req.files;
        const extension = getExtension(files);
        validityExtension(extension,res);

        const uploadPath = getUploadPath(files)
        let responseMoveFile = await moveFile(uploadPath,files);
        if(responseMoveFile.isError){
            return res.status(400).json(GenericFunctions.genericResponseNoData("No fue posible guardar el archivo",400));
        } 
        const enterPath = getUploadPath(files);
        const outputPath = getOuputPath(extendConvert);

        docxConverter(enterPath,outputPath,function(err,result){
            if(err){
                res.status(500).json(GenericFunctions.genericResponseNoData("Ha ocurrido un error al intentar convertir el archivo",500));
            }
            fs.unlinkSync(enterPath);
            let base64 = fs.readFileSync(outputPath).toString('base64');
            fs.unlinkSync(outputPath);
            res.status(200).json(GenericFunctions.genericResponse("Archivo convertido correctamente",base64, 200,[],0));
        });   

    } catch (error) {
        res.status(500).json(GenericFunctions.genericResponseNoData("Ha ocurrido un error al intentar realizar la acción",500))
    }
}

/**
 * Valida el archivo entrante 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const validityUploadFile = (req = request, res = response) => {
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.files){
        return res.status(400).json(GenericFunctions.genericResponseNoData("No haya archivos que por subir",400))
    }
}

/**
 * Método que obtienes la extension de un archivo
 * @param {*} files 
 * @returns 
 */
const getExtension = (files) =>{
    const cuteName = files.name.split('.');
    return cuteName[cuteName.length - 1];
}

/**
 * Valida la extension del archivo
 * @param {*} extension 
 * @param {*} res 
 * @returns 
 */
const validityExtension = (extension = '', res = response) => {
    if(extension !== "docx" && extension !== "doc"){
        return res.status(400).json(GenericFunctions.genericResponseNoData("Este archivo no es valido",400))
    }
}

/**
 * Obtiene la ruta de carga del archivo
 * @param {*} files 
 * @returns 
 */
const getUploadPath = (files) => { return path.join(__dirname, '../uploads/',files.name); }

/**
 * Obtiene las ruta de salida de un archivo
 * @param {*} extendConvert 
 * @returns 
 */
const getOuputPath = (extendConvert = '') => { return path.join(__dirname, `../uploads/example${extendConvert}`); }

/**
 * Método que mueve un archivo a un path especificado
 * @param {*} path 
 * @param {*} file 
 * @returns 
 */
const moveFile = async (path, file) =>{
    return new Promise((resolve,reject) =>{
        file.mv( path, (err)=>{
            let result = {};
            if(err){
                result.msj = err;
                result.isError = true;
                result.file = file;    
                resolve(result);
            }
            result.msj = "OK";
            result.isError = false;
            result.file = file;    
            resolve(result);
        })
    })
}

module.exports = {
    convertWordToPdf,
    convertWordToPdfTwo
}