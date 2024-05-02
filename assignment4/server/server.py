from flask import Flask, request, g
from courses_db import CoursesDB
from passlib.hash import bcrypt
from session_store import SessionStore

session_store = SessionStore()

class MyFlask(Flask):
    def add_url_rule(self, rule, endpoint=None, view_func=None, **options):
        return super().add_url_rule(rule, endpoint, view_func, provide_automatic_options=False, **options)

def load_session_data():
    print("the cookies:", request.cookies)

    # load the session ID from cookie data
    session_id = request.cookies.get("session_id")

    # if the session ID is present:
    if session_id:
        # load the session data using the session ID
        session_data = session_store.getSession(session_id)
        
    # if the session ID is missing or invalid:
    if session_id == None or session_data == None:
        # create a new session & session ID
        session_id = session_store.createSession()
        # load the session using the session ID
        session_data = session_store.getSession(session_id)

    # save the session ID and session data for use in other functions
    g.session_id = session_id
    g.session_data = session_data


app = MyFlask(__name__)

@app.before_request
def before_request_func():
    load_session_data()

@app.after_request
def after_request_func(response):
    print("session ID:", g.session_id)
    print("session data:", g.session_data)

    # send a cookie to the client with the session ID
    response.set_cookie("session_id", g.session_id, samesite="None", secure=True)
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin")
    response.headers["Access-Control-Allow-Credentials"] =  "true"
    return response

@app.route("/courses/<int:course_id>", methods=["OPTIONS"])
def cors_preflight(course_id):
    return "", 200, {
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Headers": "Content-Type",
    }

@app.route("/courses", methods=["GET"])
def retrieve_courses_collection():
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    db = CoursesDB()
    courses = db.getCourses()
    return courses

@app.route("/courses/<int:course_id>", methods=["GET"])
def retrieve_course_member(course_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    print("retrieve course with ID:", course_id)

    db = CoursesDB()
    course = db.getCourse(course_id)
    if course:
        return course
    else:
        return "Course with ID {} not found".format(course_id), 404

@app.route("/courses", methods=["POST"])
def create_in_courses_collection():
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    print("the request data is:", request.form)
    course = request.form["course"]
    description = request.form["description"]
    professor = request.form["professor"]
    days = request.form["days"]
    time = request.form["time"]

    
    db = CoursesDB()
    db.createCourse(course, description, professor, days, time)
    return "Created", 201

@app.route("/courses/<int:course_id>", methods=["DELETE"])
def delete_course_member(course_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    print("Requested to delete:", course_id)

    db = CoursesDB()
    course = db.getCourse(course_id)
    db.deleteCourse(course_id)
    if course:
        return "Deleted"
    else:
        return "Course with ID {} not found".format(course_id), 404


@app.route("/courses/<int:course_id>", methods=["PUT"])
def edit_course_member(course_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    print("Requested to modify:", course_id)
    db = CoursesDB()
    course = db.getCourse(course_id)
    if course is None:
        return "Course with ID {} not found".format(course_id), 404
    course_title = request.form["course"]
    description = request.form["description"]
    professor = request.form["professor"]
    days = request.form["days"]
    time = request.form["time"]
    db.editCourse(course_id, course_title, description, professor, days, time)
    return "Succesfully edited course"

@app.route("/sessions", methods=["POST"])
def authenticate_user():
    email = request.form["email"]
    password = request.form["password"]
    db = CoursesDB()
    if db.emailExists(email):
        pw = db.getPassword(email)
        pw = pw["password"]
        if bcrypt.verify(password, pw):
            # save the user ID
            g.session_data["user_id"] = g.session_id
            return "Logged in", 201
        else:
            return "Unable to authenticate", 401
    else:
        return "Unable to authenticate", 401
    
@app.route("/users", methods=["POST"])
def create_in_users_collection():
    print("the request data is:", request.form)
    first_name = request.form["first_name"]
    last_name = request.form["last_name"]
    email = request.form["email"]
    password = request.form["password"]
    
    password = bcrypt.hash(password)

    db = CoursesDB()
    if not db.emailExists(email):
        db.createUser(first_name, last_name, email, password)
        #g.session_data["user_id"] = g.session_id
        return "Created", 201
    return "Duplicate", 422

def main():
    app.run(port=8080)

if __name__ == '__main__':
    main()

#422 error code if duplicate found in db

#select * from users where email = ?;
#if none register user

#authentication
#bcrypt.verfity("password", h)

#javascript response code checker
#if (response.status == 201){}