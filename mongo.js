
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }
  
  const password = process.argv[2]


  const url =
    `mongodb+srv://fullstack:${password}@cluster0.8ad9r.mongodb.net/phonebook-app?retryWrites=true`
  
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  
  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })



const Person = mongoose.model('Person', personSchema)


if(process.argv.length == 5){
    // script is started to add a new person
    // otherwise, script will return all names and numbers

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
    Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })    
}



