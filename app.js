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
    studyQs =[] //empty array
    for(let i=0;i<fileList.length;i++){
        if(fileList[i].startsWith(`html-${day}`)) {
            studyQs.push(fileList[i]);
        }
    }
    res.redirect("/answer?questionId=1&mode=study");
});

app.get("/questionpaper", (req, res) => {
    var questionCount = req.query.questioncount
    console.log(questionCount)
    examQs =[] //empty array
    while(examQs.length < questionCount){
        var randomPage = Math.floor(Math.random() * (fileList.length - 1 + 1) + 1)
        var fileName = fileList[randomPage];
        if(!examQs.includes(fileName)) {
            examQs.push(fileName);
        }
    }
    res.redirect("/question?questionId=1&mode=qpaper");
});

app.get("/question", (req, res) => {
    var questionId = req.query.questionId
    var qNo = Number(questionId)

    var mode = req.query.mode
    var listToUse;
    if(mode == "qpaper") {
        listToUse = examQs;
    } else {
        listToUse = studyQs;
    }
    console.log(qNo + " - " +listToUse)
    var data = fs.readFileSync(`./sources/${listToUse[qNo - 1]}`, 'utf8');
    var nextQuestion = qNo + 1;
    var prevQuestion = qNo - 1;
    if(nextQuestion <= listToUse.length) {
        data = data.replace('<a class="step3 medium-screen-icon">', `<a href="http://10.0.0.8:3000/question?questionId=${nextQuestion}&mode=${mode}" class="step3 medium-screen-icon">`)    
        data = data.replace('<a class="step2 medium-screen-icon">', `<a href="http://10.0.0.8:3000/question?questionId=${prevQuestion}&mode=${mode}" class="step2 medium-screen-icon">`)    
    } else {
        data = data.replace('<a class="step3 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?questionId=1&mode=${mode}" class="step3 medium-screen-icon">`)    
        data = data.replace('<a class="step2 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?questionId=1&mode=${mode}" class="step2 medium-screen-icon">`)    
    }
    
    const $ = cheerio.load(data);
    $( ".question-details").text(`${qNo} of ${listToUse.length}`);
    $( ".left-navigator").remove();
    var rowCount = $('#answerContainer > table > tbody > tr').length;
    for(let removeAnsPercent = 1; removeAnsPercent <= rowCount;removeAnsPercent++){
        $(`#answerContainer > table > tbody > tr:nth-child(${removeAnsPercent}) > td.d-flex.answer-choice-content > span.ng-star-inserted`).remove()
    }
    $( "body > app-root > usmle-test-interface > testinterface-usmle-mainlayout > div > nbme-layout > div > div").css('margin-left', '1px');
    $( ".stats-bar.d-flex.align-items-center.flex-wrap.ng-star-inserted").remove();
    $( ".question-content.right-content.split-screen").remove();
    $( ".question-content.left-content.ng-star-inserted.split-screen").css('flex-basis', '1000px');
    $( ".mat-radio-button").remove();
    $( "#stopIcon").remove();

    res.send($.html());
});

app.get("/answer", (req, res) => {
    var questionId = req.query.questionId
    var qNo = Number(questionId)
    
    var mode = req.query.mode
    var listToUse;
    if(mode == "qpaper") {
        listToUse = examQs;
    } else {
        listToUse = studyQs;
    }
    console.log(qNo + " - " +listToUse)
    var data = fs.readFileSync(`./sources/${listToUse[qNo - 1]}`, 'utf8');
    var nextQuestion = Number(questionId) + 1;
    var prevQuestion =  Number(questionId) - 1;
    if(nextQuestion <= listToUse.length) {
        data = data.replace('<a class="step3 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?questionId=${nextQuestion}&mode=${mode}" class="step3 medium-screen-icon">`)    
        data = data.replace('<a class="step2 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?questionId=${prevQuestion}&mode=${mode}" class="step2 medium-screen-icon">`)    
    } else {
        //keep revolving around answers
        data = data.replace('<a class="step3 medium-screen-icon">', `<a href="http://10.0.0.8:3000/answer?questionId=1&mode=${mode}" class="step3 medium-screen-icon">`)    
    }

    const $ = cheerio.load(data);
    $( "body > app-root > usmle-test-interface > testinterface-usmle-mainlayout > div > nbme-layout > div > div").css('margin-left', '1px');
    $( ".question-details").text(`${qNo} of ${listToUse.length}`);
    $( ".left-navigator").remove();

    res.send($.html());
});