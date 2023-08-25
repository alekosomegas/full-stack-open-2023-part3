require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'))
app.use(cors())
app.use(express.static('static_dist'))

app.post('/api/persons', (req, res) => {
    const content = req.body
    if (!content.name || !content.number) {
       return res.status(400).json({error: 'content missing'})
    }

    const newPerson = new Person({
        name: content.name,
        number: content.number
    })

    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.get('/', (req, res) => {
    res.send('Hello world')
})

const getCount = async () => {
    return await Person.countDocuments({})
}

app.get('/info', async (req, res) => {
    res.send(
        `<p>Phonebook has info for ${await getCount()} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (req, res) => {
    Person.find({})
    .then(persons => 
        res.json(persons))
})

app.get('/api/persons/:id', (req, res) => {
    console.log("id", req.params.id);
    Person.findById(req.params.id)
    .then(per => {
        res.json(per)})
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id).then(
        res.status(204).end())
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}) 