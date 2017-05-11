'use strict';

angular.module('familyVideo', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: "./views/home.html",
    controller: "homeCtrl"
  }).state('search', {
    url: '/search/',
    templateUrl: './views/search.html',
    controller: "searchCtrl"
  }).state('account', {
    url: '/account',
    templateUrl: './views/signIn.html',
    controller: "signInCtrl"
  }).state('createAccount', {
    url: '/account/create',
    templateUrl: './views/createAccount.html',
    controller: "createAccountCtrl"
  }).state('checkout', {
    url: '/checkout',
    templateUrl: './views/checkout.html',
    controller: "checkoutCtrl"
  }).state('verify', {
    url: '/checkout/verify',
    templateUrl: './views/verify.html',
    controller: "verifyCtrl"
  });

  $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('familyVideo').controller('mainCtrl', function ($scope, mainService, $rootScope, $state) {

  $scope.searchBarClick = true;
  $scope.shoppingCart = true;
  $scope.emptyCart = true;
  $scope.searchBarClickMini = true;

  $scope.openNav = function () {
    // document.getElementById("mySidenav").style.width = "calc(100%-54px)";
    document.getElementById("mySidenav").style.width = "90%";
    // document.getElementById("main").style.marginLeft = "calc(100%-54px)";
    // document.getElementById("main").style.marginLeft = "90%";
  };

  $scope.closeNav = function () {
    document.getElementById("mySidenav").style.width = "0px";
    // document.getElementById("main").style.marginLeft = "0px";
  };

  $scope.controlData = function (query) {
    $scope.forSearch = query;
    mainService.getMovies(query).then(function (response) {
      $state.go('search');
      $scope.forHtml = response;
      $scope.searchQuery = '';
      $scope.searchBarClickMini = true;
    });
  };

  $scope.sessionCheck = function () {
    mainService.checkSessions().then(function (response) {
      var sessId = response.data;
    });
  };

  $scope.sessionCheck();

  $scope.notSignedIn = true;

  // $scope.findAccount=function(){
  //   console.log('hi', $scope.sessId);
  //   mainService.findAccount($scope.sessId).then(function(response){
  //     console.log('JOFJOF', response)
  //   })
  // }
  //
  // $scope.findAccount();

  $rootScope.$on('user', function (response) {
    console.log(response.data);
    $scope.user = response;
  });

  $scope.findAccount = function () {
    mainService.findAccount().then(function (response) {
      console.log('!!!This from the controller', response);
      $scope.user = response.data;
    });
  };

  $scope.findAccount();

  $scope.showCart = function () {
    mainService.showCart().then(function (response) {
      if (response.data === 'NotSignedIn') {
        $scope.emptyCart = false;
        $scope.shoppingCart = true;
      } else {
        $scope.shoppingCart = false;
        $scope.emptyCart = true;
        $scope.cartItems = response.data;
      }
    });
  };

  $scope.closeCart = function () {
    if (!$scope.shoppingCart) {
      $scope.shoppingCart = true;
    }
  };

  $scope.closeEmptyCart = function () {
    if (!$scope.emptyCart) {
      $scope.emptyCart = true;
    }
  };

  $scope.closeSearchBar = function () {
    if (!$scope.searchBarClick) {
      $scope.searchBarClick = true;
    }
  };

  $scope.closeMiniSearch = function () {
    if (!$scope.searchBarClickMini) {
      $scope.searchBarClickMini = true;
    }
  };

  $scope.deleteItem = function (movie) {
    mainService.deleteItem(movie).then(function (response) {
      if (response) {
        $scope.showCart();
      }
    });
  };
});
'use strict';

