// Comme d'habitude, je commence par déclarer les constantes pour tous les objets HTML dont j'aurai besoin
// Beaucoup plus propre avec le nouveau design (merci, André !)
const quizTheme    = document.querySelectorAll(".quizTheme"),
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

// Une méthode utile que j'ai trouvée pour contourner le message "Cette page doit renvoyer des informations..."
playAgain.addEventListener("click", function() {
    window.location.href = window.location.href;
});

// Lorsque je ne suis pas sûr quelles fonctions auront besoin d'accéder aux variables suivantes, je les déclare ici, (vides), afin qu'elles soient accessibles globalement
let category  = "",
difficulty    = "",
userScore     = 0,
diffBonus     = 1,
playerLives   = 3,
questionArray = [],
questionAlreadyAsked = [];

// Cette fonction est utilisée si un joueur a épuisé les questions disponibles
function getNewQuizTheme() {
    for (let i = 0; i < quizTheme.length; i++) {
        quizTheme[i].addEventListener("click", setQuizTheme);
    }
    gameQuestionWindow.style.display = "none";
    quizThemeField.style.display = 'block';
}

// Écouter le thème sélectionné.
for (let i = 0; i < quizTheme.length; i++) {
    quizTheme[i].addEventListener("click", setQuizTheme);
}

// Définir le thème, changer l'affichage et configurer les écouteurs nécessaires pour l'étape suivante
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

//  Comme précédemment, mais pour le niveau de difficulté
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
// Dans les 2 étapes précédentes, j'ai supprimé les écouteurs (même si leurs objets ne sont plus affichés)
// Ayant déjà rencontré des difficultés avec les écouteurs, j'ai pris l'habitude de toujours les supprimer

// Envoyer la requête API pour la catégorie et la difficulté sélectionnées
// Au début, je recevais une question à la fois. Cela causait des erreurs de "trop de requêtes". Pour résoudre cela, j'ai augmenté la taille de la requête, j'ai tout placé dans un tableau et je l'ai envoyé plus loin dans le processus
function getQuestions () {
    quizDiffList.style.display = "none";
    $.get (`https://opentdb.com/api.php?amount=7&category=${category}&difficulty=${difficulty}&type=multiple`, (quests) => { 
        questionArray = quests;
        prepareQuestion();
    });
}

function prepareQuestion () {
    gameQuestionWindow.style.display = "block";
    gameScoreDisplay.textContent     = "Your score is :"+ userScore;
    showPlayerLives.textContent      = playerLives;
    if (questionArray.results.length === 0) {       // Tout d'abord, assurer qu'il reste encore une question, si c'est le cas, la retirer avec .pop()
        getQuestions();
        return;
    } 
    let findQuestion = [];
    // Ensuite, découpez-la en ses morceaux nécessaires
    findQuestion        = questionArray.results.pop();
    let theQuestion     = findQuestion.question;
    let theCategory     = findQuestion.category;
    let possibleAnswers = findQuestion.incorrect_answers;
    let questionAsked   = findQuestion.question;
    possibleAnswers.push(findQuestion.correct_answer);
    correctAnswer = decodeHtmlEntities(findQuestion.correct_answer); // Il sera nécessaire de convertir les HtmlSpecialChars (explication plus détaillée ci-dessous)
    
    for (let i = possibleAnswers.length - 1; i > 0; i--) {      // Mélangez les réponses sinon 4 est toujours la bonne réponse
        const j = Math.floor(Math.random() * (i + 1));
        [possibleAnswers[i], possibleAnswers[j]] = [possibleAnswers[j], possibleAnswers[i]];
    }
    // Les questions étaient constamment répétées. 
    // Pour résoudre cela, j'ai créé un tableau pour contenir toutes les questions précédemment posées et vérifier que la question sélectionnée n'est pas incluse
    if (checkForAskedQuestion (questionAsked) === true) {
        showQuestion(theQuestion, possibleAnswers, theCategory);
    }else {
        // Si toutes les questions ont été posées, demandez au joueur de choisir un nouveau thème/difficulté.
        alert("You have answered all questions available at that level of difficulty in your category. Please choose another");
        getNewQuizTheme();
        //    return;
    }
}
// Parce que la requête retourne, par exemple, &lpar; au lieu de (
// Je les convertis donc pour qu'ils correspondent
function decodeHtmlEntities(html) {
    // Pour ce faire, créez un élément temporaire dans lequel le faire
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
    if (questionAlreadyAsked.includes(questionAsked)) {
        questionAlreadyAsked.push(questionAsked);
        return false;
    }else {
        questionAlreadyAsked.push(questionAsked);
        return true;
    }
}
    
    
    
    /*




- 
- 
- 
- .
    
    */