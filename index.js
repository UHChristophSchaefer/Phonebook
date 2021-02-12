const express = require('express')
var morgan = require('morgan')

const app = express()
const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

app.use(morgan('tiny'))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'));


app.use(express.json())

let persons = [
    { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
    },
    { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
    },
    { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
    },
    { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
    }
]

// GET
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> 
                    ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

// PUT
const generateId = () => {
    const max = 1000000 
    return Math.floor(Math.random() * Math.floor(max))
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    else if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    const findName = persons.filter(p => p.name === body.name)
    if (findName.length > 0) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    
  
    persons = persons.concat(person)
  
    response.json(person)
  })


// DELETE
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})