angular.module('familyVideo').service('mainService', function ($http, $rootScope) {

  //This 'this' is the mainService- used within a function
  var self = this;

  this.serviceAddress = '';

  this.getAddress = function (address) {
    console.log('from serv', address);
    this.serviceAddress = address;
  };

  this.checkSessions = function () {
    return $http.get('/api/sessionCheck').then(function (response) {
      return response;
    });
  };

  this.getMovies = function (query) {
    return $http.get("https://api.themoviedb.org/3/search/movie?api_key=29cb68023cc937676c90dced0f11f657&query=" + query).then(function (response) {
      return response.data.results;
    });
  };

  this.createAccount = function (user) {
    console.log('this is the service', user);
    return $http({
      method: 'POST',
      url: '/api/account/create',
      data: {
        user: user
      }
    }).then(function (response) {
      self.checkSessions();
    });
  };

  // this.logInUser=function(account){
  //   // console.log('this is the service', user)
  //   return $http({
  //     method: 'POST',
  //     url: '/api/signIn',
  //     data: {
  //       account: account
  //     }
  //   }).then(function(response){
  //     return response;
  //   })
  // }

  this.logInUser = function (account) {
    // console.log('thisbetter work',account.email, account.password)
    return $http({
      method: 'POST',
      url: '/api/signIn',
      data: account
    }).then(function (response) {
      console.log('IF THIS WORKS YOURE GOOD TO GO', response);
      $rootScope.$emit('user', response.data);
      return response;
    });
  };

  this.addMovieToCart = function (movie) {
    return $http({
      method: 'POST',
      url: '/api/addMovie',
      data: {
        movie: movie
      }
    }).then(function (response) {});
  };

  this.deleteItem = function (movie) {
    return $http({
      method: 'POST',
      url: '/api/deleteMovie',
      data: {
        movie: movie
      }
    }).then(function (response) {
      return response;
    });
  };

  // this.findAccount=function(sessionId){
  //   return $http({
  //     method: 'POST',
  //     url: '/api/findAccount',
  //     data: {
  //       id:sessionId
  //     }
  //   }).then(function(response){
  //
  //   })
  // }

  this.findAccount = function () {
    return $http.get('/api/findAccount').then(function (response) {
      $rootScope.$emit('user', response.data);
      return response;
    });
  };

  this.showCart = function () {
    return $http.get('/api/getCart').then(function (response) {
      return response;
    });
  };
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (window, document, undefined) {
  "use strict";

  (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  })({ 1: [function (require, module, exports) {
      // SweetAlert
      // 2014-2015 (c) - Tristan Edwards
      // github.com/t4t5/sweetalert

      /*
       * jQuery-like functions for manipulating the DOM
       */
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { 'default': obj };
      }

      var _modulesHandleDom = require('./modules/handle-dom');

      /*
       * Handy utilities
       */

      var _modulesUtils = require('./modules/utils');

      /*
       *  Handle sweetAlert's DOM elements
       */

      var _modulesHandleSwalDom = require('./modules/handle-swal-dom');

      // Handle button events and keyboard events

      var _modulesHandleClick = require('./modules/handle-click');

      var _modulesHandleKey = require('./modules/handle-key');

      var _modulesHandleKey2 = _interopRequireDefault(_modulesHandleKey);

      // Default values

      var _modulesDefaultParams = require('./modules/default-params');

      var _modulesDefaultParams2 = _interopRequireDefault(_modulesDefaultParams);

      var _modulesSetParams = require('./modules/set-params');

      var _modulesSetParams2 = _interopRequireDefault(_modulesSetParams);

      /*
       * Remember state in cases where opening and handling a modal will fiddle with it.
       * (We also use window.previousActiveElement as a global variable)
       */
      var previousWindowKeyDown;
      var lastFocusedButton;

      /*
       * Global sweetAlert function
       * (this is what the user calls)
       */
      var sweetAlert, swal;

      exports['default'] = sweetAlert = swal = function (_swal) {
        function swal() {
          return _swal.apply(this, arguments);
        }

        swal.toString = function () {
          return _swal.toString();
        };

        return swal;
      }(function () {
        var customizations = arguments[0];

        (0, _modulesHandleDom.addClass)(document.body, 'stop-scrolling');
        (0, _modulesHandleSwalDom.resetInput)();

        /*
         * Use argument if defined or default value from params object otherwise.
         * Supports the case where a default value is boolean true and should be
         * overridden by a corresponding explicit argument which is boolean false.
         */
        function argumentOrDefault(key) {
          var args = customizations;
          return args[key] === undefined ? _modulesDefaultParams2['default'][key] : args[key];
        }

        if (customizations === undefined) {
          (0, _modulesUtils.logStr)('SweetAlert expects at least 1 attribute!');
          return false;
        }

        var params = (0, _modulesUtils.extend)({}, _modulesDefaultParams2['default']);

        switch (typeof customizations === "undefined" ? "undefined" : _typeof(customizations)) {

          // Ex: swal("Hello", "Just testing", "info");
          case 'string':
            params.title = customizations;
            params.text = arguments[1] || '';
            params.type = arguments[2] || '';
            break;

          // Ex: swal({ title:"Hello", text: "Just testing", type: "info" });
          case 'object':
            if (customizations.title === undefined) {
              (0, _modulesUtils.logStr)('Missing "title" argument!');
              return false;
            }

            params.title = customizations.title;

            for (var customName in _modulesDefaultParams2['default']) {
              params[customName] = argumentOrDefault(customName);
            }

            // Show "Confirm" instead of "OK" if cancel button is visible
            params.confirmButtonText = params.showCancelButton ? 'Confirm' : _modulesDefaultParams2['default'].confirmButtonText;
            params.confirmButtonText = argumentOrDefault('confirmButtonText');

            // Callback function when clicking on "OK"/"Cancel"
            params.doneFunction = arguments[1] || null;

            break;

          default:
            (0, _modulesUtils.logStr)('Unexpected type of argument! Expected "string" or "object", got ' + (typeof customizations === "undefined" ? "undefined" : _typeof(customizations)));
            return false;

        }

        (0, _modulesSetParams2['default'])(params);
        (0, _modulesHandleSwalDom.fixVerticalPosition)();
        (0, _modulesHandleSwalDom.openModal)(arguments[1]);

        // Modal interactions
        var modal = (0, _modulesHandleSwalDom.getModal)();

        /*
         * Make sure all modal buttons respond to all events
         */
        var $buttons = modal.querySelectorAll('button');
        var buttonEvents = ['onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onfocus'];
        var onButtonEvent = function onButtonEvent(e) {
          return (0, _modulesHandleClick.handleButton)(e, params, modal);
        };

        for (var btnIndex = 0; btnIndex < $buttons.length; btnIndex++) {
          for (var evtIndex = 0; evtIndex < buttonEvents.length; evtIndex++) {
            var btnEvt = buttonEvents[evtIndex];
            $buttons[btnIndex][btnEvt] = onButtonEvent;
          }
        }

        // Clicking outside the modal dismisses it (if allowed by user)
        (0, _modulesHandleSwalDom.getOverlay)().onclick = onButtonEvent;

        previousWindowKeyDown = window.onkeydown;

        var onKeyEvent = function onKeyEvent(e) {
          return (0, _modulesHandleKey2['default'])(e, params, modal);
        };
        window.onkeydown = onKeyEvent;

        window.onfocus = function () {
          // When the user has focused away and focused back from the whole window.
          setTimeout(function () {
            // Put in a timeout to jump out of the event sequence.
            // Calling focus() in the event sequence confuses things.
            if (lastFocusedButton !== undefined) {
              lastFocusedButton.focus();
              lastFocusedButton = undefined;
            }
          }, 0);
        };

        // Show alert with enabled buttons always
        swal.enableButtons();
      });

      /*
       * Set default params for each popup
       * @param {Object} userParams
       */
      sweetAlert.setDefaults = swal.setDefaults = function (userParams) {
        if (!userParams) {
          throw new Error('userParams is required');
        }
        if ((typeof userParams === "undefined" ? "undefined" : _typeof(userParams)) !== 'object') {
          throw new Error('userParams has to be a object');
        }

        (0, _modulesUtils.extend)(_modulesDefaultParams2['default'], userParams);
      };

      /*
       * Animation when closing modal
       */
      sweetAlert.close = swal.close = function () {
        var modal = (0, _modulesHandleSwalDom.getModal)();

        (0, _modulesHandleDom.fadeOut)((0, _modulesHandleSwalDom.getOverlay)(), 5);
        (0, _modulesHandleDom.fadeOut)(modal, 5);
        (0, _modulesHandleDom.removeClass)(modal, 'showSweetAlert');
        (0, _modulesHandleDom.addClass)(modal, 'hideSweetAlert');
        (0, _modulesHandleDom.removeClass)(modal, 'visible');

        /*
         * Reset icon animations
         */
        var $successIcon = modal.querySelector('.sa-icon.sa-success');
        (0, _modulesHandleDom.removeClass)($successIcon, 'animate');
        (0, _modulesHandleDom.removeClass)($successIcon.querySelector('.sa-tip'), 'animateSuccessTip');
        (0, _modulesHandleDom.removeClass)($successIcon.querySelector('.sa-long'), 'animateSuccessLong');

        var $errorIcon = modal.querySelector('.sa-icon.sa-error');
        (0, _modulesHandleDom.removeClass)($errorIcon, 'animateErrorIcon');
        (0, _modulesHandleDom.removeClass)($errorIcon.querySelector('.sa-x-mark'), 'animateXMark');

        var $warningIcon = modal.querySelector('.sa-icon.sa-warning');
        (0, _modulesHandleDom.removeClass)($warningIcon, 'pulseWarning');
        (0, _modulesHandleDom.removeClass)($warningIcon.querySelector('.sa-body'), 'pulseWarningIns');
        (0, _modulesHandleDom.removeClass)($warningIcon.querySelector('.sa-dot'), 'pulseWarningIns');

        // Reset custom class (delay so that UI changes aren't visible)
        setTimeout(function () {
          var customClass = modal.getAttribute('data-custom-class');
          (0, _modulesHandleDom.removeClass)(modal, customClass);
        }, 300);

        // Make page scrollable again
        (0, _modulesHandleDom.removeClass)(document.body, 'stop-scrolling');

        // Reset the page to its previous state
        window.onkeydown = previousWindowKeyDown;
        if (window.previousActiveElement) {
          window.previousActiveElement.focus();
        }
        lastFocusedButton = undefined;
        clearTimeout(modal.timeout);

        return true;
      };

      /*
       * Validation of the input field is done by user
       * If something is wrong => call showInputError with errorMessage
       */
      sweetAlert.showInputError = swal.showInputError = function (errorMessage) {
        var modal = (0, _modulesHandleSwalDom.getModal)();

        var $errorIcon = modal.querySelector('.sa-input-error');
        (0, _modulesHandleDom.addClass)($errorIcon, 'show');

        var $errorContainer = modal.querySelector('.sa-error-container');
        (0, _modulesHandleDom.addClass)($errorContainer, 'show');

        $errorContainer.querySelector('p').innerHTML = errorMessage;

        setTimeout(function () {
          sweetAlert.enableButtons();
        }, 1);

        modal.querySelector('input').focus();
      };

      /*
       * Reset input error DOM elements
       */
      sweetAlert.resetInputError = swal.resetInputError = function (event) {
        // If press enter => ignore
        if (event && event.keyCode === 13) {
          return false;
        }

        var $modal = (0, _modulesHandleSwalDom.getModal)();

        var $errorIcon = $modal.querySelector('.sa-input-error');
        (0, _modulesHandleDom.removeClass)($errorIcon, 'show');

        var $errorContainer = $modal.querySelector('.sa-error-container');
        (0, _modulesHandleDom.removeClass)($errorContainer, 'show');
      };

      /*
       * Disable confirm and cancel buttons
       */
      sweetAlert.disableButtons = swal.disableButtons = function (event) {
        var modal = (0, _modulesHandleSwalDom.getModal)();
        var $confirmButton = modal.querySelector('button.confirm');
        var $cancelButton = modal.querySelector('button.cancel');
        $confirmButton.disabled = true;
        $cancelButton.disabled = true;
      };

      /*
       * Enable confirm and cancel buttons
       */
      sweetAlert.enableButtons = swal.enableButtons = function (event) {
        var modal = (0, _modulesHandleSwalDom.getModal)();
        var $confirmButton = modal.querySelector('button.confirm');
        var $cancelButton = modal.querySelector('button.cancel');
        $confirmButton.disabled = false;
        $cancelButton.disabled = false;
      };

      if (typeof window !== 'undefined') {
        // The 'handle-click' module requires
        // that 'sweetAlert' was set as global.
        window.sweetAlert = window.swal = sweetAlert;
      } else {
        (0, _modulesUtils.logStr)('SweetAlert is a frontend module!');
      }
      module.exports = exports['default'];
    }, { "./modules/default-params": 2, "./modules/handle-click": 3, "./modules/handle-dom": 4, "./modules/handle-key": 5, "./modules/handle-swal-dom": 6, "./modules/set-params": 8, "./modules/utils": 9 }], 2: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      var defaultParams = {
        title: '',
        text: '',
        type: null,
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: false,
        closeOnConfirm: true,
        closeOnCancel: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#8CD4F5',
        cancelButtonText: 'Cancel',
        imageUrl: null,
        imageSize: null,
        timer: null,
        customClass: '',
        html: false,
        animation: true,
        allowEscapeKey: true,
        inputType: 'text',
        inputPlaceholder: '',
        inputValue: '',
        showLoaderOnConfirm: false
      };

      exports['default'] = defaultParams;
      module.exports = exports['default'];
    }, {}], 3: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _utils = require('./utils');

      var _handleSwalDom = require('./handle-swal-dom');

      var _handleDom = require('./handle-dom');

      /*
       * User clicked on "Confirm"/"OK" or "Cancel"
       */
      var handleButton = function handleButton(event, params, modal) {
        var e = event || window.event;
        var target = e.target || e.srcElement;

        var targetedConfirm = target.className.indexOf('confirm') !== -1;
        var targetedOverlay = target.className.indexOf('sweet-overlay') !== -1;
        var modalIsVisible = (0, _handleDom.hasClass)(modal, 'visible');
        var doneFunctionExists = params.doneFunction && modal.getAttribute('data-has-done-function') === 'true';

        // Since the user can change the background-color of the confirm button programmatically,
        // we must calculate what the color should be on hover/active
        var normalColor, hoverColor, activeColor;
        if (targetedConfirm && params.confirmButtonColor) {
          normalColor = params.confirmButtonColor;
          hoverColor = (0, _utils.colorLuminance)(normalColor, -0.04);
          activeColor = (0, _utils.colorLuminance)(normalColor, -0.14);
        }

        function shouldSetConfirmButtonColor(color) {
          if (targetedConfirm && params.confirmButtonColor) {
            target.style.backgroundColor = color;
          }
        }

        switch (e.type) {
          case 'mouseover':
            shouldSetConfirmButtonColor(hoverColor);
            break;

          case 'mouseout':
            shouldSetConfirmButtonColor(normalColor);
            break;

          case 'mousedown':
            shouldSetConfirmButtonColor(activeColor);
            break;

          case 'mouseup':
            shouldSetConfirmButtonColor(hoverColor);
            break;

          case 'focus':
            var $confirmButton = modal.querySelector('button.confirm');
            var $cancelButton = modal.querySelector('button.cancel');

            if (targetedConfirm) {
              $cancelButton.style.boxShadow = 'none';
            } else {
              $confirmButton.style.boxShadow = 'none';
            }
            break;

          case 'click':
            var clickedOnModal = modal === target;
            var clickedOnModalChild = (0, _handleDom.isDescendant)(modal, target);

            // Ignore click outside if allowOutsideClick is false
            if (!clickedOnModal && !clickedOnModalChild && modalIsVisible && !params.allowOutsideClick) {
              break;
            }

            if (targetedConfirm && doneFunctionExists && modalIsVisible) {
              handleConfirm(modal, params);
            } else if (doneFunctionExists && modalIsVisible || targetedOverlay) {
              handleCancel(modal, params);
            } else if ((0, _handleDom.isDescendant)(modal, target) && target.tagName === 'BUTTON') {
              sweetAlert.close();
            }
            break;
        }
      };

      /*
       *  User clicked on "Confirm"/"OK"
       */
      var handleConfirm = function handleConfirm(modal, params) {
        var callbackValue = true;

        if ((0, _handleDom.hasClass)(modal, 'show-input')) {
          callbackValue = modal.querySelector('input').value;

          if (!callbackValue) {
            callbackValue = '';
          }
        }

        params.doneFunction(callbackValue);

        if (params.closeOnConfirm) {
          sweetAlert.close();
        }
        // Disable cancel and confirm button if the parameter is true
        if (params.showLoaderOnConfirm) {
          sweetAlert.disableButtons();
        }
      };

      /*
       *  User clicked on "Cancel"
       */
      var handleCancel = function handleCancel(modal, params) {
        // Check if callback function expects a parameter (to track cancel actions)
        var functionAsStr = String(params.doneFunction).replace(/\s/g, '');
        var functionHandlesCancel = functionAsStr.substring(0, 9) === 'function(' && functionAsStr.substring(9, 10) !== ')';

        if (functionHandlesCancel) {
          params.doneFunction(false);
        }

        if (params.closeOnCancel) {
          sweetAlert.close();
        }
      };

      exports['default'] = {
        handleButton: handleButton,
        handleConfirm: handleConfirm,
        handleCancel: handleCancel
      };
      module.exports = exports['default'];
    }, { "./handle-dom": 4, "./handle-swal-dom": 6, "./utils": 9 }], 4: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      var hasClass = function hasClass(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
      };

      var addClass = function addClass(elem, className) {
        if (!hasClass(elem, className)) {
          elem.className += ' ' + className;
        }
      };

      var removeClass = function removeClass(elem, className) {
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if (hasClass(elem, className)) {
          while (newClass.indexOf(' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
          }
          elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
      };

      var escapeHtml = function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
      };

      var _show = function _show(elem) {
        elem.style.opacity = '';
        elem.style.display = 'block';
      };

      var show = function show(elems) {
        if (elems && !elems.length) {
          return _show(elems);
        }
        for (var i = 0; i < elems.length; ++i) {
          _show(elems[i]);
        }
      };

      var _hide = function _hide(elem) {
        elem.style.opacity = '';
        elem.style.display = 'none';
      };

      var hide = function hide(elems) {
        if (elems && !elems.length) {
          return _hide(elems);
        }
        for (var i = 0; i < elems.length; ++i) {
          _hide(elems[i]);
        }
      };

      var isDescendant = function isDescendant(parent, child) {
        var node = child.parentNode;
        while (node !== null) {
          if (node === parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      };

      var getTopMargin = function getTopMargin(elem) {
        elem.style.left = '-9999px';
        elem.style.display = 'block';

        var height = elem.clientHeight,
            padding;
        if (typeof getComputedStyle !== "undefined") {
          // IE 8
          padding = parseInt(getComputedStyle(elem).getPropertyValue('padding-top'), 10);
        } else {
          padding = parseInt(elem.currentStyle.padding);
        }

        elem.style.left = '';
        elem.style.display = 'none';
        return '-' + parseInt((height + padding) / 2) + 'px';
      };

      var fadeIn = function fadeIn(elem, interval) {
        if (+elem.style.opacity < 1) {
          interval = interval || 16;
          elem.style.opacity = 0;
          elem.style.display = 'block';
          var last = +new Date();
          var tick = function tick() {
            elem.style.opacity = +elem.style.opacity + (new Date() - last) / 100;
            last = +new Date();

            if (+elem.style.opacity < 1) {
              setTimeout(tick, interval);
            }
          };
          tick();
        }
        elem.style.display = 'block'; //fallback IE8
      };

      var fadeOut = function fadeOut(elem, interval) {
        interval = interval || 16;
        elem.style.opacity = 1;
        var last = +new Date();
        var tick = function tick() {
          elem.style.opacity = +elem.style.opacity - (new Date() - last) / 100;
          last = +new Date();

          if (+elem.style.opacity > 0) {
            setTimeout(tick, interval);
          } else {
            elem.style.display = 'none';
          }
        };
        tick();
      };

      var fireClick = function fireClick(node) {
        // Taken from http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
        // Then fixed for today's Chrome browser.
        if (typeof MouseEvent === 'function') {
          // Up-to-date approach
          var mevt = new MouseEvent('click', {
            view: window,
            bubbles: false,
            cancelable: true
          });
          node.dispatchEvent(mevt);
        } else if (document.createEvent) {
          // Fallback
          var evt = document.createEvent('MouseEvents');
          evt.initEvent('click', false, false);
          node.dispatchEvent(evt);
        } else if (document.createEventObject) {
          node.fireEvent('onclick');
        } else if (typeof node.onclick === 'function') {
          node.onclick();
        }
      };

      var stopEventPropagation = function stopEventPropagation(e) {
        // In particular, make sure the space bar doesn't scroll the main window.
        if (typeof e.stopPropagation === 'function') {
          e.stopPropagation();
          e.preventDefault();
        } else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
          window.event.cancelBubble = true;
        }
      };

      exports.hasClass = hasClass;
      exports.addClass = addClass;
      exports.removeClass = removeClass;
      exports.escapeHtml = escapeHtml;
      exports._show = _show;
      exports.show = show;
      exports._hide = _hide;
      exports.hide = hide;
      exports.isDescendant = isDescendant;
      exports.getTopMargin = getTopMargin;
      exports.fadeIn = fadeIn;
      exports.fadeOut = fadeOut;
      exports.fireClick = fireClick;
      exports.stopEventPropagation = stopEventPropagation;
    }, {}], 5: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _handleDom = require('./handle-dom');

      var _handleSwalDom = require('./handle-swal-dom');

      var handleKeyDown = function handleKeyDown(event, params, modal) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;

        var $okButton = modal.querySelector('button.confirm');
        var $cancelButton = modal.querySelector('button.cancel');
        var $modalButtons = modal.querySelectorAll('button[tabindex]');

        if ([9, 13, 32, 27].indexOf(keyCode) === -1) {
          // Don't do work on keys we don't care about.
          return;
        }

        var $targetElement = e.target || e.srcElement;

        var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
        for (var i = 0; i < $modalButtons.length; i++) {
          if ($targetElement === $modalButtons[i]) {
            btnIndex = i;
            break;
          }
        }

        if (keyCode === 9) {
          // TAB
          if (btnIndex === -1) {
            // No button focused. Jump to the confirm button.
            $targetElement = $okButton;
          } else {
            // Cycle to the next button
            if (btnIndex === $modalButtons.length - 1) {
              $targetElement = $modalButtons[0];
            } else {
              $targetElement = $modalButtons[btnIndex + 1];
            }
          }

          (0, _handleDom.stopEventPropagation)(e);
          $targetElement.focus();

          if (params.confirmButtonColor) {
            (0, _handleSwalDom.setFocusStyle)($targetElement, params.confirmButtonColor);
          }
        } else {
          if (keyCode === 13) {
            if ($targetElement.tagName === 'INPUT') {
              $targetElement = $okButton;
              $okButton.focus();
            }

            if (btnIndex === -1) {
              // ENTER/SPACE clicked outside of a button.
              $targetElement = $okButton;
            } else {
              // Do nothing - let the browser handle it.
              $targetElement = undefined;
            }
          } else if (keyCode === 27 && params.allowEscapeKey === true) {
            $targetElement = $cancelButton;
            (0, _handleDom.fireClick)($targetElement, e);
          } else {
            // Fallback - let the browser handle it.
            $targetElement = undefined;
          }
        }
      };

      exports['default'] = handleKeyDown;
      module.exports = exports['default'];
    }, { "./handle-dom": 4, "./handle-swal-dom": 6 }], 6: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { 'default': obj };
      }

      var _utils = require('./utils');

      var _handleDom = require('./handle-dom');

      var _defaultParams = require('./default-params');

      var _defaultParams2 = _interopRequireDefault(_defaultParams);

      /*
       * Add modal + overlay to DOM
       */

      var _injectedHtml = require('./injected-html');

      var _injectedHtml2 = _interopRequireDefault(_injectedHtml);

      var modalClass = '.sweet-alert';
      var overlayClass = '.sweet-overlay';

      var sweetAlertInitialize = function sweetAlertInitialize() {
        var sweetWrap = document.createElement('div');
        sweetWrap.innerHTML = _injectedHtml2['default'];

        // Append elements to body
        while (sweetWrap.firstChild) {
          document.body.appendChild(sweetWrap.firstChild);
        }
      };

      /*
       * Get DOM element of modal
       */
      var getModal = function getModal() {
        var $modal = document.querySelector(modalClass);

        if (!$modal) {
          sweetAlertInitialize();
          $modal = getModal();
        }

        return $modal;
      };

      /*
       * Get DOM element of input (in modal)
       */
      var getInput = function getInput() {
        var $modal = getModal();
        if ($modal) {
          return $modal.querySelector('input');
        }
      };

      /*
       * Get DOM element of overlay
       */
      var getOverlay = function getOverlay() {
        return document.querySelector(overlayClass);
      };

      /*
       * Add box-shadow style to button (depending on its chosen bg-color)
       */
      var setFocusStyle = function setFocusStyle($button, bgColor) {
        var rgbColor = (0, _utils.hexToRgb)(bgColor);
        $button.style.boxShadow = '0 0 2px rgba(' + rgbColor + ', 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)';
      };

      /*
       * Animation when opening modal
       */
      var openModal = function openModal(callback) {
        var $modal = getModal();
        (0, _handleDom.fadeIn)(getOverlay(), 10);
        (0, _handleDom.show)($modal);
        (0, _handleDom.addClass)($modal, 'showSweetAlert');
        (0, _handleDom.removeClass)($modal, 'hideSweetAlert');

        window.previousActiveElement = document.activeElement;
        var $okButton = $modal.querySelector('button.confirm');
        $okButton.focus();

        setTimeout(function () {
          (0, _handleDom.addClass)($modal, 'visible');
        }, 500);

        var timer = $modal.getAttribute('data-timer');

        if (timer !== 'null' && timer !== '') {
          var timerCallback = callback;
          $modal.timeout = setTimeout(function () {
            var doneFunctionExists = (timerCallback || null) && $modal.getAttribute('data-has-done-function') === 'true';
            if (doneFunctionExists) {
              timerCallback(null);
            } else {
              sweetAlert.close();
            }
          }, timer);
        }
      };

      /*
       * Reset the styling of the input
       * (for example if errors have been shown)
       */
      var resetInput = function resetInput() {
        var $modal = getModal();
        var $input = getInput();

        (0, _handleDom.removeClass)($modal, 'show-input');
        $input.value = _defaultParams2['default'].inputValue;
        $input.setAttribute('type', _defaultParams2['default'].inputType);
        $input.setAttribute('placeholder', _defaultParams2['default'].inputPlaceholder);

        resetInputError();
      };

      var resetInputError = function resetInputError(event) {
        // If press enter => ignore
        if (event && event.keyCode === 13) {
          return false;
        }

        var $modal = getModal();

        var $errorIcon = $modal.querySelector('.sa-input-error');
        (0, _handleDom.removeClass)($errorIcon, 'show');

        var $errorContainer = $modal.querySelector('.sa-error-container');
        (0, _handleDom.removeClass)($errorContainer, 'show');
      };

      /*
       * Set "margin-top"-property on modal based on its computed height
       */
      var fixVerticalPosition = function fixVerticalPosition() {
        var $modal = getModal();
        $modal.style.marginTop = (0, _handleDom.getTopMargin)(getModal());
      };

      exports.sweetAlertInitialize = sweetAlertInitialize;
      exports.getModal = getModal;
      exports.getOverlay = getOverlay;
      exports.getInput = getInput;
      exports.setFocusStyle = setFocusStyle;
      exports.openModal = openModal;
      exports.resetInput = resetInput;
      exports.resetInputError = resetInputError;
      exports.fixVerticalPosition = fixVerticalPosition;
    }, { "./default-params": 2, "./handle-dom": 4, "./injected-html": 7, "./utils": 9 }], 7: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var injectedHTML =

      // Dark overlay
      "<div class=\"sweet-overlay\" tabIndex=\"-1\"></div>" +

      // Modal
      "<div class=\"sweet-alert\">" +

      // Error icon
      "<div class=\"sa-icon sa-error\">\n      <span class=\"sa-x-mark\">\n        <span class=\"sa-line sa-left\"></span>\n        <span class=\"sa-line sa-right\"></span>\n      </span>\n    </div>" +

      // Warning icon
      "<div class=\"sa-icon sa-warning\">\n      <span class=\"sa-body\"></span>\n      <span class=\"sa-dot\"></span>\n    </div>" +

      // Info icon
      "<div class=\"sa-icon sa-info\"></div>" +

      // Success icon
      "<div class=\"sa-icon sa-success\">\n      <span class=\"sa-line sa-tip\"></span>\n      <span class=\"sa-line sa-long\"></span>\n\n      <div class=\"sa-placeholder\"></div>\n      <div class=\"sa-fix\"></div>\n    </div>" + "<div class=\"sa-icon sa-custom\"></div>" +

      // Title, text and input
      "<h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type=\"text\" tabIndex=\"3\" />\n      <div class=\"sa-input-error\"></div>\n    </fieldset>" +

      // Input errors
      "<div class=\"sa-error-container\">\n      <div class=\"icon\">!</div>\n      <p>Not valid!</p>\n    </div>" +

      // Cancel and confirm buttons
      "<div class=\"sa-button-container\">\n      <button class=\"cancel\" tabIndex=\"2\">Cancel</button>\n      <div class=\"sa-confirm-button-container\">\n        <button class=\"confirm\" tabIndex=\"1\">OK</button>" +

      // Loading animation
      "<div class=\"la-ball-fall\">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div>" +

      // End of modal
      "</div>";

      exports["default"] = injectedHTML;
      module.exports = exports["default"];
    }, {}], 8: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _utils = require('./utils');

      var _handleSwalDom = require('./handle-swal-dom');

      var _handleDom = require('./handle-dom');

      /*
       * Set type, text and actions on modal
       */
      var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];

      var setParameters = function setParameters(params) {
        var modal = (0, _handleSwalDom.getModal)();

        var $title = modal.querySelector('h2');
        var $text = modal.querySelector('p');
        var $cancelBtn = modal.querySelector('button.cancel');
        var $confirmBtn = modal.querySelector('button.confirm');

        /*
         * Title
         */
        $title.innerHTML = params.html ? params.title : (0, _handleDom.escapeHtml)(params.title).split('\n').join('<br>');

        /*
         * Text
         */
        $text.innerHTML = params.html ? params.text : (0, _handleDom.escapeHtml)(params.text || '').split('\n').join('<br>');
        if (params.text) (0, _handleDom.show)($text);

        /*
         * Custom class
         */
        if (params.customClass) {
          (0, _handleDom.addClass)(modal, params.customClass);
          modal.setAttribute('data-custom-class', params.customClass);
        } else {
          // Find previously set classes and remove them
          var customClass = modal.getAttribute('data-custom-class');
          (0, _handleDom.removeClass)(modal, customClass);
          modal.setAttribute('data-custom-class', '');
        }

        /*
         * Icon
         */
        (0, _handleDom.hide)(modal.querySelectorAll('.sa-icon'));

        if (params.type && !(0, _utils.isIE8)()) {
          var _ret = function () {

            var validType = false;

            for (var i = 0; i < alertTypes.length; i++) {
              if (params.type === alertTypes[i]) {
                validType = true;
                break;
              }
            }

            if (!validType) {
              logStr('Unknown alert type: ' + params.type);
              return {
                v: false
              };
            }

            var typesWithIcons = ['success', 'error', 'warning', 'info'];
            var $icon = undefined;

            if (typesWithIcons.indexOf(params.type) !== -1) {
              $icon = modal.querySelector('.sa-icon.' + 'sa-' + params.type);
              (0, _handleDom.show)($icon);
            }

            var $input = (0, _handleSwalDom.getInput)();

            // Animate icon
            switch (params.type) {

              case 'success':
                (0, _handleDom.addClass)($icon, 'animate');
                (0, _handleDom.addClass)($icon.querySelector('.sa-tip'), 'animateSuccessTip');
                (0, _handleDom.addClass)($icon.querySelector('.sa-long'), 'animateSuccessLong');
                break;

              case 'error':
                (0, _handleDom.addClass)($icon, 'animateErrorIcon');
                (0, _handleDom.addClass)($icon.querySelector('.sa-x-mark'), 'animateXMark');
                break;

              case 'warning':
                (0, _handleDom.addClass)($icon, 'pulseWarning');
                (0, _handleDom.addClass)($icon.querySelector('.sa-body'), 'pulseWarningIns');
                (0, _handleDom.addClass)($icon.querySelector('.sa-dot'), 'pulseWarningIns');
                break;

              case 'input':
              case 'prompt':
                $input.setAttribute('type', params.inputType);
                $input.value = params.inputValue;
                $input.setAttribute('placeholder', params.inputPlaceholder);
                (0, _handleDom.addClass)(modal, 'show-input');
                setTimeout(function () {
                  $input.focus();
                  $input.addEventListener('keyup', swal.resetInputError);
                }, 400);
                break;
            }
          }();

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === 'object') return _ret.v;
        }

        /*
         * Custom image
         */
        if (params.imageUrl) {
          var $customIcon = modal.querySelector('.sa-icon.sa-custom');

          $customIcon.style.backgroundImage = 'url(' + params.imageUrl + ')';
          (0, _handleDom.show)($customIcon);

          var _imgWidth = 80;
          var _imgHeight = 80;

          if (params.imageSize) {
            var dimensions = params.imageSize.toString().split('x');
            var imgWidth = dimensions[0];
            var imgHeight = dimensions[1];

            if (!imgWidth || !imgHeight) {
              logStr('Parameter imageSize expects value with format WIDTHxHEIGHT, got ' + params.imageSize);
            } else {
              _imgWidth = imgWidth;
              _imgHeight = imgHeight;
            }
          }

          $customIcon.setAttribute('style', $customIcon.getAttribute('style') + 'width:' + _imgWidth + 'px; height:' + _imgHeight + 'px');
        }

        /*
         * Show cancel button?
         */
        modal.setAttribute('data-has-cancel-button', params.showCancelButton);
        if (params.showCancelButton) {
          $cancelBtn.style.display = 'inline-block';
        } else {
          (0, _handleDom.hide)($cancelBtn);
        }

        /*
         * Show confirm button?
         */
        modal.setAttribute('data-has-confirm-button', params.showConfirmButton);
        if (params.showConfirmButton) {
          $confirmBtn.style.display = 'inline-block';
        } else {
          (0, _handleDom.hide)($confirmBtn);
        }

        /*
         * Custom text on cancel/confirm buttons
         */
        if (params.cancelButtonText) {
          $cancelBtn.innerHTML = (0, _handleDom.escapeHtml)(params.cancelButtonText);
        }
        if (params.confirmButtonText) {
          $confirmBtn.innerHTML = (0, _handleDom.escapeHtml)(params.confirmButtonText);
        }

        /*
         * Custom color on confirm button
         */
        if (params.confirmButtonColor) {
          // Set confirm button to selected background color
          $confirmBtn.style.backgroundColor = params.confirmButtonColor;

          // Set the confirm button color to the loading ring
          $confirmBtn.style.borderLeftColor = params.confirmLoadingButtonColor;
          $confirmBtn.style.borderRightColor = params.confirmLoadingButtonColor;

          // Set box-shadow to default focused button
          (0, _handleSwalDom.setFocusStyle)($confirmBtn, params.confirmButtonColor);
        }

        /*
         * Allow outside click
         */
        modal.setAttribute('data-allow-outside-click', params.allowOutsideClick);

        /*
         * Callback function
         */
        var hasDoneFunction = params.doneFunction ? true : false;
        modal.setAttribute('data-has-done-function', hasDoneFunction);

        /*
         * Animation
         */
        if (!params.animation) {
          modal.setAttribute('data-animation', 'none');
        } else if (typeof params.animation === 'string') {
          modal.setAttribute('data-animation', params.animation); // Custom animation
        } else {
          modal.setAttribute('data-animation', 'pop');
        }

        /*
         * Timer
         */
        modal.setAttribute('data-timer', params.timer);
      };

      exports['default'] = setParameters;
      module.exports = exports['default'];
    }, { "./handle-dom": 4, "./handle-swal-dom": 6, "./utils": 9 }], 9: [function (require, module, exports) {
      /*
       * Allow user to pass their own params
       */
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      var extend = function extend(a, b) {
        for (var key in b) {
          if (b.hasOwnProperty(key)) {
            a[key] = b[key];
          }
        }
        return a;
      };

      /*
       * Convert HEX codes to RGB values (#000000 -> rgb(0,0,0))
       */
      var hexToRgb = function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
      };

      /*
       * Check if the user is using Internet Explorer 8 (for fallbacks)
       */
      var isIE8 = function isIE8() {
        return window.attachEvent && !window.addEventListener;
      };

      /*
       * IE compatible logging for developers
       */
      var logStr = function logStr(string) {
        if (typeof window !== 'undefined' && window.console) {
          // IE...
          window.console.log('SweetAlert: ' + string);
        }
      };

      /*
       * Set hover, active and focus-states for buttons
       * (source: http://www.sitepoint.com/javascript-generate-lighter-darker-color)
       */
      var colorLuminance = function colorLuminance(hex, lum) {
        // Validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // Convert to decimal and change luminosity
        var rgb = '#';
        var c;
        var i;

        for (i = 0; i < 3; i++) {
          c = parseInt(hex.substr(i * 2, 2), 16);
          c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
          rgb += ('00' + c).substr(c.length);
        }

        return rgb;
      };

      exports.extend = extend;
      exports.hexToRgb = hexToRgb;
      exports.isIE8 = isIE8;
      exports.logStr = logStr;
      exports.colorLuminance = colorLuminance;
    }, {}] }, {}, [1]);

  /*
   * Use SweetAlert with RequireJS
   */

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return sweetAlert;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = sweetAlert;
  }
})(window, document);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t, n) {
  "use strict";
  !function o(e, t, n) {
    function a(s, l) {
      if (!t[s]) {
        if (!e[s]) {
          var i = "function" == typeof require && require;if (!l && i) return i(s, !0);if (r) return r(s, !0);var u = new Error("Cannot find module '" + s + "'");throw u.code = "MODULE_NOT_FOUND", u;
        }var c = t[s] = { exports: {} };e[s][0].call(c.exports, function (t) {
          var n = e[s][1][t];return a(n ? n : t);
        }, c, c.exports, o, e, t, n);
      }return t[s].exports;
    }for (var r = "function" == typeof require && require, s = 0; s < n.length; s++) {
      a(n[s]);
    }return a;
  }({ 1: [function (o, a, r) {
      function s(e) {
        return e && e.__esModule ? e : { "default": e };
      }Object.defineProperty(r, "__esModule", { value: !0 });var l,
          i,
          u,
          _c,
          d = o("./modules/handle-dom"),
          f = o("./modules/utils"),
          p = o("./modules/handle-swal-dom"),
          m = o("./modules/handle-click"),
          v = o("./modules/handle-key"),
          y = s(v),
          b = o("./modules/default-params"),
          h = s(b),
          g = o("./modules/set-params"),
          w = s(g);r["default"] = u = _c = function c() {
        function o(e) {
          var t = a;return t[e] === n ? h["default"][e] : t[e];
        }var a = arguments[0];if ((0, d.addClass)(t.body, "stop-scrolling"), (0, p.resetInput)(), a === n) return (0, f.logStr)("SweetAlert expects at least 1 attribute!"), !1;var r = (0, f.extend)({}, h["default"]);switch (typeof a === "undefined" ? "undefined" : _typeof(a)) {case "string":
            r.title = a, r.text = arguments[1] || "", r.type = arguments[2] || "";break;case "object":
            if (a.title === n) return (0, f.logStr)('Missing "title" argument!'), !1;r.title = a.title;for (var s in h["default"]) {
              r[s] = o(s);
            }r.confirmButtonText = r.showCancelButton ? "Confirm" : h["default"].confirmButtonText, r.confirmButtonText = o("confirmButtonText"), r.doneFunction = arguments[1] || null;break;default:
            return (0, f.logStr)('Unexpected type of argument! Expected "string" or "object", got ' + (typeof a === "undefined" ? "undefined" : _typeof(a))), !1;}(0, w["default"])(r), (0, p.fixVerticalPosition)(), (0, p.openModal)(arguments[1]);for (var u = (0, p.getModal)(), v = u.querySelectorAll("button"), b = ["onclick", "onmouseover", "onmouseout", "onmousedown", "onmouseup", "onfocus"], g = function g(e) {
          return (0, m.handleButton)(e, r, u);
        }, C = 0; C < v.length; C++) {
          for (var S = 0; S < b.length; S++) {
            var x = b[S];v[C][x] = g;
          }
        }(0, p.getOverlay)().onclick = g, l = e.onkeydown;var k = function k(e) {
          return (0, y["default"])(e, r, u);
        };e.onkeydown = k, e.onfocus = function () {
          setTimeout(function () {
            i !== n && (i.focus(), i = n);
          }, 0);
        }, _c.enableButtons();
      }, u.setDefaults = _c.setDefaults = function (e) {
        if (!e) throw new Error("userParams is required");if ("object" != (typeof e === "undefined" ? "undefined" : _typeof(e))) throw new Error("userParams has to be a object");(0, f.extend)(h["default"], e);
      }, u.close = _c.close = function () {
        var o = (0, p.getModal)();(0, d.fadeOut)((0, p.getOverlay)(), 5), (0, d.fadeOut)(o, 5), (0, d.removeClass)(o, "showSweetAlert"), (0, d.addClass)(o, "hideSweetAlert"), (0, d.removeClass)(o, "visible");var a = o.querySelector(".sa-icon.sa-success");(0, d.removeClass)(a, "animate"), (0, d.removeClass)(a.querySelector(".sa-tip"), "animateSuccessTip"), (0, d.removeClass)(a.querySelector(".sa-long"), "animateSuccessLong");var r = o.querySelector(".sa-icon.sa-error");(0, d.removeClass)(r, "animateErrorIcon"), (0, d.removeClass)(r.querySelector(".sa-x-mark"), "animateXMark");var s = o.querySelector(".sa-icon.sa-warning");return (0, d.removeClass)(s, "pulseWarning"), (0, d.removeClass)(s.querySelector(".sa-body"), "pulseWarningIns"), (0, d.removeClass)(s.querySelector(".sa-dot"), "pulseWarningIns"), setTimeout(function () {
          var e = o.getAttribute("data-custom-class");(0, d.removeClass)(o, e);
        }, 300), (0, d.removeClass)(t.body, "stop-scrolling"), e.onkeydown = l, e.previousActiveElement && e.previousActiveElement.focus(), i = n, clearTimeout(o.timeout), !0;
      }, u.showInputError = _c.showInputError = function (e) {
        var t = (0, p.getModal)(),
            n = t.querySelector(".sa-input-error");(0, d.addClass)(n, "show");var o = t.querySelector(".sa-error-container");(0, d.addClass)(o, "show"), o.querySelector("p").innerHTML = e, setTimeout(function () {
          u.enableButtons();
        }, 1), t.querySelector("input").focus();
      }, u.resetInputError = _c.resetInputError = function (e) {
        if (e && 13 === e.keyCode) return !1;var t = (0, p.getModal)(),
            n = t.querySelector(".sa-input-error");(0, d.removeClass)(n, "show");var o = t.querySelector(".sa-error-container");(0, d.removeClass)(o, "show");
      }, u.disableButtons = _c.disableButtons = function (e) {
        var t = (0, p.getModal)(),
            n = t.querySelector("button.confirm"),
            o = t.querySelector("button.cancel");n.disabled = !0, o.disabled = !0;
      }, u.enableButtons = _c.enableButtons = function (e) {
        var t = (0, p.getModal)(),
            n = t.querySelector("button.confirm"),
            o = t.querySelector("button.cancel");n.disabled = !1, o.disabled = !1;
      }, "undefined" != typeof e ? e.sweetAlert = e.swal = u : (0, f.logStr)("SweetAlert is a frontend module!"), a.exports = r["default"];
    }, { "./modules/default-params": 2, "./modules/handle-click": 3, "./modules/handle-dom": 4, "./modules/handle-key": 5, "./modules/handle-swal-dom": 6, "./modules/set-params": 8, "./modules/utils": 9 }], 2: [function (e, t, n) {
      Object.defineProperty(n, "__esModule", { value: !0 });var o = { title: "", text: "", type: null, allowOutsideClick: !1, showConfirmButton: !0, showCancelButton: !1, closeOnConfirm: !0, closeOnCancel: !0, confirmButtonText: "OK", confirmButtonColor: "#8CD4F5", cancelButtonText: "Cancel", imageUrl: null, imageSize: null, timer: null, customClass: "", html: !1, animation: !0, allowEscapeKey: !0, inputType: "text", inputPlaceholder: "", inputValue: "", showLoaderOnConfirm: !1 };n["default"] = o, t.exports = n["default"];
    }, {}], 3: [function (t, n, o) {
      Object.defineProperty(o, "__esModule", { value: !0 });var a = t("./utils"),
          r = (t("./handle-swal-dom"), t("./handle-dom")),
          s = function s(t, n, o) {
        function s(e) {
          m && n.confirmButtonColor && (p.style.backgroundColor = e);
        }var u,
            c,
            d,
            f = t || e.event,
            p = f.target || f.srcElement,
            m = -1 !== p.className.indexOf("confirm"),
            v = -1 !== p.className.indexOf("sweet-overlay"),
            y = (0, r.hasClass)(o, "visible"),
            b = n.doneFunction && "true" === o.getAttribute("data-has-done-function");switch (m && n.confirmButtonColor && (u = n.confirmButtonColor, c = (0, a.colorLuminance)(u, -.04), d = (0, a.colorLuminance)(u, -.14)), f.type) {case "mouseover":
            s(c);break;case "mouseout":
            s(u);break;case "mousedown":
            s(d);break;case "mouseup":
            s(c);break;case "focus":
            var h = o.querySelector("button.confirm"),
                g = o.querySelector("button.cancel");m ? g.style.boxShadow = "none" : h.style.boxShadow = "none";break;case "click":
            var w = o === p,
                C = (0, r.isDescendant)(o, p);if (!w && !C && y && !n.allowOutsideClick) break;m && b && y ? l(o, n) : b && y || v ? i(o, n) : (0, r.isDescendant)(o, p) && "BUTTON" === p.tagName && sweetAlert.close();}
      },
          l = function l(e, t) {
        var n = !0;(0, r.hasClass)(e, "show-input") && (n = e.querySelector("input").value, n || (n = "")), t.doneFunction(n), t.closeOnConfirm && sweetAlert.close(), t.showLoaderOnConfirm && sweetAlert.disableButtons();
      },
          i = function i(e, t) {
        var n = String(t.doneFunction).replace(/\s/g, ""),
            o = "function(" === n.substring(0, 9) && ")" !== n.substring(9, 10);o && t.doneFunction(!1), t.closeOnCancel && sweetAlert.close();
      };o["default"] = { handleButton: s, handleConfirm: l, handleCancel: i }, n.exports = o["default"];
    }, { "./handle-dom": 4, "./handle-swal-dom": 6, "./utils": 9 }], 4: [function (n, o, a) {
      Object.defineProperty(a, "__esModule", { value: !0 });var r = function r(e, t) {
        return new RegExp(" " + t + " ").test(" " + e.className + " ");
      },
          s = function s(e, t) {
        r(e, t) || (e.className += " " + t);
      },
          l = function l(e, t) {
        var n = " " + e.className.replace(/[\t\r\n]/g, " ") + " ";if (r(e, t)) {
          for (; n.indexOf(" " + t + " ") >= 0;) {
            n = n.replace(" " + t + " ", " ");
          }e.className = n.replace(/^\s+|\s+$/g, "");
        }
      },
          i = function i(e) {
        var n = t.createElement("div");return n.appendChild(t.createTextNode(e)), n.innerHTML;
      },
          u = function u(e) {
        e.style.opacity = "", e.style.display = "block";
      },
          c = function c(e) {
        if (e && !e.length) return u(e);for (var t = 0; t < e.length; ++t) {
          u(e[t]);
        }
      },
          d = function d(e) {
        e.style.opacity = "", e.style.display = "none";
      },
          f = function f(e) {
        if (e && !e.length) return d(e);for (var t = 0; t < e.length; ++t) {
          d(e[t]);
        }
      },
          p = function p(e, t) {
        for (var n = t.parentNode; null !== n;) {
          if (n === e) return !0;n = n.parentNode;
        }return !1;
      },
          m = function m(e) {
        e.style.left = "-9999px", e.style.display = "block";var t,
            n = e.clientHeight;return t = "undefined" != typeof getComputedStyle ? parseInt(getComputedStyle(e).getPropertyValue("padding-top"), 10) : parseInt(e.currentStyle.padding), e.style.left = "", e.style.display = "none", "-" + parseInt((n + t) / 2) + "px";
      },
          v = function v(e, t) {
        if (+e.style.opacity < 1) {
          t = t || 16, e.style.opacity = 0, e.style.display = "block";var n = +new Date(),
              o = function a() {
            e.style.opacity = +e.style.opacity + (new Date() - n) / 100, n = +new Date(), +e.style.opacity < 1 && setTimeout(a, t);
          };o();
        }e.style.display = "block";
      },
          y = function y(e, t) {
        t = t || 16, e.style.opacity = 1;var n = +new Date(),
            o = function a() {
          e.style.opacity = +e.style.opacity - (new Date() - n) / 100, n = +new Date(), +e.style.opacity > 0 ? setTimeout(a, t) : e.style.display = "none";
        };o();
      },
          b = function b(n) {
        if ("function" == typeof MouseEvent) {
          var o = new MouseEvent("click", { view: e, bubbles: !1, cancelable: !0 });n.dispatchEvent(o);
        } else if (t.createEvent) {
          var a = t.createEvent("MouseEvents");a.initEvent("click", !1, !1), n.dispatchEvent(a);
        } else t.createEventObject ? n.fireEvent("onclick") : "function" == typeof n.onclick && n.onclick();
      },
          h = function h(t) {
        "function" == typeof t.stopPropagation ? (t.stopPropagation(), t.preventDefault()) : e.event && e.event.hasOwnProperty("cancelBubble") && (e.event.cancelBubble = !0);
      };a.hasClass = r, a.addClass = s, a.removeClass = l, a.escapeHtml = i, a._show = u, a.show = c, a._hide = d, a.hide = f, a.isDescendant = p, a.getTopMargin = m, a.fadeIn = v, a.fadeOut = y, a.fireClick = b, a.stopEventPropagation = h;
    }, {}], 5: [function (t, o, a) {
      Object.defineProperty(a, "__esModule", { value: !0 });var r = t("./handle-dom"),
          s = t("./handle-swal-dom"),
          l = function l(t, o, a) {
        var l = t || e.event,
            i = l.keyCode || l.which,
            u = a.querySelector("button.confirm"),
            c = a.querySelector("button.cancel"),
            d = a.querySelectorAll("button[tabindex]");if (-1 !== [9, 13, 32, 27].indexOf(i)) {
          for (var f = l.target || l.srcElement, p = -1, m = 0; m < d.length; m++) {
            if (f === d[m]) {
              p = m;break;
            }
          }9 === i ? (f = -1 === p ? u : p === d.length - 1 ? d[0] : d[p + 1], (0, r.stopEventPropagation)(l), f.focus(), o.confirmButtonColor && (0, s.setFocusStyle)(f, o.confirmButtonColor)) : 13 === i ? ("INPUT" === f.tagName && (f = u, u.focus()), f = -1 === p ? u : n) : 27 === i && o.allowEscapeKey === !0 ? (f = c, (0, r.fireClick)(f, l)) : f = n;
        }
      };a["default"] = l, o.exports = a["default"];
    }, { "./handle-dom": 4, "./handle-swal-dom": 6 }], 6: [function (n, o, a) {
      function r(e) {
        return e && e.__esModule ? e : { "default": e };
      }Object.defineProperty(a, "__esModule", { value: !0 });var s = n("./utils"),
          l = n("./handle-dom"),
          i = n("./default-params"),
          u = r(i),
          c = n("./injected-html"),
          d = r(c),
          f = ".sweet-alert",
          p = ".sweet-overlay",
          m = function m() {
        var e = t.createElement("div");for (e.innerHTML = d["default"]; e.firstChild;) {
          t.body.appendChild(e.firstChild);
        }
      },
          v = function x() {
        var e = t.querySelector(f);return e || (m(), e = x()), e;
      },
          y = function y() {
        var e = v();return e ? e.querySelector("input") : void 0;
      },
          b = function b() {
        return t.querySelector(p);
      },
          h = function h(e, t) {
        var n = (0, s.hexToRgb)(t);e.style.boxShadow = "0 0 2px rgba(" + n + ", 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)";
      },
          g = function g(n) {
        var o = v();(0, l.fadeIn)(b(), 10), (0, l.show)(o), (0, l.addClass)(o, "showSweetAlert"), (0, l.removeClass)(o, "hideSweetAlert"), e.previousActiveElement = t.activeElement;var a = o.querySelector("button.confirm");a.focus(), setTimeout(function () {
          (0, l.addClass)(o, "visible");
        }, 500);var r = o.getAttribute("data-timer");if ("null" !== r && "" !== r) {
          var s = n;o.timeout = setTimeout(function () {
            var e = (s || null) && "true" === o.getAttribute("data-has-done-function");e ? s(null) : sweetAlert.close();
          }, r);
        }
      },
          w = function w() {
        var e = v(),
            t = y();(0, l.removeClass)(e, "show-input"), t.value = u["default"].inputValue, t.setAttribute("type", u["default"].inputType), t.setAttribute("placeholder", u["default"].inputPlaceholder), C();
      },
          C = function C(e) {
        if (e && 13 === e.keyCode) return !1;var t = v(),
            n = t.querySelector(".sa-input-error");(0, l.removeClass)(n, "show");var o = t.querySelector(".sa-error-container");(0, l.removeClass)(o, "show");
      },
          S = function S() {
        var e = v();e.style.marginTop = (0, l.getTopMargin)(v());
      };a.sweetAlertInitialize = m, a.getModal = v, a.getOverlay = b, a.getInput = y, a.setFocusStyle = h, a.openModal = g, a.resetInput = w, a.resetInputError = C, a.fixVerticalPosition = S;
    }, { "./default-params": 2, "./handle-dom": 4, "./injected-html": 7, "./utils": 9 }], 7: [function (e, t, n) {
      Object.defineProperty(n, "__esModule", { value: !0 });var o = '<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert"><div class="sa-icon sa-error">\n      <span class="sa-x-mark">\n        <span class="sa-line sa-left"></span>\n        <span class="sa-line sa-right"></span>\n      </span>\n    </div><div class="sa-icon sa-warning">\n      <span class="sa-body"></span>\n      <span class="sa-dot"></span>\n    </div><div class="sa-icon sa-info"></div><div class="sa-icon sa-success">\n      <span class="sa-line sa-tip"></span>\n      <span class="sa-line sa-long"></span>\n\n      <div class="sa-placeholder"></div>\n      <div class="sa-fix"></div>\n    </div><div class="sa-icon sa-custom"></div><h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type="text" tabIndex="3" />\n      <div class="sa-input-error"></div>\n    </fieldset><div class="sa-error-container">\n      <div class="icon">!</div>\n      <p>Not valid!</p>\n    </div><div class="sa-button-container">\n      <button class="cancel" tabIndex="2">Cancel</button>\n      <div class="sa-confirm-button-container">\n        <button class="confirm" tabIndex="1">OK</button><div class="la-ball-fall">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div></div>';n["default"] = o, t.exports = n["default"];
    }, {}], 8: [function (e, t, o) {
      Object.defineProperty(o, "__esModule", { value: !0 });var a = e("./utils"),
          r = e("./handle-swal-dom"),
          s = e("./handle-dom"),
          l = ["error", "warning", "info", "success", "input", "prompt"],
          i = function i(e) {
        var t = (0, r.getModal)(),
            o = t.querySelector("h2"),
            i = t.querySelector("p"),
            u = t.querySelector("button.cancel"),
            c = t.querySelector("button.confirm");if (o.innerHTML = e.html ? e.title : (0, s.escapeHtml)(e.title).split("\n").join("<br>"), i.innerHTML = e.html ? e.text : (0, s.escapeHtml)(e.text || "").split("\n").join("<br>"), e.text && (0, s.show)(i), e.customClass) (0, s.addClass)(t, e.customClass), t.setAttribute("data-custom-class", e.customClass);else {
          var d = t.getAttribute("data-custom-class");(0, s.removeClass)(t, d), t.setAttribute("data-custom-class", "");
        }if ((0, s.hide)(t.querySelectorAll(".sa-icon")), e.type && !(0, a.isIE8)()) {
          var f = function () {
            for (var o = !1, a = 0; a < l.length; a++) {
              if (e.type === l[a]) {
                o = !0;break;
              }
            }if (!o) return logStr("Unknown alert type: " + e.type), { v: !1 };var i = ["success", "error", "warning", "info"],
                u = n;-1 !== i.indexOf(e.type) && (u = t.querySelector(".sa-icon.sa-" + e.type), (0, s.show)(u));var c = (0, r.getInput)();switch (e.type) {case "success":
                (0, s.addClass)(u, "animate"), (0, s.addClass)(u.querySelector(".sa-tip"), "animateSuccessTip"), (0, s.addClass)(u.querySelector(".sa-long"), "animateSuccessLong");break;case "error":
                (0, s.addClass)(u, "animateErrorIcon"), (0, s.addClass)(u.querySelector(".sa-x-mark"), "animateXMark");break;case "warning":
                (0, s.addClass)(u, "pulseWarning"), (0, s.addClass)(u.querySelector(".sa-body"), "pulseWarningIns"), (0, s.addClass)(u.querySelector(".sa-dot"), "pulseWarningIns");break;case "input":case "prompt":
                c.setAttribute("type", e.inputType), c.value = e.inputValue, c.setAttribute("placeholder", e.inputPlaceholder), (0, s.addClass)(t, "show-input"), setTimeout(function () {
                  c.focus(), c.addEventListener("keyup", swal.resetInputError);
                }, 400);}
          }();if ("object" == (typeof f === "undefined" ? "undefined" : _typeof(f))) return f.v;
        }if (e.imageUrl) {
          var p = t.querySelector(".sa-icon.sa-custom");p.style.backgroundImage = "url(" + e.imageUrl + ")", (0, s.show)(p);var m = 80,
              v = 80;if (e.imageSize) {
            var y = e.imageSize.toString().split("x"),
                b = y[0],
                h = y[1];b && h ? (m = b, v = h) : logStr("Parameter imageSize expects value with format WIDTHxHEIGHT, got " + e.imageSize);
          }p.setAttribute("style", p.getAttribute("style") + "width:" + m + "px; height:" + v + "px");
        }t.setAttribute("data-has-cancel-button", e.showCancelButton), e.showCancelButton ? u.style.display = "inline-block" : (0, s.hide)(u), t.setAttribute("data-has-confirm-button", e.showConfirmButton), e.showConfirmButton ? c.style.display = "inline-block" : (0, s.hide)(c), e.cancelButtonText && (u.innerHTML = (0, s.escapeHtml)(e.cancelButtonText)), e.confirmButtonText && (c.innerHTML = (0, s.escapeHtml)(e.confirmButtonText)), e.confirmButtonColor && (c.style.backgroundColor = e.confirmButtonColor, c.style.borderLeftColor = e.confirmLoadingButtonColor, c.style.borderRightColor = e.confirmLoadingButtonColor, (0, r.setFocusStyle)(c, e.confirmButtonColor)), t.setAttribute("data-allow-outside-click", e.allowOutsideClick);var g = !!e.doneFunction;t.setAttribute("data-has-done-function", g), e.animation ? "string" == typeof e.animation ? t.setAttribute("data-animation", e.animation) : t.setAttribute("data-animation", "pop") : t.setAttribute("data-animation", "none"), t.setAttribute("data-timer", e.timer);
      };o["default"] = i, t.exports = o["default"];
    }, { "./handle-dom": 4, "./handle-swal-dom": 6, "./utils": 9 }], 9: [function (t, n, o) {
      Object.defineProperty(o, "__esModule", { value: !0 });var a = function a(e, t) {
        for (var n in t) {
          t.hasOwnProperty(n) && (e[n] = t[n]);
        }return e;
      },
          r = function r(e) {
        var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t ? parseInt(t[1], 16) + ", " + parseInt(t[2], 16) + ", " + parseInt(t[3], 16) : null;
      },
          s = function s() {
        return e.attachEvent && !e.addEventListener;
      },
          l = function l(t) {
        "undefined" != typeof e && e.console && e.console.log("SweetAlert: " + t);
      },
          i = function i(e, t) {
        e = String(e).replace(/[^0-9a-f]/gi, ""), e.length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), t = t || 0;var n,
            o,
            a = "#";for (o = 0; 3 > o; o++) {
          n = parseInt(e.substr(2 * o, 2), 16), n = Math.round(Math.min(Math.max(0, n + n * t), 255)).toString(16), a += ("00" + n).substr(n.length);
        }return a;
      };o.extend = a, o.hexToRgb = r, o.isIE8 = s, o.logStr = l, o.colorLuminance = i;
    }, {}] }, {}, [1]), "function" == typeof define && define.amd ? define(function () {
    return sweetAlert;
  }) : "undefined" != typeof module && module.exports && (module.exports = sweetAlert);
}(window, document);
'use strict';

