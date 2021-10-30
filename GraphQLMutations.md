# GraphQL mutations

```bash
# add a track
mutation {
  addTrack(TrackInput:{name: "Java"}) {
    id
  }
}

# add a course
mutation {
  addCourse(CourseInput:{name:"Java for dummies", trackId:""}) {
    id
  }
}

# add a chapter
mutation {
  addChapter(ChapterInput:{content:"chapter 1....", courseId:""}) {
    id
  }
}

# add a student
mutation {
  addStudent(StudentInput: { firstName:"Gary", lastName:"Alway", email:"garyalway@gmail.com"}) {
    id
  }
}

# add preference
mutation {
  addPreference(PreferenceInput:{studentId:"", trackId:""}) {
    track {
      name
    }
  }
}

# add an enrollment
mutation {
  addEnrollment(EnrollmentInput: { studentId:"", courseId: ""}) {
    id
  }
}

# add progress
mutation {
  addProgress(ProgressInput:{
    studentId: "",
    enrollmentId:"",
    chapterId:"",
    xp:1500,
    marker:"50%"
  }) {
    studentId
  }
}
```
