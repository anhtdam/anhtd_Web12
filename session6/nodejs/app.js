const bodyParser = require('body-parser');
const QuestionModel = require('./models/question.model.js');
const questionRouter = require('./router/questionRouter.js');
const express = require('express');
const handlebars = require('express-handlebars');

const fs = require('fs');

const mongooes = require('mongoose');


mongooes.connect('mongodb://localhost/quyetde', (err) => {
    if (err) console.log(err)
    else console.log('DB connect success');
})

let app = express();

app.use('/question', questionRouter);
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.get('/', (req, res, next) => {
    QuestionModel.find({}, (err, questions) => {
        if (err) console.log(err);
        req.questionList = questions;
        console.log(req.questionList);
        if (req.questionList.length <= 0) res.render('home', { question: null })
        else next();
    })
}, (req, res) => {
    res.render('home', {
        question: req.questionList[Math.floor(Math.random() * req.questionList.length)]
    })
});

app.get('/ask', (req, res) => {
    res.render('ask');
})

app.post('/api/question', (req, res) => {
    const newQuestion = {
        content: req.body.question
    }
    QuestionModel.create(newQuestion, (err, questionCreated) => {
        if (err) console.log(err)
        else res.redirect(`/question/${questionCreated.id}`);
    });
})


app.use(express.static('public'));

app.listen(8000, function (err) {
    if (err) console.log(err)
    else console.log('Server is up');
})