angular.module('familyVideo').directive('navBar', function () {

  return {
    restrict: 'E',
    templateUrl: './views/navBar.html',
    link: function link(scope) {},
    controller: 'mainCtrl'
  };
});
'use strict';

angular.module('familyVideo').controller('checkoutCtrl', function ($scope, mainService, $state) {
  $scope.checkout = function (address) {
    console.log('from checkout ctrl', address);
    mainService.getAddress(address);
    if (address) {
      $state.go('verify');
    }
  };
});
'use strict';

angular.module('familyVideo').controller('createAccountCtrl', function ($scope, mainService) {

  $scope.createUser = function (user) {
    if (user.password === $scope.confirmPassword) {
      console.log('passwords match');
      mainService.createAccount(user);
      $scope.user = {};
      $scope.confirmPassword = "";
    } else {
      alert('nope');
      // use sweet alerts
      // http://t4t5.github.io/sweetalert/
      // or use a directive
      //  http://stackoverflow.com/questions/12581439/how-to-add-custom-validation-to-an-angularjs-form
    }
    // user.first_name = '';
  };
});
'use strict';

angular.module('familyVideo').controller('homeCtrl', function ($scope, mainService) {});
//   $scope.myInterval = 3000;
//   $scope.slides = [
//     {
//       image: 'http://lorempixel.com/400/200/'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/food'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/sports'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/people'
//     }
//   ];
// })

