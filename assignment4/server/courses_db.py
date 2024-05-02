import sqlite3

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

class CoursesDB:

    def __init__(self):
        self.connection = sqlite3.connect("courses_db.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()

    def createCourse(self, course, description, professor, days, time):
        # to do: dont hard-code values from the query!
        data = [course, description, professor, days, time]
        self.cursor.execute("INSERT INTO courses (course, description, professor, days, time) VALUES (?, ?, ?, ?, ?)", data)
        self.connection.commit()

    def getCourses(self):
        self.cursor.execute("SELECT * FROM courses")
        courses = self.cursor.fetchall()
        # print("BEFORE:", courses)
        return courses

    def getCourse(self, course_id):
        data = [course_id]
        self.cursor.execute("SELECT * FROM courses WHERE id = ?", data)
        course = self.cursor.fetchone()
        return course # will return None if the record does not exist

    def deleteCourse(self, course_id):
        data = [course_id]
        self.cursor.execute("DELETE FROM courses WHERE id = ?", data)
        self.connection.commit()

    def editCourse(self, course_id, course, description, professor, days, time):
        data = [course, description, professor, days, time, course_id]
        self.cursor.execute("UPDATE courses SET course = ?, description = ?, professor = ?, days = ?, time = ? WHERE id = ?", data)
        self.connection.commit()

    def createUser(self, first_name, last_name, email, password):
        data = [first_name, last_name, email, password]
        self.cursor.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)", data)
        self.connection.commit()

    def emailExists(self, email):
        data = [email]
        self.cursor.execute("SELECT * FROM users WHERE email = ?", data)
        if not self.cursor.fetchone():
            return False
        return True

    def getPassword(self, email):
        data = [email]
        self.cursor.execute("SELECT password FROM users WHERE email = ?", data)
        password = self.cursor.fetchone()
        return password
