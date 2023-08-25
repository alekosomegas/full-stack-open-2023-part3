const express = require('express')
const app = express()

app.use(express.json())

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.post('/api/persons', (req, res) => {
    const content = req.body
    if (!content.name || !content.number) {
       return res.status(400).json({error: 'content missing'})
    }
    if (data.find(per => per.name === content.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }
    const id = Math.floor(Math.random() * 1000000000000000)
    console.log(req.body);
    const newPerson = {"id": id, "name": content.name, "number": content.number }
    data = data.concat(newPerson)
    res.json(data)
})

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${data.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (req, res) => {
    res.json(data)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = data.find(per => per.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    data = data.filter(per => per.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})