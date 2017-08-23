myApp.onPageInit('welcome', function (page) {
  $$('[get-started]').on('click', function() {
    myApp.showIndicator();
    var db_base = [];
    if ($$('[new-notebook]').val() !== '') {
      db_base.push(R_newscene($$('[new-notebook]').val()))
      R_commit(db_base);
      localStorage.setItem('notebook', 0);
      location.href = '?';
    }
  });
});
