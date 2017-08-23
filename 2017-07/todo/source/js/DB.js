var R_templates = {
  "notebook" : {
    "name" : "<scene>",
    "task" : [],
    "notes" : [],
    "version" : 1
  },
  "task" : {
    "task": "Task",
    "status" : 0,
    "version" : 1
  },
  "note" : {
    "note": "Note",
    "date": moment(),
    "version" : 1
  }
}

function R_newscene(name) {
  var template = R_templates.notebook
  template.name = name;
  return template;
}

function R_commit(data) {
  var query = JSON.stringify(data);
  localStorage.setItem('DB', query)
}

function R_newtask(task) {
  var template = R_templates.task
  template.task = task
  return template;
}

function R_DB() {
  return JSON.parse(localStorage.getItem('DB'))
}
