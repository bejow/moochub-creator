import React, { useEffect, useState } from "react";
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8'
import { useNavigate, useSearchParams } from "react-router-dom";
import schema from "../../constants/moochub-schema.json";

export const MoochubEditor = () => {
  const [searchParams] = useSearchParams();
  const currentCourseName = searchParams.get("course");
  var courses = JSON.parse(localStorage.getItem("courses"));
  var currentCourse = courses[currentCourseName];
  const navigate = useNavigate();

  const [formState, setFormstate] = useState(currentCourse || null);

  useEffect(() => {
    setFormstate(currentCourse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCourseName]);

  useEffect(() => {
    localStorage.setItem(
      "courses",
      JSON.stringify({ ...courses, [currentCourseName]: formState })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  const downloadJsonFile = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(formState)], { type: "text/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${currentCourseName}-moochubApiExport.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const onChange = (e) => {
    setFormstate(e.formData);
  };

  const removeCourse = () => {
    let coursesCopy = {...courses}
    delete coursesCopy[currentCourseName]
    localStorage.setItem(
      "courses",
      JSON.stringify({ ...coursesCopy})
    );
    navigate("/")
  }

  const clearForm = () => {
    localStorage.setItem(
      "courses",
      JSON.stringify({ ...courses, [currentCourseName]: null })
    );
    setFormstate(null);
  };

  return (
    <div>
      <button onClick={downloadJsonFile}>Export</button>
      <Form
        schema={schema}
        formData={formState}
        onChange={onChange}
        validator={validator}
        onSubmit={downloadJsonFile}

      />
      <button onClick={clearForm}>Clear Form</button>
      <button onClick={removeCourse}>Delete Course</button>
      
    </div>
  );
};
