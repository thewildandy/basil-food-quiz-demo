import './main.css'

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, getDocs, setDoc, addDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyAju55i18o-IQSelNHFtZMfxhJd70AFcAM",
  authDomain: "basil-food-quiz-lesson.firebaseapp.com",
  projectId: "basil-food-quiz-lesson",
  storageBucket: "basil-food-quiz-lesson.appspot.com",
  messagingSenderId: "458261520143",
  appId: "1:458261520143:web:d68ec27b1000d52df2a87a"
};
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function App() {
  return (
    <div className="flex mt-6 justify-center">
      <div className="bg-gray-600 text-white text-xl p-6" style={{width: '400px'}}>
        <h2 className="font-bold">Food Quiz!</h2>
        <FormController/>
      </div>
    </div>
  )
}

/**
 * Responsible for submitting the form answers and processing
 * the result.
 */
function FormController() {

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])

  /**
   * Retrieves questions from the firestore.
   */
  async function loadQuestions(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDocs(collection(db, "__dev", "datastore", "questions"))
      const questions: any[] = []
      snapshot.forEach((doc: any) => {
        const question = { ...doc.data() }
        question._id = doc.id
        questions.push(question)
      })
      resolve(questions)
    })
  }

  /**
   * On component first render, load our questions.
   */
  useEffect(() => {
    loadQuestions().then((questions) => {
      setQuestions(questions)
    })
  }, [])

  /**
   * Update our FormController's list of answers, so it 
   * always reflects the current values for all questions
   */
  function onAnswerChange(questionId, answer) {
    const newAnswer = {
      questionId: questionId,
      answerText: answer
    }

    setAnswers(currentValues => {
      const updatedAnswers = [ ... currentValues ]

      // Check if we already have an answer for this question
      const existingAnswer = updatedAnswers.findIndex((a) => a.questionId === newAnswer.questionId)
      if (existingAnswer >= 0) {
        // update the answer
        updatedAnswers[existingAnswer] = newAnswer
      } else {
        // create a new answer entry
        updatedAnswers.push(newAnswer)
      }

      // updatedAnswers.push(newAnswer)
      return updatedAnswers
    })
  }

  /**
   * Submit the answers to the database
   * Maybe do validation first
   * Display a success or error message
   */
  async function processSubmission() {
    const ref = await addDoc(collection(db, "__dev", "datastore", "answers"), { answers: answers })

    // const ref = await addDoc(collection(db, "__dev", "datastore", "answers"), JSON.stringify(answers))
    // console.log('answers stored with ref: ', ref)
  }
  
  return (
    <>
      {questions.map((q, i) => 
        <Question key={i} text={q.text} identifier={q._id} onChange={(answer) => { onAnswerChange(q._id, answer) }}/>
      )}
      <SubmitButton onClick={processSubmission}/>
      <div>
        Current answers: 
        {answers.length > 0 && (
          <div className="text-sm">
            {answers.map((a, i) => 
              <span key={i}><b>{a.questionId}: </b> <span>{a.answerText}</span></span>
            )}
          </div>
        )}
        {answers.length === 0 && <span>No answers yet</span>}
      </div>
    </>
  )
}

/**
 * Renders an individual question, comprised of the question text
 * and an input for the answer.
 */
function Question(props: { text: string, identifier: string, onChange: () => void }) {

  const [answer, setAnswer] = useState('')

  function handleChange(newValue) {
    setAnswer(newValue)
    props.onChange(newValue)
  }

  return (
    <div className="">
      <label className="block">{props.text}</label> 
      <input 
        type="text" 
        className="block text-black" 
        value={answer}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  )
}

function SubmitButton (props: { onClick: () => void }) {
  return (
    <button 
      className="bg-indigo-500 rounded-md p-2 mt-4"
      onClick={props.onClick}
    >
      Submit!
    </button>
  )
}

export default App
