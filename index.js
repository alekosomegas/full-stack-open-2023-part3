require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

morgan.token("body", (request, response) => JSON.stringify(request.body));

app.use(express.json());
// app.use(
//   morgan(
//     ":method :url :status :response-time ms - :response[content-length] :body - :request[content-length]"
//   )
// );
app.use(cors());
app.use(express.static("static_dist"));

app.post("/api/persons", (request, response) => {
  const content = request.body;
  if (!content.name || !content.number) {
    return response.status(400).json({ error: "content missing" });
  }

  const newPerson = new Person({
    name: content.name,
    number: content.number,
  });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/", (request, response) => {
  response.send("Hello world");
});

const getCount = async () => {
  return await Person.countDocuments({});
};

app.get("/info", async (request, response) => {
  response.send(
    `<p>Phonebook has info for ${await getCount()} people</p>
        <p>${new Date()}</p>
    `
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((per) => {
      if (per) {
        response.json(per);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(response.status(204).end()).catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
