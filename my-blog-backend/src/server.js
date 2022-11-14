import express from "express";
import {db, connectToDb} from './db.js';


// let articlesInfo = [{
//     name: 'learn-react',
//     upvotes:0,
//     comments: [],
// },{
//     name: 'learn-node',
//     upvotes: 0,
//     comments: [],
// },{
//     name: 'mongodb',
//     upvotes: 0,
//     comments: [],
// }]

const app = express();
app.use(express.json());

// app.post('/hello', (req, res) => {
//     res.send(`Hello ${req.body.name}!`);
// });

// app.get('/hello/:name', (req, res)=>{
//     const {name} = req.params;
//     res.send(`Hello ${name}!!`);
// })

app.get('/api/articles/:name', async (req, res)=>{
    const {name} = req.params;

    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect();

    // const db = client.db('react-blog-db');
    
    const article = await db.collection('articles').findOne({name});

    if(article){
        res.json(article);
    }
    else{
        res.sendStatus(404);
    }
    
});

app.put('/api/articles/:name/upvote', async (req, res)=>{
    const {name} = req.params;
    // const article = articlesInfo.find(a=>a.name===name);

    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect();

    // const db = client.db('react-blog-db');

    await db.collection('articles').updateOne({name}, {
        $inc: {upvotes: 1},
    });
    const article = await db.collection('articles').findOne({name});

    if (article) {
        res.json(article);
    }
    else{
        res.send('That article does not exist');
    }
});

app.post('/api/articles/:name/comments', async (req, res)=>{
    const {name} = req.params;
    const {postedBy, text} = req.body;
    
    // const article = articlesInfo.find(a=>a.name===name);
    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect();

    // const db = client.db('react-blog-db');
    await db.collection('articles').updateOne({name},{
        $push: {comments: {postedBy, text}},
    });
    
    

    const article = await db.collection('articles').findOne({name});

    if (article) {
        // article.comments.push({postedBy, text});
        res.json(article);
    }
    else{
        res.send('That article does not exist');
    }
});

connectToDb(()=>{
    console.log('connected to the db success');
    app.listen(8000, ()=>{
        console.log("server is listing on port 8000");
    });
})

