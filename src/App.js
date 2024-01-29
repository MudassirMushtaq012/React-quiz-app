import logo from './logo.svg';
import './App.css';
import React from "react";
import { useState,useEffect } from 'react';
import './quiz.css'
import pass from './result img/pass.gif'
import fail from './result img/fail.webp'



function App() {
  const [question,setQuestion] = useState([])
  const [currentIndex,setCurrentindex] = useState(0)
  const [score,setScore] = useState(0)
  const [btnDisabled,setBtnDisabled] = useState(true)
  const [selectedOption,setSelectedOption] = useState()
  const [timer,setTimer] = useState(14)
  const [timerColor,setTimerColor] = useState({
    color : 'blue'
  })
  const [quizResult, setQuizResult] = useState({
    display : 'none'
  })
  const [quiz, setQuiz] = useState({
    display : 'block'
  })

  useEffect(() => {
    getDataFromAPI()
  },[])


  useEffect(() => {
    const interValid = setInterval(() => {
      setTimer((timer) => timer - 1)
    },1000)
    return () => clearInterval(interValid)
  },[])

  function quizTimer(){
    if(timer < 1 && currentIndex < question.length - 1){
      setCurrentindex(currentIndex + 1)
      setTimer(14)
    }
    else if(currentIndex >= 9 && timer < 1){
      quizResultS()
    }
  }

  quizTimer()

  function getDataFromAPI(){
    fetch('https://the-trivia-api.com/v2/questions')
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      data.map(function(item){
        item.options = [...item.incorrectAnswers,item.correctAnswer]
        item.options = shuffle(item.options)
        // console.log(data);
      })
      setQuestion(data)
      console.log(data);
    })
    // .catch((err) => console.log(err))
  }

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
  var arr = [2, 11, 37, 42];
  shuffle(arr);
  // console.log(arr);

  if(!question.length){
     return <div className='loader'>
      <h1><img width={'100px'} src="https://i.gifer.com/ZZ5H.gif" alt="#" /></h1>
    </div>
  }


  function next(){
    setBtnDisabled(true)
    if(currentIndex == 9){
      setQuiz({
        display : 'none'
      })
      setQuizResult({
        display : 'block'
      })
    }else if(currentIndex < question.length - 1){
      setCurrentindex(currentIndex + 1)
      setTimer(14)
    }
    if(selectedOption == question[currentIndex].correctAnswer){
      setScore(score + 1)
      console.log(score);
    }
    // setClicked(true)
    // setIsChecked(true);
  }

  function optionClick(a,e){
    setBtnDisabled(false)
    setSelectedOption(a)
    // console.log(a)
    // console.log(e)
  }
  function restart(){
    window.location.reload()
  }

  function quizResultS(){
    if(quizResult.display == 'none' && quiz.display == 'block'){
      setQuiz({
        display : 'none'
      })
      setQuizResult({
        display : 'block'
      })
    }
  }


  return (
    <>
     <div className='maindiv' style={quiz}>

      <div className='quiz-navbar'>
        <h1>Quiz App</h1>
        <h1 className='h1timer' style={timerColor}>{timer}</h1>
      </div>


       <div className='center-div'>
       <h3 className='h3'>{currentIndex + 1}.{question[currentIndex].question.text}</h3>
       {question[currentIndex].options.map(function(data,i){
         return <div key={i}>
            {/* {console.log(i)} */}
             <button className='mainbtn' onClick={()=>optionClick(data,i)}>{data}</button>
          </div>
       })}
       <br/>
       <button className='nextbtn' disabled={btnDisabled} onClick={next}>{currentIndex == 9 ? 'Submit' : 'Next'}</button>
       </div>
     
     </div>


     <div style={quizResult} className='result'>

        <div className='result-navbar'>
          <h1>Quiz Result</h1>
        </div>

        <div className='gif'>
            {score >= 6 ? <img width={300} src={pass} alt="" /> : <img width={300} src={fail} alt="" />}
          </div>

        <div className='pass-fail'>
          {score >= 6 ? <h3 className='pass'>Congratulation You Pass</h3> : <h3 className='fail'>Sorry! You Fail.</h3>}
        </div>

        <div className='resultdiv'>
          <h1>{score}0%</h1>
        </div>

        <div className='restartdiv'>
          <button className='restartbtn' onClick={restart}>Restart</button>
        </div>

     </div>
    </>
  );
}

export default App;
