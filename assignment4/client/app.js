// var favoritePlaces = ["Red Fort", "Sakura", "Benja's", "McDonalds"];

var courses = [];
var courseList = document.querySelector("#course-list");

var courseNameInput = document.querySelector("#course-name");
var courseDescriptionInput = document.querySelector("#course-description");
var professorInput = document.querySelector("#professor");
var courseDaysInput = document.querySelector("#course-days");
var courseTimeInput = document.querySelector("#course-time");
var profileLogin = document.querySelector("#profile");

var addButton = document.querySelector("#add-button");
console.log("add button", addButton);

addButton.onclick = function () {
  console.log("add button was clicked");
  data = "course=" + encodeURIComponent(courseNameInput.value);
  data1 = "description=" + encodeURIComponent(courseDescriptionInput.value);
  data2 = "professor=" + encodeURIComponent(professorInput.value);
  data3 = "days=" + encodeURIComponent(courseDaysInput.value);
  data4 = "time=" + encodeURIComponent(courseTimeInput.value);
  console.log("data to be sent to server", data, data1, data2, data3, data4)
  fetch("http://localhost:8080/courses", {
    credentials: "include",
    method: "POST",
    body: data + "&" + data1 + "&" + data2 + "&" + data3 + "&" + data4,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log("Success!")
    loadDataFromServer()
  })
  courseDescriptionInput.value = ""
  courseNameInput.value = ""
  professorInput.value = ""
  courseDaysInput.value = ""
  courseTimeInput.value = ""
};

/*var pickButton = document.querySelector("#pick-button");
console.log("pick button", pickButton);
pickButton.onclick = function () {
  console.log("pick button was clicked");
  var randomIndex = Math.floor(Math.random() * favoritePlaces.length);
  var newListItem = document.createElement("li");
  newListItem.innerHTML = favoritePlaces[Math.floor(Math.random()*favoritePlaces.length)];
  courseList.appendChild(newListItem);
};*/



function loadDataFromServer () {
  fetch('http://localhost:8080/courses', {
    credentials: "include",
  }).then(function (response) {
    console.log("response received");
    if (response.status == 401){
      courseList.style.display = "none";
      courseNameField.style.display = "none";
      if (login.style.display == "flex"){
        signup.style.display = "none";
        login.style.display = "flex";
      } else {
        signup.style.display = "flex";
        login.style.display = "none";
      }
    } else if (response.status == 200){
      courseList.style.display = "flex";
      courseNameField.style.display = "flex";
      signup.style.display = "none";
      login.style.display = "none";
      profileLogin.firstChild.innerHTML = "Logout";
    }
    response.json().then(function (data) {
      console.log("response data received:", data);
      courses = data;
      var courseList = document.querySelector("#course-list");
      courseList.innerHTML = "";
      var courseToBeEdited = ""
      courses.forEach(function (course) {
        var courseListUl = document.createElement("ul");
        courseListUl.classList.add("course");
        courseList.appendChild(courseListUl);

        var courseLi = document.createElement("li");
        courseLi.setAttribute("class", "course-name");
        courseLi.innerHTML = course.course;
        courseListUl.appendChild(courseLi);

        var descriptionLi = document.createElement("li");
        descriptionLi.setAttribute("class", "course-description");
        descriptionLi.innerHTML = course.description;
        courseListUl.appendChild(descriptionLi)

        var professorLi = document.createElement("li");
        professorLi.setAttribute("class", "professor");
        professorLi.innerHTML = course.professor;
        courseListUl.appendChild(professorLi);

        var courseDaysLi = document.createElement("li");
        courseDaysLi.setAttribute("class", "course-days");
        courseDaysLi.innerHTML = course.days;
        courseListUl.appendChild(courseDaysLi);

        var courseTimeLi = document.createElement("li");
        courseTimeLi.setAttribute("class", "course-time");
        courseTimeLi.innerHTML = course.time;
        courseListUl.appendChild(courseTimeLi);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = function() {
          if (confirm("Are you sure you want to delete?") == true){
            console.log("Delete me", course.id);
            deleteCourseFromServer(course.id);
          } else {
            console.log("User cancelled delete")
          }
        };
        courseListUl.appendChild(deleteButton);

        var confirmButton = document.querySelector("#confirm-button");
        var cancelButton = document.querySelector("#cancel-button");
        var editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.onclick = function() {
          addButton.style.display = "none"
          confirmButton.style.display = "inline-block"
          cancelButton.style.display = "inline-block"
          courseNameInput.value = editButton.parentElement.children[0].innerHTML
          courseDescriptionInput.value = editButton.parentElement.children[1].innerHTML
          professorInput.value = editButton.parentElement.children[2].innerHTML
          courseDaysInput.value = editButton.parentElement.children[3].innerHTML
          courseTimeInput.value = editButton.parentElement.children[4].innerHTML
          courseToBeEdited = course.id;
        };
        courseListUl.appendChild(editButton);

        cancelButton.onclick = function() {
          addButton.style.display = "inline"
          confirmButton.style.display = "none"
          cancelButton.style.display = "none"
          courseDescriptionInput.value = ""
          courseNameInput.value = ""
          professorInput.value = ""
          courseDaysInput.value = ""
          courseTimeInput.value = ""
          courseToBeEdited = ""
        }

        confirmButton.onclick = function() {
          editCourseFromServer(courseToBeEdited);
          addButton.style.display = "inline"
          confirmButton.style.display = "none"
          cancelButton.style.display = "none"
          courseDescriptionInput.value = ""
          courseNameInput.value = ""
          professorInput.value = ""
          courseDaysInput.value = ""
          courseTimeInput.value = ""
          courseToBeEdited = ""
        }
      })
    });
  });
}

