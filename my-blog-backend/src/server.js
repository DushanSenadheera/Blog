import express from "express";
import {db, connectToDb} from './db.js';
import fs from 'fs';
import admin from 'firebase-admin';


const credentials = JSON.parse(
    fs.readFileSync('../credentials.json')
);

admin.initializeApp({
    credential:admin.credential.cert(credentials),
});


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

app.use(async(req, res, next) =>{
    const {authtoken} = req.headers;

    if(authtoken){
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch (e) {
            res.sendStatus(400);
        }
    }

    next();
});

// app.post('/hello', (req, res) => {
//     res.send(`Hello ${req.body.name}!`);
// });

// app.get('/hello/:name', (req, res)=>{
//     const {name} = req.params;
//     res.send(`Hello ${name}!!`);
// })

app.get('/api/articles/:name', async (req, res)=>{
    const {name} = req.params;

    const {uid} = req.user;

    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect();

    // const db = client.db('react-blog-db');
    
    const article = await db.collection('articles').findOne({name});

    if(article){
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uis && !upvoteIds.include(uid);
        res.json(article);
    }
    else{
        res.sendStatus(404);
    }
    
});

app.use((req,res,next)=>{
    if(req.user){
        next();
    }else {
        res.sendStatus(401);
    }
});

app.put('/api/articles/:name/upvote', async (req, res)=>{
    const {name} = req.params;
    

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

