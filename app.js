const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("requestsdb").collection("requests");
    app.listen(3010);
});

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// Вывод данных для таблицы
app.get("/requests", function(req, res){
    const collection = req.app.locals.collection;
    collection.find({}).project({number: 1, CompanyName: 1, FIOCarrier: 1, TelephoneCarrier: 1, comment: 1, ATICode: 1}).toArray(
        function(err, requests){

        if(err) return console.log(err);
        res.send(requests)
    });
});

// Вывод всех данных для одной заявки по ID
app.get("/requests/:id", function(req, res){

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, request){

        if(err) return console.log(err);
        res.send(request);
    });
});

// Создание заявки
app.post("/requests", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const requestNumber = req.body.number;
    const requestDate = req.body.date;
    const requestTime = req.body.time;
    const requestCompanyName = req.body.CompanyName;
    const requestFIOCarrier = req.body.FIOCarrier;
    const requestTelephoneCarrier = req.body.TelephoneCarrier;
    const requestComment = req.body.comment;
    const requestATICode = req.body.ATICode;

    const request = {number: requestNumber, date: requestDate, time: requestTime, CompanyName: requestCompanyName,
        FIOCarrier: requestFIOCarrier, TelephoneCarrier: requestTelephoneCarrier, comment: requestComment, ATICode: requestATICode};

    const collection = req.app.locals.collection;
    collection.insertOne(request, function(err, result){

        if(err) return console.log(err);
        res.send(request);
    });
});

// Удаление заявки по ID
app.delete("/requests/:id", function(req, res){

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function(err, result){

        if(err) return console.log(err);
        let request = result.value;
        res.send(request);
    });
});

// Редактирование заявки по ID
app.put("/requests/:id", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.params.id);
    const requestDate = req.body.date;
    const requestTime = req.body.time;
    const requestCompanyName = req.body.CompanyName;
    const requestFIOCarrier = req.body.FIOCarrier;
    const requestTelephoneCarrier = req.body.TelephoneCarrier;
    const requestComment = req.body.comment;
    const requestATICode = req.body.ATICode;

    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {date: requestDate, time: requestTime, CompanyName: requestCompanyName,
        FIOCarrier: requestFIOCarrier, TelephoneCarrier: requestTelephoneCarrier, comment: requestComment, ATICode: requestATICode}},
        {returnOriginal: false },
        function(err, result){

            if(err) return console.log(err);
            const request = result.value;
            res.send(request);
        });
});
