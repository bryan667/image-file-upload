const fs = require('fs')
const express = require('express')
const app = express()
const htmlPath = (__dirname+'/html')
const uploadDir = (__dirname + '/uploads/')
const port = 3000
var multer = require('multer')

  var storage = multer.diskStorage({
        destination: function (req, file, cb) {            
              if (!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir);
                console.log('Directory created')
              }
          cb(null, uploadDir)
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname)
        }
  })

  var upload = multer({
        storage: storage,  //calls multer.diskStorage
        fileFilter: function (req, file, cb) {
            let imageTest = (/^image/i).test(file.mimetype)
                if (imageTest !== true) {
                    req.Error = 'File is not an image file' 
                    return cb(null, false)
                }
              cb(null, true)
        }
  }).single('inputFile')


app.listen(port, ()=> {
  console.log(`Server up in port ${port}`)
})

app.get('/', (req, res) => {
  res.sendFile(htmlPath + '/index.html')
})

app.get('/upload', (req, res) => {
  res.sendFile(htmlPath + '/no-upload.html')
})

app.post('/upload', (req, res) => {
        upload (req, res, (err) => {

                if (req.Error) {
                  res.send(req.Error)
                  return
                }

                else if (err) {
                  res.send('Error uploading file')
                  return
                }

                else if (!req.file) {
                  res.sendFile(htmlPath + '/no-upload.html')
                  return                 
                }

                else {
                  res.sendFile(htmlPath + '/upload.html')
                }

            })
})


