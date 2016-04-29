/**
 * Functionality to open Navigation.
 * @module NavMain
 * @requires jquery
 * @author schramm@webit.de, ruediger@webit.de
 */
define(['jquery'], function($) {

  'use strict';

  var NavMain = {

    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    _cacheElements: function() {
      this.$sub_menu = $('.sub-menu');
      this.$nav_layer_toggle = $('.nav-layer-toggle');
      this.$nav_item = $('.nav-main li');

      this.id_string_module = 'nav-main';
      this.id_unique_module = this.id_string_module +  '-' + new Date().getTime();
    },

    /**
     * Initiates the module.
     * @function init
     * @public
     * @param {string} mediaquery - current css font-family at the html element that specifies the screen size
     */
    init: function() {
      NavMain._cacheElements();
      NavMain._setAriaAttributes();

      NavMain._bindEvents();
    },

    /**
     * Binds all events to jQuery DOM objects.
     * @function _bindEvents
     * @private
     * @param {string} mediaquery - current css font-family at the html element that specifies the screen size
     */
    _bindEvents: function() {

      NavMain.$nav_layer_toggle.on('keydown', function(event) {
        NavMain._handleKeyInteraction.call($(this), event);
      });

      NavMain.$nav_item.on('mouseenter', function() {
        NavMain._showSubmenu.call($(this));
      });

      NavMain.$nav_item.on('mouseleave', function() {
        NavMain._hideSubmenu.call($(this));
      });

      NavMain.$nav_item.on('focusout', function() {
        NavMain._hideSubmenu.call($(this));
      });

      NavMain.$sub_menu.on('focusin', function() {
        NavMain._showSubmenu.call($(this).closest('li'));
      });

      NavMain.$sub_menu.on('focusout', function() {
        NavMain._hideSubmenu.call($(this));
      });

    },

    /**
     * Shows Submenu.
     * @function _toggleSubMenu
     * @private
     * @param {$object} element - element used as root to find link and sub menu to be opened
     */
    _toggleSubMenu: function(element) {
      if(element.is('a') || element.find('a').length) {
        element.toggleClass('active');
        element.closest('li').toggleClass('active');
        element.next('.sub-menu').toggleClass('active');
      }
    },

    /**
     * Opens Submenu and sets ARIA attributes
     * @function _showSubmenu
     * @private
     */
    _showSubmenu: function() {
      var $this = $(this), // should be li
          $navToggle = $this.find('.nav-layer-toggle').first(),
          $submenu = $this.find('.sub-menu').first();

      if((!$navToggle.is('strong') && !$this.closest('li').find('.nav-layer-toggle').first().is('strong')) || $this.closest('ol').hasClass('nav-layer2')) {
        $this.addClass('active');

        $navToggle.attr({
          'aria-expanded': 'true',
        });

        $submenu.attr({
          'aria-hidden': 'false',
          'aria-expanded': 'true',
        }).addClass('active');
      }
    },

    /**
     * Closes Submenu and sets ARIA attributes
     * @function _hideSubmenu
     * @private
     */
    _hideSubmenu: function() {
      var $this = $(this), // should be li
          $navToggle = $this.find('.nav-layer-toggle').first(),
          $submenu = $this.find('.sub-menu').first();

      if((!$navToggle.is('strong') && !$this.closest('li').find('.nav-layer-toggle').first().is('strong')) || $this.closest('ol').hasClass('nav-layer2')) {
        $this.removeClass('active');

        $navToggle.attr({
          'aria-expanded': 'false',
        });

        $submenu.attr({
          'aria-hidden': 'true',
          'aria-expanded': 'false',
        }).removeClass('active');
      }
    },

    /**
     * Handles different key inputs to trigger events
     * @function _handleKeyInteraction
     * @private
     * @param {object} event - default event object
     */
    _handleKeyInteraction: function(event) {
      var $this = $(this),
          $parentLi = $(this).closest('li'),
          key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

      switch (key) {
        case 13: // Enter
        case 32: // Spacebar
          if ($this.attr('aria-expanded') === 'false') {
            event.preventDefault();
            NavMain._showSubmenu.call($parentLi);
          }
          break;
        case 9: // Tab
          if (event.shiftKey) { // check if shift is pressed
            NavMain._hideSubmenu.call($parentLi);
          }
          break;
      }
    },

    /**
     * Sets ARIA control to trigger and id to submenu to connect eachother
     * @function _setAriaAttributes
     * @private
     */
    _setAriaAttributes: function() {
      this.$nav_layer_toggle.each(function(index) {
        var $trigger = $(this),
            $submenu = $trigger.next('.sub-menu'),
            module_id_string = NavMain.id_unique_module + '-' + index;

        $trigger.attr({
          'aria-controls': module_id_string,
        });

        $submenu.attr({
          'id': module_id_string,
        });
      });
    }
  };

  return /** @alias module:NavMain */ {
    /** init */
    init: NavMain.init
  };

});
