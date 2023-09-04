import { useEffect, useState, useRef } from "react";

import {
  Outlet,
  Link,
  useNavigate,
  createSearchParams,
  useSearchParams,
} from "react-router-dom";
import useIsMobile from "../../utils/hooks/useIsMobile";
import { isSizeMobile } from "../../utils/screensize";
import styles from "./Layout.module.scss";
import classNames from "classnames";
import useClickOutside from "../../utils/hooks/useClickOutside";

export default function Layout() {
  const { size, isMobile } = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hideSidebar, setHideSidebar] = useState(false);
  const [courses, setCourses] = useState(
    JSON.parse(localStorage.getItem("courses")) || {}
  );
  const [creatingNewCourse, setCreatingNewCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const navigate = useNavigate();
  const currentCourseName = searchParams.get("course");

  const newCourseInputRef = useRef(null);
  useClickOutside(newCourseInputRef, () => setCreatingNewCourse(false));

  const toggleSidebar = () => {
    setHideSidebar(!hideSidebar);
  };

  const onAddCourseClick = () => {
    setCreatingNewCourse(true);
  };

  useEffect(() => {
    setCourses(JSON.parse(localStorage.getItem("courses")) || {})
  }, [searchParams])
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const courseName = e.target.files[0].name.replace("-moochubApiExport.json", "");
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        console.log("e.target.result", e.target.result);
        console.log("e.target", e.target);
        const prevCourses = JSON.parse(localStorage.getItem("courses"));
        const newCourses = { ...prevCourses, [courseName]: JSON.parse(e.target.result)};
        setCourses(newCourses);
        localStorage.setItem("courses", JSON.stringify(newCourses));
      };
    }
  };

  const addCourse = () => {
    if (newCourseName !== "") {
      const prevCourses = JSON.parse(localStorage.getItem("courses"));
      const newCourses = { ...prevCourses, [newCourseName]: null };
      setCourses(newCourses);
      localStorage.setItem("courses", JSON.stringify(newCourses));
      setCreatingNewCourse(false);
      setNewCourseName("");
      navigate({
        pathname: "course",
        search: createSearchParams({
          course: newCourseName,
        }).toString(),
      });
    }
  };

  const renderNewCourseButton = () => {
    if (!creatingNewCourse) {
      return (
        <div
          onClick={onAddCourseClick}
          className={classNames(styles.navItem, styles.newCourseBtn)}
        >
          Add new Course
        </div>
      );
    } else {
      return (
        <div ref={newCourseInputRef}>
          <input
            value={newCourseName}
            autoFocus
            className={classNames(styles.navItem, styles.newCourseInput)}
            type="text"
            name="courseName"
            placeholder="course name"
            onChange={(e) => setNewCourseName(e.target.value)}
          />
          <div onClick={addCourse} className={styles.addBtn}>
            +
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <button className={styles.menuToggleBtn}>
        <img
          className={styles.burgerImg}
          onClick={toggleSidebar}
          src="./assets/burger.png"
          alt="my image"
        />
      </button>
      <div
        className={classNames(styles.sidebar, { [styles.hide]: hideSidebar })}
      >
        {renderNewCourseButton()}
        <label className={classNames(styles.navItem, styles.newCourseBtn)}>
          <input accept=".json" type="file" onChange={handleFileChange} />
          Import Course
        </label>
        {Object.keys(courses).map((courseName) => (
          <Link
            style={{ textDecoration: "none" }}
            to={`/course?course=${courseName}`}
          >
            <div
              className={classNames(styles.navItem, {
                [styles.active]: courseName == currentCourseName,
              })}
            >
              {courseName}
            </div>
          </Link>
        ))}
      </div>

      <hr />

      <div
        className={classNames(styles.content, { [styles.expand]: hideSidebar })}
      >
        <Outlet />
      </div>
    </div>
  );
}