// angular.module('familyVideo', ['ui.bootstrap']);
// function CarouselDemoCtrl($scope){
//   $scope.myInterval = 3000;
//   $scope.slides = [
//     {
//       image: 'http://lorempixel.com/400/200/'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/food'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/sports'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/people'
//     }
//   ];
// }
'use strict';

angular.module('familyVideo').controller('searchCtrl', function ($scope, mainService, $interval) {

  $scope.addToCart = function (movieObject) {
    mainService.addMovieToCart(movieObject).then(function () {
      // $scope.showCart();
    });
  };

  $scope.query = mainService.query;

  // $interval(function(){
  //   console.log('from search rontrol,', $scope.query, "num2",mainService.query)
  // }, 1000)

  // mainService.testing=$scope.searchQuery;

  // $scope.controlData();

});
'use strict';

angular.module('familyVideo').controller('signInCtrl', function ($scope, mainService, $state) {

  $scope.logIn = function (account) {
    mainService.logInUser(account).then(function (response) {
      $scope.account = {};

      alert('Hello');
    });
  };
});
'use strict';

angular.module('familyVideo').controller('verifyCtrl', function ($scope, mainService, $state) {

  $scope.aeCard = ['opacityCard'];
  $scope.viCard = ['opacityCard'];
  $scope.mcCard = ['opacityCard'];
  $scope.diCard = ['opacityCard'];

  $scope.creditCardInfo = true;

  $scope.address = mainService.serviceAddress;

  $scope.creditCard = function () {};

  $scope.checkCreditCard = function (number) {
    $scope.aeCard = ['opacityCard'];
    $scope.viCard = ['opacityCard'];
    $scope.mcCard = ['opacityCard'];
    $scope.diCard = ['opacityCard'];

    console.log(number);
    if (parseInt(number[0]) === 3) {
      console.log('Visa');
      $scope.aeCard.pop('opacityCard');
    } else if (parseInt(number[0]) === 4) {
      console.log('Visa');
      $scope.viCard.pop('opacityCard');
    } else if (parseInt(number[0]) === 5) {
      console.log('Mastercard');
      $scope.mcCard.pop('opacityCard');
    } else if (parseInt(number[0]) === 6) {
      console.log('Discover');
      $scope.diCard.pop('opacityCard');
    }
  };
});
//# sourceMappingURL=bundle.js.map
