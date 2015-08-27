require.config({
  baseUrl: 'src/js',
  paths: {
    jquery: '//code.jquery.com/jquery-2.1.4'
  },
  packages: [{
    name: 'summernote',
    main: 'summernote',
    location: './'
  }]
});

require([
  'jquery',
  'summernote'
], function ($) {
  // summernote
  $('.summernote').eq(0).summernote({
    height: 300,
    modules : {
      toolbar : '#externalToolbar'
    }
  });

  $('.summernote').eq(1).summernote({
    height: 300
  });
});
