const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const fs = require('fs')
const multer = require('multer')
const { Configuration, OpenAIApi } = require('openai')

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads') // change the name of the folder you want to upload to
    },
    filename:(req, file, cb) => {
       // console.log(file) // this console.log is for debugging purposes
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage}).single('file')
let filePath

// OpenAI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// Image generation function
app.post('/images', async (req, res) => {
    try {
        const response = await openai.createImage({
            prompt: req.body.message,
            n: 6, // change the numbr of images you want to generate min is 1 and max is 10
            size: '512x512', // size of the image change it to one of these 3 options 256x256, 512x512, 1024x1024
        })
       // console.log(response.data.data) // this console.log is for debugging purposes
        res.send(response.data.data)

    } catch (error) {
        console.error(error)
    }
    const response = await openai.createImage({
    prompt: '',
    n: 6, // change the numbr of images you want to generate min is 1 and max is 10
    size: '1024x1024', // size of the image change it to one of these 3 options 256x256, 512x512, 1024x1024
    })
})

// Image upload function
app.post('/upload', async (req, res) => {
    upload(req, res, (err) => {
        if(err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        filePath = req.file.path
    })
})

// Image variation function
app.post('/variations', async (req, res) => {
    try {
        const response = await openai.createImageVariation(
        fs.createReadStream(filePath),
        6, // change the numbr of images you want to generate min is 1 and max is 10
        '1024x1024' // size of the image change it to one of these 3 options 256x256, 512x512, 1024x1024
        )
        res.send(response.data.data)
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => 
  console.log(`Server is running on port ${PORT}`))
