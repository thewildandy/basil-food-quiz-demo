import './main.css'

function App() {
  return (
    <div className="flex mt-6 justify-center">
      <div className="bg-gray-600 text-white text-xl p-6" style={{width: '400px'}}>
        <h2 className="font-bold">Food Quiz!</h2>
        {[1,2,3].map(q => 
          <div className="">
            <label className="block">Question text</label> 
            <input type="text" className="block"/>
          </div>  
        )}
        <button className="bg-indigo-500 rounded-md p-2 mt-4">Submit!</button>
      </div>
    </div>
  )
}

export default App
