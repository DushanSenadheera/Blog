import express from "express";
import {MongoClient} from 'mongodb';

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

    const client = new MongoClient('mongodb://127.0.0.1:27017')
    await client.connect();

    const db = client.db('react-blog-db');

    const article = await db.collection('articles').findOne({name});

    if(article){
        res.json(article);
    }
    else{
        res.sendStatus(404);
    }
    
});

app.put('/api/articles/:name/upvote', (req, res)=>{
    const {name} = req.params;
    const article = articlesInfo.find(a=>a.name===name);
    if (article) {
        article.upvotes+=1;
        res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`);
    }
    else{
        res.send('That article does not exist');
    }
});

app.post('/api/articles/:name/comments', (req, res)=>{
    const {name} = req.params;
    const {postedBy, text} = req.body;
    
    const article = articlesInfo.find(a=>a.name===name);
    
    if (article) {
        article.comments.push({postedBy, text});
        res.send(article.comments);
    }
    else{
        res.send('That article does not exist');
    }
});

app.listen(8000, ()=>{
    console.log("server is listing on port 8000");
});