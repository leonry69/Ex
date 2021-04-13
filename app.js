var express = require("express")
var hbs = require('hbs')

var app = express()

var bodyParser = require("body-parser"); //lay giu lieu tu servo qua teckbock de xu ly fom

app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine','hbs')

//var url = 'mongodb://localhost:27017';
var url='mongodb+srv://leonry:huy0966902734@cluster0.8mvtn.azure.mongodb.net/test'
var MongoClient = require('mongodb').MongoClient;

//ket noi database
app.get('/',async (req,res)=>{
let client= await MongoClient.connect(url);
let dbo = client.db("Test123");
let results = await dbo.collection("product").find({}).toArray();
res.render('index',{model:results})
})

// tim kiems
app.post('/search',async (req,res)=>{
let client= await MongoClient.connect(url);
let dbo = client.db("Test123");
let nameInput = req.body.txtName;
let searchCondition = new RegExp(nameInput,'i')
let results = await dbo.collection("product").find({name:searchCondition}).toArray();
res.render('index',{model:results})
})


//nhap du lieu vao
app.get('/insert',(req,res)=>{

    res.render('newProduct')

})

app.post('/doInsert', async (req,res)=>{

    var nameInput = req.body.txtName;

    var priceInput = req.body.txtPrice;

    var newProduct = {name:nameInput, price:priceInput};


    let client= await MongoClient.connect(url);

    let dbo = client.db("Test123");

    await dbo.collection("product").insertOne(newProduct);

    res.redirect('/')


})


// xoa du lieu
app.get('/delete',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("Test123");

    await dbo.collection("product").deleteOne(condition);

    res.redirect('/')
})


//
app.post('/update',async (req,res)=>{
    let id = req.body.txtId;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let newValues ={$set : {name: nameInput,price:priceInput}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("Test123");
    await dbo.collection("product").updateOne(condition,newValues);
    res.redirect('/');

})


//cap nhap du lieu
app.get('/edit',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("Test123");
    let productToEdit = await dbo.collection("product").findOne(condition);
    res.render('edit',{product:productToEdit})

})
const PORT = process.env.PORT || 3000
app.listen(3000);
console.log('Server is running at 3000')