import os, base64

class SessionStore:

    def __init__(self):
        #initialize our data
        self.sessionData = {}
    
    def generateSessionId(self):
        #generate a large random number for session ID
        rnum = os.urandom(32)
        rstr = base64.b64encode(rnum).decode("utf-8")
        return rstr
    
    def createSession(self):
        sessionId = self.generateSessionId()
        #add a new session to the sesssion store
        self.sessionData[sessionId] = {}
        return sessionId

    def getSession(self, sessionId):
        #retrieve an existing session from the session store
        if sessionId in self.sessionData:
            return self.sessionData[sessionId]
        else:
            return None