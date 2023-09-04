import React, { useEffect } from "react";
import { useState } from "react";
import Form from "react-jsonschema-form";
import validateFormData from "react-jsonschema-form/lib/validate";
import { useNavigate, useSearchParams } from "react-router-dom";
import schema from "../../constants/moochub-schema.json";

export const MoochubEditor = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCourseName = searchParams.get("course");
  var courses = JSON.parse(localStorage.getItem("courses"));
  var currentCourse = courses[currentCourseName];
  const navigate = useNavigate();

  const [formState, setFormstate] = React.useState(currentCourse || null);

  useEffect(() => {
    courses = JSON.parse(localStorage.getItem("courses"));
    currentCourse = courses[currentCourseName];
    setFormstate(currentCourse);
  }, [currentCourseName]);

  useEffect(() => {
    localStorage.setItem(
      "courses",
      JSON.stringify({ ...courses, [currentCourseName]: formState })
    );
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
        validator={validateFormData}
        onSubmit={downloadJsonFile}

      />
      <button onClick={clearForm}>Clear Form</button>
      <button onClick={removeCourse}>Delete Course</button>
      
    </div>
  );
};