function deleteCourseFromServer (courseId) {
  fetch("http://localhost:8080/courses/" + courseId, {
    credentials: "include",
    method: "DELETE"
  }).then(function (response) {
    console.log("Course deleted");
    loadDataFromServer();
  });
}


function editCourseFromServer (courseId) {
  data = "course=" + encodeURIComponent(courseNameInput.value);
  data1 = "description=" + encodeURIComponent(courseDescriptionInput.value);
  data2 = "professor=" + encodeURIComponent(professorInput.value);
  data3 = "days=" + encodeURIComponent(courseDaysInput.value);
  data4 = "time=" + encodeURIComponent(courseTimeInput.value);
  fetch("http://localhost:8080/courses/" + courseId, {
    credentials: "include",
    method: "PUT",
    body: data + "&" + data1 + "&" + data2 + "&" + data3 + "&" + data4,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log("Course edited");
    loadDataFromServer();
  })
}

loadDataFromServer();

function createAssignmentTitle () {
  var assignmentTypes = ["Quiz", "Reading", "Program", "Test", "Assignment"];
  var value = Math.floor(Math.random() * 5);
  var assignmentTitle = assignmentTypes[value] + " " + (Math.floor(Math.random() * 11) + 1);
  return assignmentTitle
}

//console.log("Assignment title", createAssignmentTitle())



function createAssignments (){
  var assignmentList = document.querySelector("#assignment-list");
  var newAssignmentItem = document.createElement("li");
  newAssignmentItem.classList.add("assignment-list-child");
  newAssignmentItem.innerHTML = createAssignmentTitle();
  assignmentList.appendChild(newAssignmentItem);
}

for (i = 0; i < (Math.floor(Math.random() * 7) + 3); i++) {
  createAssignments()
}

var assignmentListChild = document.querySelectorAll(".assignment-list-child");

assignmentListChild.onclick = function() {
  console.log("assignmentListChild was clicked", assignmentListChild)
}


var login = document.querySelector("#login");
var signup = document.querySelector("#signup")
login.style.display = "none";

var signupSwitchButton = document.querySelector("#signup-switch");
signupSwitchButton.onclick = function() {
  login.style.display = "none"
  signup.style.display = "flex"
}

var loginSwitchButton = document.querySelector("#login-switch");
loginSwitchButton.onclick = function() {
  login.style.display = "flex"
  signup.style.display = "none"
}
var userProfile = document.querySelector("#user-profile")
profileLogin.onclick = function(){
  if (courseNameField.style.display == "none"){
    login.style.display = "flex"
    signup.style.display = "none"
  }
}

var courseNameField = document.querySelector("#course-name-field");
courseNameField.style.display = "none"

var signupButton = document.querySelector("#signup-button");
var loginButton = document.querySelector("#login-button");

signupFirstName = document.querySelector("#signup-first-name");
signupLastName = document.querySelector("#signup-last-name");
signupEmail = document.querySelector("#signup-email");
signupPassword = document.querySelector("#signup-password");
signupButton.onclick = function() {

  fetch("http://localhost:8080/users", {
    credentials: "include",
    method: "POST",
    body: data + "&" + data1 + "&" + data2 + "&" + data3,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    //loadDataFromServer()
    if (response.status == 201){
      courseList.style.display = "none";
      courseNameField.style.display = "none";
      signup.style.display = "none";
      login.style.display = "flex";
      console.log("User created")
    } else{
      alert("Please enter a new email.")
    }
  })
}

loginEmail = document.querySelector("#login-email");
loginPassword = document.querySelector("#login-password");
loginButton.onclick = function() {
  data = "email=" + encodeURIComponent(loginEmail.value);
  data1 = "password=" + encodeURIComponent(loginPassword.value);
  fetch("http://localhost:8080/sessions", {
    credentials: "include",
    method: "POST",
    body: data + "&" + data1,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    loadDataFromServer()
    if (response.status == 201){
      courseList.style.display = "flex";
      courseNameField.style.display = "flex";
      login.style.display = "none";
      profileLogin.firstChild.innerHTML = "Logout";
    } else{
      alert("The email or password you entered was invalid.")
    }
  })
}

// when page loads ie: load function
//    load courses data retrieve_courses_data
//    if (response.status == 401){
//        hide courses UI
//        show login/register UI
//        when user logs in successfully load courses data retrieve_course_data
// } else if (response.status == 200){
//        show courses UI
//        hide login/register UI
// }
