// Settings
myApp.onPageInit('settings', function (page) {
  $$('[settings-delete]').on('click', function () {
    myApp.confirm('Are you sure?', function () {
      localStorage.clear();
      location.href = '?';
    });
});
});
