const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const htmlPath = (__dirname+'/html')
const port = 3000

app.use(fileUpload()) //middleware

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

    console.log('type:', req.files.inputFile)

    if (req.files.inputFile) {
          let file = req.files.inputFile,
              name = file.name,
              type = file.mimetype
          let uploadpath = __dirname + '/uploads/' + name
          var imageTest = (/^image/i).test(type)      
      // console.log('Regex:', imageTest, type)

        if (imageTest === true) {
                file.mv(uploadpath, (err) => {
                      if (err) {
                        console.log('Error uploading file',name, err)
                        return res.status(500).send(err)
                      }
                      else {
                        console.log('File uploaded:' ,name)
                        res.sendFile(htmlPath + '/upload.html')
                      }
                })
        } else {
                res.send('Not an image. Please upload only image files')
        }
    }

    else {
      res.render(htmlPath + '/no-upload.html')
    }
})
