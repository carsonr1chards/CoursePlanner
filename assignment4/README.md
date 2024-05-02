# My Project

## Course Planner

**Course**

Attributes:

* course (string)
* description (string)
* professor (string)
* days (integer)
* time (integer)

## Schema

```sql
CREATE TABLE courses (
id INTEGER PRIMARY KEY,
course TEXT,
description TEXT,
professor TEXT,
days TEXT,
time TEXT);
```

**User**

Attributes:
* first_name (string)
* last_name (string)
* email (string)
* password (string)

## Schema

```sql
CREATE TABLE users (
id INTEGER PRIMARY KEY,
first_name TEXT,
last_name TEXT,
email TEXT,
password TEXT);
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve course collection | GET    | /courses
Retrieve course member     | GET    | /courses/*\<id\>*
Create course member       | POST   | /courses
Update course member       | PUT    | /courses/*\<id\>*
Delete course member       | DELETE | /courses/*\<id\>*
Login User                 | POST   | /users/sessions
Register user              | POST   | /users

Uses bcrypt for password hasing
https://passlib.readthedocs.io/en/stable/lib/passlib.hash.bcrypt.html