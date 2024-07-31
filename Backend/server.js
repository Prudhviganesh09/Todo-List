const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://prudhvi:prudhvi@cluster0.uzz2ogv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error("Error fetching todos", err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/todos', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error("Error adding todo", err);
        res.status(400).json({ message: err.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        console.error("Error deleting todo", err);
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
