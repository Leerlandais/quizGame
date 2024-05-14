const quizTheme          = document.querySelectorAll(".quizTheme"),
      quizThemeField     = document.getElementById("quizThemeField"),
      quizLegend         = document.getElementById("quizLegend"),
      quizDiff           = document.querySelectorAll('.quizDiff'),
      quizDiffList       = document.getElementById("quizDiffList"),
      quizDiffField      = document.getElementById('quizDiffField')
      answerList         = document.querySelectorAll(".answerList"),
      answerListHolder   = document.getElementById('answerListHolder'),
      gameMachine        = document.getElementById("gameMachine"),
      gameScoreDisplay   = document.getElementById("gameScoreDisplay"),
      gameQuestionWindow = document.getElementById('gameQuestionWindow'),
      showPlayerLives    = document.getElementById("showPlayerLives");
      playAgain          = document.getElementById("playAgain");
      playAgain.addEventListener("click", function() {
        window.location.href = window.location.href;
      });

let category      = "",
    difficulty    = "",
    userScore     = 0,
    diffBonus     = 1,
    playerLives   = 3,
    questionArray = [],
    questionAlreadyAsked = [];

for (let i = 0; i < quizTheme.length; i++) {
    quizTheme[i].addEventListener("click", setQuizTheme);
}
function getNewQuizTheme() {
    for (let i = 0; i < quizTheme.length; i++) {
        quizTheme[i].addEventListener("click", setQuizTheme);
    }
    gameQuestionWindow.style.display = "none";
        quizThemeField.style.display = 'block';
}
function setQuizTheme() {
    for (let i = 0; i < quizTheme.length; i++) {
        quizTheme[i].removeEventListener("click", setQuizTheme);
    }
        quizThemeField.style.display = 'none';
    category = this.id;
    quizDiffField.style.display = "block";
        quizDiffList.style.display = "block";
        quizLegend.textContent = "And now the difficulty";
    
    for (let i = 0; i < quizDiff.length; i++) {
        quizDiff[i].addEventListener("click", setQuizDiff);
    }     
}

function setQuizDiff () {
    for (let i = 0; i < quizDiff.length; i++) {
        quizDiff[i].removeEventListener("click", setQuizDiff);
    }   
    difficulty = this.id;
    difficulty === "hard" ? diffBonus = 2 : difficulty === "medium" ? diffBonus = 1.5 : diffBonus = 1;
    gameMachine.style.display = "block";
    quizLegend.textContent = "Let's Play";
    
    getQuestions();
}

function getQuestions () {
    
    quizDiffList.style.display = "none";
    $.get (`https://opentdb.com/api.php?amount=7&category=${category}&difficulty=${difficulty}&type=multiple`, (quests) => {

    questionArray = quests;
    console.log(quests);
        prepareQuestion();
});
}

function prepareQuestion () {
    gameQuestionWindow.style.display = "block";
    gameScoreDisplay.textContent = "Your score is :"+ userScore;
    showPlayerLives.textContent = playerLives;
if (questionArray.results.length === 0) {       // by getting 10 questions at once, I cut down on the get requests sent ----- I reduced the amount to 7 due to categories with fewer questions available
    getQuestions();
    return;
} 
    let findQuestion = [];
    findQuestion = questionArray.results.pop();
    let theQuestion = findQuestion.question;
    let theCategory = findQuestion.category;
    let possibleAnswers = findQuestion.incorrect_answers;
    let questionAsked = findQuestion.question;
        possibleAnswers.push(findQuestion.correct_answer);
        correctAnswer = decodeHtmlEntities(findQuestion.correct_answer); // need to convert the HtmlSpecialChars
       
        for (let i = possibleAnswers.length - 1; i > 0; i--) {      // shuffle the answers otherwise 4 is always correct
          const j = Math.floor(Math.random() * (i + 1));
          [possibleAnswers[i], possibleAnswers[j]] = [possibleAnswers[j], possibleAnswers[i]];
        }
        if (checkForAskedQuestion (questionAsked) === true) {
  showQuestion(theQuestion, possibleAnswers, theCategory);
}else {
    alert("You have answered all questions available at that level of difficulty in your category. Please choose another");
    getNewQuizTheme();
//    return;
}
}

function decodeHtmlEntities(html) {                 // Special Character converter
    var textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
}

function showQuestion (theQuestion, possibleAnswers, theCategory) {
    console.log("use this :", correctAnswer);
    const gameCategory = document.getElementById('gameCategory');
    gameCategory.style.display = "block";
    gameCategory.innerHTML = theCategory;
    gameMachine.innerHTML = theQuestion;
    answerListHolder.style.display = "block";
    for (let i = 0; i < answerList.length; i++) {
        answerList[i].innerHTML = possibleAnswers[i];
        answerList[i].addEventListener('click', checkUserAnswer);
        }
}

function checkUserAnswer () {
    for (let i = 0; i < answerList.length; i++) {
        answerList[i].removeEventListener('click', checkUserAnswer);
        }
    this.innerHTML === correctAnswer ?
        scoreUp ():
        gameOver();
}

function scoreUp () {
    userScore = userScore+diffBonus;
//    console.log(userScore);
    gameScoreDisplay.textContent = "Your score is :"+ userScore;
    prepareQuestion();
}

function gameOver () {
    playerLives--;
    showPlayerLives.textContent = playerLives;
    if (playerLives === 0) {
    playAgain.style.display = "block";
    playAgain.textContent = "Play Again?";
    gameScoreDisplay.textContent = "That's incorrect. The correct answer was : "+correctAnswer+" You scored "+userScore+" points";
    }else {
        gameScoreDisplay.textContent = "That's incorrect. The correct answer was : "+correctAnswer;
        setTimeout(() => {
            prepareQuestion();
        }, 2500);
    }
}

function checkForAskedQuestion (questionAsked) {
//    console.log(questionAlreadyAsked, ' already');
//    console.log(questionAsked, ' asked')
    	if (questionAlreadyAsked.includes(questionAsked)) {
            questionAlreadyAsked.push(questionAsked);
                console.log("seen");
                console.log(questionAlreadyAsked);
                console.log(questionAsked);
            return false;
        }else {
            questionAlreadyAsked.push(questionAsked);
                console.log("unseen");
            return true;
        }
        
}