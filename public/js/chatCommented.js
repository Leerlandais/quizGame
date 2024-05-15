// Constants for all the 'solid' items needed
const quizTheme          = document.querySelectorAll(".quizTheme"),
      quizThemeField     = document.getElementById("quizThemeField"),
      quizLegend         = document.getElementById("quizLegend"),
      quizDiff           = document.querySelectorAll('.quizDiff'), 
      quizDiffList       = document.getElementById("quizDiffList"),
      quizDiffField      = document.getElementById('quizDiffField'),
      answerList         = document.querySelectorAll(".answerList"),
      answerListHolder   = document.getElementById('answerListHolder'),
      gameMachine        = document.getElementById("gameMachine"), 
      gameScoreDisplay   = document.getElementById("gameScoreDisplay"),
      gameQuestionWindow = document.getElementById('gameQuestionWindow'),
      showPlayerLives    = document.getElementById("showPlayerLives"),
      playAgain          = document.getElementById("playAgain");
      playAgain.addEventListener("click", function() { 
        window.location.href = window.location.href; 
      });
// set up the 'fluid' items
let category      = "",
    difficulty    = "",
    userScore     = 0, 
    diffBonus     = 1, 
    playerLives   = 3, 
    questionArray = [],
    questionAlreadyAsked = [];

// Loop to add click event listener to each quiz theme element
for (let i = 0; i < quizTheme.length; i++) {
    quizTheme[i].addEventListener("click", setQuizTheme);
}

// Function to handle click event for selecting a new quiz theme
function getNewQuizTheme() {
    // Re-add click event listeners to quiz theme elements
    for (let i = 0; i < quizTheme.length; i++) {
        quizTheme[i].addEventListener("click", setQuizTheme);
    }
    // Hide game elements and show quiz theme selection field
    gameQuestionWindow.style.display = "none";
    quizThemeField.style.display = 'block';
}

// Function to handle click event for setting quiz theme
function setQuizTheme() {
    // Remove click event listeners from quiz theme elements
    for (let i = 0; i < quizTheme.length; i++) {
        quizTheme[i].removeEventListener("click", setQuizTheme);
    }
    // Hide quiz theme selection field
    quizThemeField.style.display = 'none';
    // Set category to selected theme
    category = this.id;
    // Show difficulty selection field and list
    quizDiffField.style.display = "block";
    quizDiffList.style.display = "block";
    // Update quiz legend text
    quizLegend.textContent = "And now the difficulty";
    
    // Loop to add click event listener to each difficulty element
    for (let i = 0; i < quizDiff.length; i++) {
        quizDiff[i].addEventListener("click", setQuizDiff);
    }     
}

// Function to handle click event for setting quiz difficulty
function setQuizDiff () {
    // Remove click event listeners from difficulty elements
    for (let i = 0; i < quizDiff.length; i++) {
        quizDiff[i].removeEventListener("click", setQuizDiff);
    }   
    // Set difficulty to selected difficulty
    difficulty = this.id;
    // Determine difficulty bonus
    difficulty === "hard" ? diffBonus = 2 : difficulty === "medium" ? diffBonus = 1.5 : diffBonus = 1;
    // Show game machine and update quiz legend text
    gameMachine.style.display = "block";
    quizLegend.textContent = "Let's Play";
    
    // Fetch questions
    getQuestions();
}

// Function to fetch questions from API
function getQuestions () {
    // Hide difficulty list
    quizDiffList.style.display = "none";
    // Fetch questions from API based on selected category and difficulty
    $.get (`https://opentdb.com/api.php?amount=7&category=${category}&difficulty=${difficulty}&type=multiple`, (quests) => {
        // Store fetched questions
        questionArray = quests;
        console.log(quests);
        // Prepare question for display
        prepareQuestion();
    });
}

// Function to prepare question for display
function prepareQuestion () {
    // Show game question window and update score display and player lives
    gameQuestionWindow.style.display = "block";
    gameScoreDisplay.textContent = "Your score is :" + userScore;
    showPlayerLives.textContent = playerLives;
    // If no questions left, fetch new questions
    if (questionArray.results.length === 0) {
        getQuestions();
        return;
    } 
    // Pop a question from questionArray
    let findQuestion = questionArray.results.pop();
    let theQuestion = findQuestion.question;
    let theCategory = findQuestion.category;
    let possibleAnswers = findQuestion.incorrect_answers;
    let questionAsked = findQuestion.question;
    // Add correct answer to possible answers and shuffle them
    possibleAnswers.push(findQuestion.correct_answer);
    correctAnswer = decodeHtmlEntities(findQuestion.correct_answer); // need to convert the HtmlSpecialChars
    
    // Shuffle the answers
    for (let i = possibleAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleAnswers[i], possibleAnswers[j]] = [possibleAnswers[j], possibleAnswers[i]];
    }
    // If question has not been asked before, show it
    if (checkForAskedQuestion(questionAsked) === true) {
        showQuestion(theQuestion, possibleAnswers, theCategory);
    } else {
        // If all questions at this difficulty level have been asked, prompt user to choose another category
        alert("You have answered all questions available at that level of difficulty in your category. Please choose another");
        getNewQuizTheme();
    }
}

// Function to decode HTML entities
function decodeHtmlEntities(html) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
}

// Function to show question and answers
function showQuestion (theQuestion, possibleAnswers, theCategory) {
    console.log("use this :", correctAnswer);
    const gameCategory = document.getElementById('gameCategory');
    // Show game category, question, and answer list
    gameCategory.style.display = "block";
    gameCategory.innerHTML = theCategory;
    gameMachine.innerHTML = theQuestion;
    answerListHolder.style.display = "block";
    // Populate answer list with shuffled answers

}