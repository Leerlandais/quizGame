const quizTheme         = document.querySelectorAll(".quizTheme"),
      quizThemeList     = document.getElementById("quizThemeList"),
      quizLegend        = document.getElementById("quizLegend"),
      quizDiff          = document.querySelectorAll('.quizDiff'),
      quizDiffList      = document.getElementById("quizDiffList"),
      answerList        = document.querySelectorAll(".answerList"),
      answerListHolder  = document.getElementById('answerListHolder'),
      gameMachine       = document.getElementById("gameMachine"),
      gameScoreDisplay  = document.getElementById("gameScoreDisplay");

let category      = "",
    difficulty    = "",
    userScore     = 0,
    diffBonus     = 1,
    questionArray = [];


for (let i = 0; i < quizTheme.length; i++) {
    quizTheme[i].addEventListener("click", getQuizTheme);
}

function getQuizTheme() {
    category = this.id;
        quizThemeList.style.display = 'none';
        quizDiffList.style.display = "block";
        quizLegend.textContent = "And now the difficulty";
    
    for (let i = 0; i < quizDiff.length; i++) {
        quizDiff[i].addEventListener("click", getQuizDiff);
    }     
}

function getQuizDiff () {
    difficulty = this.id;
    difficulty === "hard" ? diffBonus = 2 : difficulty === "medium" ? diffBonus = 1.5 : diffBonus = 1;
    gameMachine.style.display = "block";
    quizLegend.textContent = "Let's Play";

    getQuestions();
}

function getQuestions () {
    $.get (`https://opentdb.com/api.php?amount=3&category=${category}&difficulty=${difficulty}&type=multiple`, (quests) => {

    questionArray = quests;
        prepareQuestion();
});
}

function prepareQuestion () {

    let findQuestion = [];
    findQuestion = questionArray.results.pop();
    let theQuestion = findQuestion.question;
    let possibleAnswers = findQuestion.incorrect_answers;

        possibleAnswers.push(findQuestion.correct_answer);
        correctAnswer = decodeHtmlEntities(findQuestion.correct_answer); // need to convert the HtmlSpecialChars
       
        for (let i = possibleAnswers.length - 1; i > 0; i--) {      // shuffle the answers otherwise 4 is always correct
          const j = Math.floor(Math.random() * (i + 1));
          [possibleAnswers[i], possibleAnswers[j]] = [possibleAnswers[j], possibleAnswers[i]];
        }
  showQuestion(theQuestion, possibleAnswers, correctAnswer);
}

function decodeHtmlEntities(html) {                 // Special Character converter
    var textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
}

function showQuestion (theQuestion, possibleAnswers, correctAnswer) {
    gameMachine.innerHTML = theQuestion;
    answerListHolder.style.display = "block";
    for (let i = 0; i < answerList.length; i++) {
        answerList[i].innerHTML = possibleAnswers[i];
        answerList[i].addEventListener('click', checkUserAnswer);
        }
}


function checkUserAnswer () {
    console.log(this.innerHTML);
    console.log(correctAnswer)
}