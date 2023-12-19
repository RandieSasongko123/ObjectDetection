import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd"
import "./App.css";
import { useEffect, useState } from "react";

function App()
{
  // Pemanggilan data atau model yang digunakan dengan nilai awal kosong
  const [model, setModel] = useState()

  // Code untuk menampilkan hasilnya menggunakan state 
  const [objectNames, setObjectNames] = useState([]) // Use array to store object names
  const [objectScores, setObjectScores] = useState([]) // Use array to store object scores

  // load model atau mengambil model dataset dari coco ssd tensorflow
  async function loadModel()
  {
    try{
      const dataset = await cocoModel.load()
      setModel(dataset)
      console.log('dataset siap')
    }catch(err) {
      console.log(err)
    }
  }

  // Yang dilakukan ketika awal website dibuka yaitu : meload data modelnya
  useEffect(() => {
    tf.ready().then(() => {
      loadModel()
    })
  }, [])

  // Untuk Reset agar tidak tertumpuk
  function resetResults() {
    setObjectNames([]);
    setObjectScores([]);
  }  

  // Fungsi untuk memprediksi gambar yang didapat
  async function predict()
  {
    resetResults();

    const detection = await model.detect(document.getElementById("videoSource"))
    console.log(detection)
    if(detection.length > 0)
    {
      // Get the canvas element and its context
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      // Draw the webcam image on the canvas
      ctx.drawImage(document.getElementById("videoSource"), 0, 0, canvas.width, canvas.height);

      // Loop through the detection array
      detection.forEach((result, i) => {

        // Get the object name, score, and bounding box
        const name = result.class;
        const score = result.score;
        const [x, y, width, height] = result.bbox;

        // Draw a rectangle around the object
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Add the object name and score to the arrays
        setObjectNames(objectNames => [...objectNames, name]);
        setObjectScores(objectScores => [...objectScores, score]);
      })
    }
  }

  // Ukuran Vidio Preview
  const videoOption = {
    width : 320,
    height : 160,
    facingMode : "environment"
  }

  return (
    <div className="App">
      <div className="object_result">
        <h1>Object Detection</h1>
        <canvas id="canvas" width="320" height="160"></canvas>
        <div id="results">
          {objectNames.map((name, i) => ( // Use map to display the object names and scores
            <p class="result_class_score" key={i}>Object : <span>{name}</span> dengan kemungkinan sekitar <span>{(objectScores[i]*100).toFixed(0)}%</span></p>
          ))}
        </div>
      </div>
      <div className="webcam">
        <h3>Webcam</h3>
        <Webcam
        id="videoSource"
        audio={false}
        videoConstraints={videoOption}
        />
        <br />  
        <br />
        <button onClick={() => predict()}>TEBAK OBJEK</button>
      </div>
    </div>
  )
}

export default App;
