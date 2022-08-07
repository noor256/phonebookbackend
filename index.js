const express = require('express')
const morgan = require('morgan')
var norgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('combined'))
app.use(cors())


let persons = 
    [
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





app.get('/', (request, response)=>{
    response.send('<h1>Salam World</h1>')
})
app.get('/info', (request, response)=>{
    const numberInfos= persons.length
   
    response.send(`<h3>Phonebook has info for ${numberInfos} people</h3> `+  new Date())
})


app.get('/api/persons', (request, response) =>{
    response.json(persons)
})
app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)

    const person = persons.find(person => person.id === id)

    if(person){
       response.json(person) 
    }else {
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


app.post('/api/persons', (request, response) =>{

 const generateId =()=>{
          const MaxId = persons.length>0
       ? Math.max(...persons.map(n => n.id)) : 0
      const random = Math.floor((Math.random() * 10) + MaxId)
      console.log(random)
     return random
    }


 const body = request.body
const IdentiqueName = persons.filter(person => person.name === body.name)
 if(!body.name || !body.number){
    return response.status(400).json({
        error: 'name and/or number missing'
    })
   
 } if(IdentiqueName){
        return response.status(400).json({
            error: "name already exist please choose another name"
        })
    }
  const person = {
    id:generateId(),
    name: body.name,
    number: body.number,
    date : new Date()
  }
  persons = persons.concat(person)

  response.json(person)
})



const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknow endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})