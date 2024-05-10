const quizTheme     = document.querySelectorAll(".quizTheme");
const quizThemeList = document.getElementById("quizThemeList");
const quizDiff      = document.querySelectorAll('.quizDiff');
const quizDiffList  = document.getElementById("quizDiffList");
const quizLegend    = document.getElementById("quizLegend");
const gameMachine   = document.getElementById("gameMachine");
// console.log(quizTheme.length);
let category    = "";
let difficulty  = "";
for (let i = 0; i < quizTheme.length; i++) {
    quizTheme[i].addEventListener("click", setQuizTheme);
}

function setQuizTheme() {
   category = this.id;
 //   console.log(category);
   quizThemeList.classList.add("animate__fadeOut");
   quizLegend.classList.add('animate__fadeOut')
   setTimeout(() => {
       quizThemeList.style.display = 'none';
       quizDiffList.style.display = "block";
       quizLegend.textContent = "And now the difficulty";
       quizLegend.classList.replace('animate__fadeOut', "animate__fadeIn");
    }, 1500);
            for (let i = 0; i < quizDiff.length; i++) {
                quizDiff[i].addEventListener("click", setQuizDiff);
            }  
}

function setQuizDiff () {
 //   console.log(this.id);
    difficulty = this.id;
 //   console.log("cat : ", category, " | diff : ", difficulty);
    quizDiffList.classList.replace("animate__fadeIn", "animate__fadeOut");
    quizLegend.classList.replace("animate__fadeIn", "animate__fadeOut");
    setTimeout(() => {
        gameMachine.style.display = "block";
        quizLegend.textContent = "Let's Play";
        quizLegend.classList.replace('animate__fadeOut', "animate__fadeIn");
    }, 1500);
    runQuiz();
}

function runQuiz () {
    console.log(category, difficulty);

$.get (`https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}`, (question) => {
    console.log(question.results[0].question);
})
}














/*
base URL https://opentdb.com/api.php?
Options :
    amount -- int
    category -- int (need to get the list)
    difficulty -- str ("easy","medium","hard")
    type -- str ("multiple","boolean")

    // -------------- GOOD CATS ----------------- 

    9:  General
    10: Books
    11: Film
    12: Music
    14: Television
    15: Video Games
    17: Nature
    18: Computers
    19: Maths
    20: Mythology
    21: Sports
    22: Geography
    23: History
    26: Celebs
    27: Animals
    28: Vehicles

*/
/*
sample URL
https://opentdb.com/api.php?amount=10&category=9&difficulty=hard&type=multiple
*/