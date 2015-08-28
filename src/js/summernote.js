define([
  'jquery',
  'summernote/renderer',
  'summernote/core/func',
  'summernote/module/Editor',
  'summernote/module/Toolbar'
], function ($, renderer, func, Editor, Toolbar) {

  $.summernote = $.summernote || {};
  $.summernote.modules = $.summernote.modules || {};
  $.summernote.registerModule = function (name, Module) {
    $.summernote.modules[name] = Module;
  };

  $.summernote.registerModule('editor', Editor);
  $.summernote.registerModule('toolbar', Toolbar);

  /**
   * @class Summernote
   * @param {jQuery} $note
   * @param {Object} options
   * @return {Summernote}
   */
  var Summernote = function ($note, options) {
    var self = this;
    this.modules = {};
    this.layoutInfo = {};
    this.options = options;
    this.$note = $note;

    this.triggerEvent = function (namespace, args) {
      var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
      if (callback) {
        callback.apply($note[0], args);
      }
      $note.trigger('summernote.' + namespace, args);
    };

    this.watch = function (namespace, callback) {
      $note.trigger('summernote.' + namespace, callback);
    };

    this.initialize = function () {
      this.layoutInfo = this.createLayout($note);

      this.initModule();

      //this.addModule('editor', new Editor(this, this.layoutInfo.editable));
      $note.hide();
      return this;
    };

    this.initModule = function () {
      for (var k in $.summernote.modules) {
        var Module = $.summernote.modules[k];

        this.addModule(k, new Module(this));
      }

    };

    this.invoke = function () {
      var args = Array.prototype.slice.call(arguments);
      var name = args.shift();
      var module = name.split('.');

      var moduleName = module[0];
      var methodName = module[1];

      if (module.length === 1) {

        if (this.modules.editor[moduleName]) {
          methodName = moduleName;
          moduleName = 'editor';
        } else {
          return  this.modules[moduleName];
        }
      }

      var instance = this.modules[moduleName];
      if (instance) {
        return instance[methodName].apply(instance, args);
      }

      return null;
    };

    this.destroy = function () {
      Object.keys(this.modules).forEach(function (key) {
        self.removeModule(key);
      });
    };

    this.createLayout = function ($note) {
      var $editor = renderer.editor([
        renderer.editingArea([
          renderer.codable(),
          renderer.editable()
        ])
      ]).build();

      $editor.insertAfter($note);

      return {
        editor: $editor,
        editable: $editor.find('.note-editable')
      };
    };

    this.removeLayout = function ($note) {
      $note.editor.remove();
    };

    this.addModule = function (key, instance) {
      this.modules[key] = instance;
    };

    this.removeModule = function (key) {
      this.modules[key].destroy();
      delete this.modules[key];
    };

    this.getOptions = function (moduleName) {
      return this.options.modules ? (this.options.modules[moduleName] || {}) : {};
    };

    return this.initialize();
  };

  var defaultOptions = {
    callbacks : {},
    keyMap : {}
  };

  $.fn.extend({
    /**
     * Summernote API
     *
     * @param {Object|String}
     * @return {this}
     */
    summernote: function (options) {
      this.each(function (idx, note) {
        var $note = $(note);
        if (!$note.data('summernote')) {
          $note.data('summernote', new Summernote($note, $.extend(true, {},  defaultOptions, options || {})));
        }
      });
    }
  });
});
