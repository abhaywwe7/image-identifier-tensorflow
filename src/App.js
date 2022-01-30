import { useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
function App() {
  const [isModelLoading, setisModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const loadModel = async () => {
    setisModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setisModelLoading(false);
    } catch (error) {
      console.log(error);

      setisModelLoading(false);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return <h2>Model is loading...</h2>;
  }

  return (
    <div className="App">
      <h1>This is an Image Identifier App</h1>
    </div>
  );
}

export default App;
