import './App.css';
import React from 'react'
import validator from '@rjsf/validator-ajv8';
import schema from './constants/moochub-schema.json'
import Form from '@rjsf/mui';


function App() {

  const [formData, setFormData] = React.useState(JSON.parse(localStorage.getItem("formData")) || null);
  console.log(formData)

  const downloadJsonFile = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(formData)], { type: 'text/json' });
    element.href = URL.createObjectURL(file);
    element.download = "moochubApiExport.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const onChange = (e) => {
    localStorage.setItem("formData", JSON.stringify(e.formData));
    setFormData(e.formData)
  }

const clearForm = () => {
  localStorage.removeItem("formData")
  setFormData(null)
}

  return (
    <div className="App-wrapper">
      <button onClick={clearForm}>Clear Form</button>

      <Form
        schema={schema}
        formData={formData}
        onChange={onChange}
        validator={validator}
        onSubmit={downloadJsonFile}
      />
      <button onClick={downloadJsonFile}>Export</button>
    </div>
  );
}

export default App;
