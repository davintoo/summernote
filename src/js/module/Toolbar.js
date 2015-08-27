define([
  'summernote/core/list',
  'summernote/core/dom',
  'summernote/module/Button'
], function (list, dom, Button) {
  /**
   * @class module.Toolbar
   *
   * Toolbar
   */
  var Toolbar = function (summernote, layoutInfo) {

    var $toolbar = null;
    var toolbarOptions = summernote.getOptions('toolbar');


    function ToolbarClickEvent() {
      var event = $(this).data('event');
      var value = $(this).data('value');

      summernote.invoke(event, value);
    }


    this.initialize = function () {
      this.initUI();
      this.initEvent();
    };

    this.initUI = function () {
      if (typeof toolbarOptions === 'string') {
        $toolbar = $(toolbarOptions);
      } else {
        $toolbar = $('<div class="note-toolbar" />');

        layoutInfo.editor.prepend($toolbar);
      }
    };

    this.initEvent = function () {
      $toolbar.on('click', '[data-event]', ToolbarClickEvent);
    };

    this.destroy = function () {
      $toolbar.off('click', ToolbarClickEvent);
    };

    this.initialize();

  };

  return Toolbar;
});
