import './main.css'

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, getDocs } from "firebase/firestore";
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

  /**
   * Retrieves questions from the firestore.
   */
  async function loadQuestions(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDocs(collection(db, "__dev", "datastore", "questions"))
      const questions = []
      snapshot.forEach((doc) => {
        questions.push(doc.data())
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
  
  return (
    <>
      {questions.map((q, i) => 
        <Question key={i} text={q.text}/>
      )}
      <button className="bg-indigo-500 rounded-md p-2 mt-4">Submit!</button>
    </>
  )
}

/**
 * Renders an individual question, comprised of the question text
 * and an input for the answer.
 */
function Question(props: { text: string }) {

  const [answer, setAnswer] = useState('')

  return (
    <div className="">
      <label className="block">{props.text}</label> 
      <input 
        type="text" 
        className="block text-black" 
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
    </div>
  )
}

export default App
