'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
    function Stoar() {
        _classCallCheck(this, Stoar);

        this.AllData = [];

        var data = this.getAllData();
        var componentList = this._list(data, 'componentName');
        var components = [];
        var self = this;

        componentList.map(function (component) {
            components.push({
                name: component,
                instances: self.getInstances(component)
            });
        });

        return {
            components: components
        };
    }

    /*
     * Filter an array by a passed key and value
     */

    _createClass(Stoar, [{
        key: '_filter',
        value: function _filter(arr, key, value) {
            return arr.filter(function (i) {
                return i[key] === value;
            });
        }

        /*
         * Returns a list matching the value passed of the
         */
    }, {
        key: '_list',
        value: function _list(arr, value) {

            var list = [];
            arr.map(function (inst) {

                var key = inst[value] || 0;
                if (list.indexOf(key) < 0) {
                    list.push(key);
                }
            });

            return list;
        }
    }, {
        key: '_cleanup',
        value: function _cleanup(data) {
            return data.filter(function (item) {
                delete item.componentConfig;
                delete item.componentInstance;
                delete item.componentName;
                return item;
            });
        }

        /*
         * Returns array of instances of the passed component name
         */
    }, {
        key: 'getInstances',
        value: function getInstances(component) {

            var allInstanceData = this._filter(this.AllData, 'componentName', component);
            var instances = this._list(allInstanceData, 'componentInstance');
            var self = this;

            return instances.map(function (inst) {

                var data = self._filter(allInstanceData, 'componentInstance', inst);
                var config = self._filter(data, 'componentConfig', true);
                data = self._cleanup(self._filter(data, 'componentConfig', false));

                var obj = {
                    id: inst,
                    data: data
                };

                // Add the config if it exists
                if (config.length) {
                    obj.config = self._cleanup(config)[0];
                }

                return obj;
            });
        }

        /*
         * Scrapes the DOM for all script tags with the `data-component` attribute
         */
    }, {
        key: 'getAllData',
        value: function getAllData() {

            // Grab the component script elements
            var componentScripts = document.querySelectorAll('[data-component]');

            // Parse the scripts from components and add their data to the Store
            for (var i = 0; i < componentScripts.length; i++) {

                // Localize variables
                var script = componentScripts[i],
                    name = script.dataset.component,
                    config = script.dataset.componentConfig !== undefined,
                    componentInstance = script.dataset.componentInstance,
                    data = JSON.parse(script.innerHTML);

                // Add to the data JSON object
                data.componentName = name;
                data.componentInstance = componentInstance;
                data.componentConfig = config;

                // Add the data to the store, and initialize the app
                this.AllData.push(data);
            }

            return this.AllData;
        }
    }]);

    return Stoar;
})();
