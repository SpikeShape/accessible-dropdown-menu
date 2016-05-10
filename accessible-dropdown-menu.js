(function( $ ) {

  $.fn.accessibleDropdownMenu = function(options) {

    main_node = this;

    var settings = $.extend({
        // These are the defaults.
        module_name: 'nav-main', // string that is used to generate unique IDs
        nav_items: 'li', // element holding both the links and the next layer
        sub_menu : '.sub-menu', // CSS selector for the nav layers that need to be opened and closed
        nav_layer_toggle: '.nav-layer-toggle', // CSS selector of elements that toggle the sub_menu elements
        class_active: 'active' // CSS class that indicates an active sub_menu
    }, options );

    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    function _cacheElements() {
      $sub_menu = $(settings.sub_menu);
      $nav_layer_toggle = $(settings.nav_layer_toggle);
      $nav_item = main_node.find(settings.nav_items);

      id_unique_module = settings.module_name +  '-' + new Date().getTime();
    }

    /**
     * Initiates the module.
     * @function init
     * @public
     */
    function init() {
      _cacheElements();
      _setAriaAttributes();

      _bindEvents();

      return this;
    }

    /**
     * Binds all events to jQuery DOM objects.
     * @function _bindEvents
     * @private
     */
    function _bindEvents() {

      $nav_layer_toggle.on('keydown', function(event) {
        _handleKeyInteraction.call($(this), event);
      });

      $nav_item.on('mouseenter', function() {
        _showSubmenu.call($(this));
      });

      $nav_item.on('mouseleave', function() {
        _hideSubmenu.call($(this));
      });

      $nav_item.on('focusout', function() {
        _hideSubmenu.call($(this));
      });

      $sub_menu.on('focusin', function() {
        _showSubmenu.call($(this).closest(settings.nav_items));
      });

      $sub_menu.on('focusout', function() {
        _hideSubmenu.call($(this));
      });

    }

    /**
     * Shows Submenu.
     * @function _toggleSubMenu
     * @private
     * @param {$object} element - element used as root to find link and sub menu to be opened
     */
    function _toggleSubMenu(element) {
      if(element.is('a') || element.find('a').length) {
        element.toggleClass(settings.class_active);
        element.closest(settings.nav_items).toggleClass(settings.class_active);
        element.next(settings.sub_menu).toggleClass(settings.class_active);
      }
    }

    /**
     * Opens Submenu and sets ARIA attributes
     * @function _showSubmenu
     * @private
     */
    function _showSubmenu() {
      var $this = $(this), // should be li
          $navToggle = $this.find(settings.nav_layer_toggle).first(),
          $submenu = $this.find(settings.sub_menu).first();

      if (!$navToggle.is('strong') && !$this.closest(settings.nav_items).find(settings.nav_layer_toggle).first().is('strong')) {
        $this.addClass(settings.class_active);

        $navToggle.attr({
          'aria-expanded': 'true',
        });

        $submenu.attr({
          'aria-hidden': 'false',
          'aria-expanded': 'true',
        }).addClass(settings.class_active);
      }
    }

    /**
     * Closes Submenu and sets ARIA attributes
     * @function _hideSubmenu
     * @private
     */
    function _hideSubmenu() {
      var $this = $(this), // should be li
          $navToggle = $this.find(settings.nav_layer_toggle).first(),
          $submenu = $this.find(settings.sub_menu).first();

      if (!$navToggle.is('strong') && !$this.closest(settings.nav_items).find(settings.nav_layer_toggle).first().is('strong')) {
        $this.removeClass(settings.class_active);

        $navToggle.attr({
          'aria-expanded': 'false',
        });

        $submenu.attr({
          'aria-hidden': 'true',
          'aria-expanded': 'false',
        }).removeClass(settings.class_active);
      }
    }

    /**
     * Handles different key inputs to trigger events
     * @function _handleKeyInteraction
     * @private
     * @param {object} event - default event object
     */
    function _handleKeyInteraction(event) {
      var $this = $(this),
          $parentLi = $(this).closest(settings.nav_items),
          key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

      switch (key) {
        case 13: // Enter
        case 32: // Spacebar
          if ($this.attr('aria-expanded') === 'false') {
            event.preventDefault();
            _showSubmenu.call($parentLi);
          }
          break;
        case 9: // Tab
          if (event.shiftKey) { // check if shift is pressed
            _hideSubmenu.call($parentLi);
          }
          break;
      }
    }

    /**
     * Sets ARIA control to trigger and id to submenu to connect eachother
     * @function _setAriaAttributes
     * @private
     */
    function _setAriaAttributes() {
      $nav_layer_toggle.each(function(index) {
        var $trigger = $(this),
            $submenu = $trigger.next(settings.sub_menu),
            module_id_string = id_unique_module + '-' + index;

        $trigger.attr({
          'aria-controls': module_id_string,
        });

        $submenu.attr({
          'id': module_id_string,
        });
      });
    }

    return init();

  };

}( jQuery ));
