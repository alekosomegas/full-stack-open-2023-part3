const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =
`mongodb+srv://admin:${password}@cluster0.nck1dwo.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person.find({}).then(
        res => {
            console.log("phonebook:");
            res.map(per => {
                console.log(per.name, per.number);
            })
            mongoose.connection.close()
        }
    )
} else if (process.argv.length == 5)  {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
      name: name,
      number: number,
    })
    
    person .save().then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}

