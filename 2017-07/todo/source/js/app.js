// Initialize your app
var myApp = new Framework7({
  modalTitle: 'Rillo'
});

// Export selectors engine
var $$ = Dom7;
var db = localStorage.getItem('DB');

// Add view
var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
});

window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.applicationCache.swapCache();
      myApp.alert('A new version of this site is available. Load it?', function() {
        window.location.reload();
      });
    }
  }, false);
}, false);

if (db == null) {
  mainView.router.load({
    'url' : 'views/welcome.html',
    'force' : true,
  })
}
else {
  if (localStorage.getItem('notebook') == null) {
    localStorage.setItem('notebook', 0);
  }

  indexPage();
  renderWeek(moment().format('W'));
}


myApp.onPageInit('index', function (page) {
  indexPage();
  renderWeek(moment().format('W'));
});


function indexPage() {
  var db = R_DB();
  if (db[localStorage.getItem('notebook')] == undefined) {
    localStorage.setItem('notebook', 0);
  }

  var notebookID = localStorage.getItem('notebook');
  var thisNotebook = db[notebookID];
  $$('[notebook-name]').html(thisNotebook.name)

  // Add New Task
  $$('[add-task]').on('click', function() {
    myApp.prompt('Enter new task', function (value) {
      var query = db
      query[localStorage.getItem('notebook')].task.push(R_newtask(value))
      R_commit(query)
      location.href = '?';
    });
  })
}

function renderWeek(number) {
  $$('.page-content').hide();
  myApp.showIndicator();
  $$('[todo-list]').html('')
  var db = R_DB();
  var thisNotebook = db[localStorage.getItem('notebook')];
  for (var i = 0; i < thisNotebook.task.length; i++) {
    if (thisNotebook.task[i].status == 1) {
      thisNotebook.task[i].checked = true;
    }
    thisNotebook.task[i].id = i;
    var template = $$('#todo').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, thisNotebook.task[i]);
    $$('[todo-list]').append(rendered);
  }
  setTimeout(function() {
    myApp.hideIndicator();
    $$('.page-content').show();
  }, 400);

  var db = R_DB();
  $$('[todo-check]').on('click', function() {
    var query = db;
    if (query[localStorage.getItem('notebook')].task[$$(this).attr('todo-check')].status == 1) {
      query[localStorage.getItem('notebook')].task[$$(this).attr('todo-check')].status = 0;
    }
    else {
      query[localStorage.getItem('notebook')].task[$$(this).attr('todo-check')].status = 1;
    }
    R_commit(query)
  })

  $$('[todo-delete]').on('click', function() {
    var self = $$(this);
    myApp.confirm('Are you sure?', function () {
      var query = db;
      var index = self.attr('todo-delete');
      if (index == 0) {
        query[localStorage.getItem('notebook')].task.shift()
      }
      else {
        query[localStorage.getItem('notebook')].task.splice(index, 1)
      }
      R_commit(query)
      renderWeek(moment().format('W'));
    });
  });


}
