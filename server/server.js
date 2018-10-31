const express = require('express');
const bodyParser = require ('body-parser');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

//Middleware in order to send json to
// our express app. 
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo ({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => { 
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos)=>{
        res.send({todos});
    }, (e) =>{
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)){
        res.status(404).send('Invalid ID');
    } 

    Todo.findById(id).then((todo) => {
        if (!todo){
            res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {  
        res.status(400).send()
    });
});

app.delete('/todos/:id', (req, res) =>{
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo){
            return res.status(404).send('No todo found')
        } 
        res.send({todo});
    }).catch((error) => {
        res.status(400).send(error);
    });
});


app.listen(port, () => console.log(`Started on Port ${port}`));

module.exports = {app};