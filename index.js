const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://shipon:qCXNbLhx$M53NV@cluster0.dzoti.mongodb.net/tasks?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})



client.connect(err => {
  const collection = client.db("tasks").collection("todos");
  // Post data to mongodb
    app.post('/addTask',(req,res)=>{
        const tasks = req.body;
        // console.log(tasks);
        collection.insertOne(tasks)
        .then(result=>{
            console.log("Data added successfully");
            res.redirect('/');
        })
    })

    // Send data to UI
    app.get('/tasks',(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })

    // Delete data from Database
    app.delete('/delete/:id',(req,res)=>{
        collection.deleteOne({_id:ObjectId(req.params.id)})
        .then(result=>{
            res.send(result.deletedCount > 0);
        })
    })
    // Send single data to UI
    app.get('/task/:id',(req,res)=>{
        collection.find({_id:ObjectId(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents[0]);
        })
    })
    // Update data to database
    app.patch('/update/:id',(req,res)=>{
        collection.updateOne({_id:ObjectId(req.params.id)},
        {
            $set: {taskname:req.body.taskName,tasktime:req.body.taskTime}
        })
        .then(result=>{
            res.send(result.modifiedCount > 0);
        })
    })
  console.log("Database connected");
  // perform actions on the collection object
//   client.close();
});

app.listen(port,()=>{
    console.log("Listening port 3001");
})
