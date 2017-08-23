myApp.onPageInit('notebooks', function (page) {
  pullNotebooks();

  $$('[notebook-id]').on('click', function() {
    localStorage.setItem('notebook', $$(this).attr('notebook-id'))
    mainView.router.load({
      'url' : 'index.html',
    })
  })

  $$('[notebook-add]').on('click', function () {
    myApp.prompt('Project name?', function (value) {
      var newNotebook = R_newscene(value);
      console.log(newNotebook)
      var query = R_DB();
      query.push(newNotebook)
      R_commit(query);
      pullNotebooks();
      localStorage.setItem('notebook', (query.length - 1))
      mainView.router.load({
        'url' : 'index.html',
      })
    });
  });

  $$('[notebook-delete]').on('click', function() {
    if ($$('[notebook-id]').length < 2) {
      myApp.alert('You must have atleast one notebook!')
    }
    else {
      myApp.confirm('Are you sure?', function () {
        var query = R_DB();
        query.splice($$(this).attr('notebook-delete'), 1);
        R_commit(query);
        pullNotebooks();
      });
    }
  })

});

function pullNotebooks() {
  $$('[notebook-list]').html('')
  var query = R_DB();
  for (var i = 0; i < query.length; i++) {
    var template = $$('#notebook-list-item').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, {
      id: i,
      name: query[i]['name']
    });
    $$('[notebook-list]').append(rendered);
  }
}
