let countspan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document .querySelector(".countdown");



let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;
function getquestions()
{
    let myrequest = new XMLHttpRequest();
    myrequest.onreadystatechange = function()
    {
        if(this.readyState === 4 && this.status === 200)
        {
           let questionsObjects =  JSON.parse(this.responseText);
           let qCount = questionsObjects.length;
           createBullets(qCount);
           addQuestionsData(questionsObjects[currentIndex] , qCount);
           countDown(100 , qCount);
           submitButton.onclick = () => 
           {
               let theRightAnswer = questionsObjects[currentIndex].right_answer;

               currentIndex++;

               checkAnswer(theRightAnswer , qCount);

               quizArea.innerHTML = "";
               answersArea.innerHTML = "";
               addQuestionsData(questionsObjects[currentIndex] , qCount);

               handleBullets();
               clearInterval(countDownInterval);
               countDown(100 , qCount);
               showResults(qCount);

           }
        }
    }
    myrequest.open("GET" , "html_questions.json" , true);
    myrequest.send();
};
getquestions();

function createBullets(num)
{
    countspan.innerHTML = num

for (let i = 0; i < num; i++)
{
    let theBullet = document.createElement("span");
    if(i === 0 )
    {
        theBullet.className ="on";
    }
    bulletsSpanContainer.appendChild(theBullet);
}

}

function addQuestionsData (obj , count)
{
    if(currentIndex < count)
    {
        
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }        
  }
}

function checkAnswer(rAnswer , count )
{
    let answers = document.getElementsByName("question");
    let choosenAnswer;
    for(let i =0 ; i < answers.length ; i++)
    {
        if(answers[i].checked)
        {
           choosenAnswer = answers[i].dataset.answer;
        }

        if(rAnswer === choosenAnswer)
        {
            rightAnswer++;

        }
    }

}

function handleBullets()
{
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan = Array.from(bulletsSpans);
        arrayOfSpan.forEach((span,index) => {
            if(currentIndex ===index )
            {
                span.className = "on";
            }
        });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
      quizArea.remove();
      answersArea.remove();
      submitButton.remove();
      bullets.remove();

      if (rightAnswer > count / 2 && rightAnswer < count)
      {
          theResults = `<span class = "good">Good</span> , ${rightAnswer} from ${count}`;
      } 
      else if (rightAnswer === count)
      {
        theResults = `<span class = "Perfect">perfect</span> , ${rightAnswer} from ${count}`;
      } 
      else (rightAnswer < count)
      {
        theResults = `<span class = "bad">Bad</span> , ${rightAnswer} from ${count}`; 
      }

      resultsContainer.innerHTML = theResults;
      resultsContainer.style.padding ="10px";
      resultsContainer.style.backgroundColor = "white";
      resultsContainer.style.marginTop ="10px"
    }

}

function countDown (duration , count)
{
    if(currentIndex < count)
    {
        let minutes , seconds;
        countDownInterval = setInterval(function(){
             minutes = parseInt(duration / 60);
             seconds = parseInt(duration % 60);

             minutes = minutes < 10 ? `0${minutes}` : minutes;
             seconds = seconds < 10 ? `0${seconds}`  : seconds;
            
             countdownElement.innerHTML = `${minutes}:${seconds}`;
             if(--duration < 0)
             {
                 clearInterval(countDownInterval);
                 submitButton.click();
             }

        },1000)
    }
}


