const express = require("express");
const app = express();
const fs = require('fs');
const fileList = [];
const cheerio = require('cheerio');
var examQs = [];
const repo = require('./repository')

app.listen(3000, () => {
    console.log("Application started and Listening on port 3000");
    const testFolder = './sources/';
    const fs = require('fs');

    fs.readdirSync(testFolder).forEach(file => {
        fileList.push(file);
    });
    
});

app.get("/", (req, res) => {
    var data = fs.readFileSync(`./templates/main.html`, 'utf8');
    
    res.send(data);
});

app.get("/study", (req, res) => {
    const d = new Date();
    let day = d.getDay()
    examQs =[] //empty array
    for(let i=0;i<fileList.length;i++){
        if(fileList[i].startsWith(`html-${day}`)) {
            examQs.push(fileList[i]);
        }
    }
    res.redirect("/answer?answers=yes&questionId=1");
});

app.get("/questionpaper", (req, res) => {
    var questionCount = req.query.questioncount
    console.log(questionCount)
   // examQs =["html-14-9-5.html","html-12-7-9.html","html-7-8-10.html","html-9-5-8.html","html-8-10-19.html","html-11-7-33.html","html-10-8-33.html","html-15-9-16.html","html-1-10-39.html","html-7-7-23.html","html-2-9-28.html","html-11-7-22.html","html-1-6-28.html","html-14-5-36.html","html-11-5-10.html","html-12-7-36.html","html-9-9-5.html","html-7-5-7.html","html-8-10-1.html","html-9-5-13.html","html-11-4-10.html","html-14-6-34.html","html-1-8-34.html","html-5-1-12.html","html-11-4-4.html","html-10-4-9.html","html-7-7-4.html","html-14-7-23.html","html-11-7-30.html","html-2-7-20.html","html-14-8-2.html","html-15-6-28.html","html-15-9-19.html","html-11-8-9.html","html-13-9-6.html","html-9-5-39.html","html-11-8-1.html","html-7-6-14.html","html-7-9-17.html","html-10-10-7.html"] //empty array
   examQs =[] //empty array
    for(let i=0;i<questionCount;i++){
        var randomPage = Math.floor(Math.random() * (fileList.length - 1 + 1) + 1)
        var fileName = fileList[randomPage];
        examQs.push(fileName);
    }
    res.redirect("/question?answers=no&questionId=1");
});

app.get("/question", (req, res) => {
    var questionId = req.query.questionId
    var qNo = Number(questionId)
    console.log(qNo + " - " +examQs)

    var data = fs.readFileSync(`./sources/${examQs[qNo - 1]}`, 'utf8');
    var nextQuestion = qNo + 1;
    var prevQuestion = qNo - 1;
    if(nextQuestion <= examQs.length) {
        data = data.replace('<a class="step3 medium-screen-icon">', `<a href="http://10.0.0.8:3000/question?answers=no&questionId=${nextQuestion}" class="step3 medium-screen-icon">`)    
        data = data.replace('<a class="step2 medium-screen-icon">', `<a href="http://10.0.0.8:3000/question?answers=no&questionId=${prevQuestion}" class="step2 medium-screen-icon">`)    
    } else {
        data = data.replace('<a class="step3 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?answers=yes&questionId=1" class="step3 medium-screen-icon">`)    
        data = data.replace('<a class="step2 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?answers=yes&questionId=1" class="step2 medium-screen-icon">`)    
    }
    
    const $ = cheerio.load(data);
    $( ".question-details").text(`${qNo} of ${examQs.length}`);
    $( ".left-navigator").remove();
    var rowCount = $('#answerContainer > table > tbody > tr').length;
    for(let removeAnsPercent = 1; removeAnsPercent <= rowCount;removeAnsPercent++){
        $(`#answerContainer > table > tbody > tr:nth-child(${removeAnsPercent}) > td.d-flex.answer-choice-content > span.ng-star-inserted`).remove()
    }
    
    $( ".stats-bar.d-flex.align-items-center.flex-wrap.ng-star-inserted").remove();
    $( ".question-content.right-content.split-screen").remove();
    $( ".question-content.left-content.ng-star-inserted.split-screen").css('flex-basis', '1000px');
    $( ".mat-radio-button").remove();

    res.send($.html());
});

app.get("/answer", (req, res) => {
    var questionId = req.query.questionId
    var qNo = Number(questionId)
    console.log(qNo + " - " +examQs)

    var data = fs.readFileSync(`./sources/${examQs[qNo - 1]}`, 'utf8');
    var nextQuestion = Number(questionId) + 1;
    var prevQuestion =  Number(questionId) - 1;
    if(nextQuestion <= examQs.length) {
        data = data.replace('<a class="step3 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?answers=yes&questionId=${nextQuestion}" class="step3 medium-screen-icon">`)    
        data = data.replace('<a class="step2 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?answers=yes&questionId=${prevQuestion}" class="step2 medium-screen-icon">`)    
    } else {
        //keep revolving around answers
        data = data.replace('<a class="step3 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?answers=yes&questionId=1" class="step3 medium-screen-icon">`)    
    }

    const $ = cheerio.load(data);
    $( ".question-details").text(`${qNo} of ${examQs.length}`);
    $( ".left-navigator").remove();

    res.send($.html());
});