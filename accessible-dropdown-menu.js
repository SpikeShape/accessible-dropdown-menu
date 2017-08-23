(function( $ ) {

  $.fn.accessibleDropdownMenu = function(options) {
    var self = this,
        settings = $.extend({
        // These are the defaults.
        module_name: 'accessible-dropdown-menu', // string that is used to generate unique IDs
        nav_items: 'li', // element holding both the links and the next layer
        sub_menu : '.sub-menu', // CSS selector for the nav layers that need to be opened and closed
        nav_layer_toggle: '.nav-layer-toggle', // CSS selector of elements that toggle the sub_menu elements
        class_visible: 'opened', // CSS class that indicates an active sub_menu
        class_current: 'current', // CSS class that indicates a current menu link
        text_current: 'This is your current location' // aria-label for current menu items
      }, options ),

        $sub_menu, $nav_layer_toggle, $nav_item, $nav_link_current, id_unique_module;

    /**
     * Caches all jQuery Objects for later use.
     * @function _cacheElements
     * @private
     */
    function _cacheElements() {
      $sub_menu = self.find(settings.sub_menu);
      $nav_layer_toggle = self.find(settings.nav_layer_toggle);
      $nav_item = self.find(settings.nav_items);
      $nav_link_current = self.find('.' + settings.class_current);

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
     * Opens Submenu and sets ARIA attributes
     * @function _showSubmenu
     * @private
     */
    function _showSubmenu() {
      var $li = $(this),
          $navToggle = $li.find(settings.nav_layer_toggle).first(),
          $submenu = $li.find(settings.sub_menu).first();

      $li.addClass(settings.class_visible);

      if ($submenu.length) {

        $navToggle.attr({
          'aria-expanded': 'true',
        });

        $submenu.attr({
          'aria-hidden': 'false',
          'aria-expanded': 'true',
        }).addClass(settings.class_visible);
      }
    }

    /**
     * Closes Submenu and sets ARIA attributes
     * @function _hideSubmenu
     * @private
     */
    function _hideSubmenu() {
      var $li = $(this),
          $navToggle = $li.find(settings.nav_layer_toggle).first(),
          $submenu = $li.find(settings.sub_menu).first();

      $li.removeClass(settings.class_visible);

      if ($submenu.length) {

        $navToggle.attr({
          'aria-expanded': 'false',
        });

        $submenu.attr({
          'aria-hidden': 'true',
          'aria-expanded': 'false',
        }).removeClass(settings.class_visible);
      }
    }

    /**
     * Handles different key inputs to trigger events
     * @function _handleKeyInteraction
     * @private
     * @param {object} event - default event object
     */
    function _handleKeyInteraction(event) {
      var $trigger = $(this), // setting.nav_layer_toggle
          $parentLi = $trigger.closest(settings.nav_items),
          key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

      switch (key) {
        case 13: // Enter
        case 32: // Spacebar
          if ($trigger.attr('aria-expanded') === 'false') {
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
      if ($nav_link_current.length) {
        $nav_link_current.attr({
          'aria-label': settings.text_current
        });
      }

      $nav_layer_toggle.each(function(index) {
        var $trigger = $(this),
            $submenu_layer = $trigger.closest(settings.nav_items).find(settings.sub_menu),
            submenu_has_id = $submenu_layer.attr('id') !== undefined,
            module_id_string = submenu_has_id ? $submenu_layer.attr('id') : id_unique_module + '-' + index,
            aria_haspopup_value = $submenu_layer.length ? true : false;

        $trigger.attr({
          'aria-haspopup': aria_haspopup_value,
        });

        if (aria_haspopup_value) {
          $trigger.attr({
            'aria-controls': module_id_string,
            'aria-owns': module_id_string,
            'aria-expanded': 'false'
          });

          $submenu_layer.attr({
            'role': 'group',
            'id': module_id_string
          });
        }
      });
    }

    if (this.length) {
      init();
    }

    return this;

  };

}( jQuery ));
