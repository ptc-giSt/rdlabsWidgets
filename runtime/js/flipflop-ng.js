if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'flipflop-ng';
}

(function () {
  'use strict';

  var flipflopModule = angular.module('flipflop-ng', []);
  flipflopModule.directive('ngFlipflop', ['$timeout', ngFlipflop]);

  function ngFlipflop($timeout) {

    return {
      restrict: 'EA',
      scope: {
        toggleField  : '@',
        delegateField: '='
      },
      template: '<div></div>',
      link: function (scope, element, attr) {

        var lastUpdated = 'unknown';
        scope.data = {    q: true, 
                       qbar: false, 
                     toggle: true
                     };
        
        var _setq = function(v) {
          scope.data.q = v;
          scope.data.qbar = !scope.data.q;

          scope.$parent.view.wdg[scope.$parent.widgetId]['q']    = scope.data.q;
          scope.$parent.view.wdg[scope.$parent.widgetId]['qbar'] = scope.data.qbar;
        }

        var clkq = function(){
          // toggle, and then propogate clock
          $timeout(function () {
            if (scope.data.toggle) 
            {
              _setq(!scope.data.q);
            }

            scope.$parent.fireEvent('qclocked');
          }, 1);

        };

        var setq = function() {
          // set and then propogate clock  
          $timeout(function () {
            _setq(true); 
            scope.$parent.fireEvent('qclocked');
          }, 1);
              
        }

        var resetq = function() {
          // reset, and then propogate clock  
          $timeout(function () {
            _setq(false);
            scope.$parent.fireEvent('qclocked');
          }, 1);
                
        }

        scope.$watch('toggleField', function () {
          scope.data.toggle = (scope.toggleField != undefined && scope.toggleField === 'true') ? true :false ;
        });

        scope.$watch('delegateField', function (delegate) {
          if (delegate) {
            delegate.clkq   = function () { clkq();   };
            delegate.setq   = function () { setq();   };
            delegate.resetq = function () { resetq(); };
          }
        });

      }
    };
  }

}());
