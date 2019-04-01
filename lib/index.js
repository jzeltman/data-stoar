'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function Stoar() {
        _classCallCheck(this, Stoar);

        this.AllData = [];

        this._filter = this._filter.bind(this);
        this._list = this._list.bind(this);
        this._cleanupArray = this._cleanupArray.bind(this);
        this._cleanup = this._cleanup.bind(this);
        this._mergeToObject = this._mergeToObject.bind(this);
        this.getInstances = this.getInstances.bind(this);
        this.getAllData = this.getAllData.bind(this);
        this.getComponentConfig = this.getComponentConfig.bind(this);

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

            // console.log('[ list ]', list)

            return list;
        }
    }, {
        key: '_cleanupArray',
        value: function _cleanupArray(data) {
            var _this = this;

            return data.filter(function (item) {
                _this._cleanup(item);
                return item;
            });
        }
    }, {
        key: '_cleanup',
        value: function _cleanup(item) {
            if (item.component) delete item.component;
            delete item.componentConfig;
            delete item.componentInstance;
            delete item.componentName;
            return item;
        }
    }, {
        key: '_mergeToObject',
        value: function _mergeToObject(data) {
            var newObj = {};

            if (data.element) delete data.element;

            data.forEach(function (item, key) {
                newObj = _extends({}, newObj, item);
            });

            return newObj;
        }
    }, {
        key: 'getComponentConfig',
        value: function getComponentConfig(component) {

            var allInstanceData = this._filter(this.AllData, 'componentName', component);
            var instances = this._list(allInstanceData, 'componentInstance');
            var self = this;
            var config = {};
            var configsFound = 0;

            instances.forEach(function (instance, index) {

                var data = self._filter(allInstanceData, 'componentInstance', instance);
                var foundConfig = self._filter(data, 'componentConfig', true);

                if (foundConfig.length) {
                    config = foundConfig;
                    configsFound++;
                }
            });

            if (configsFound > 1) console.warn("There should only be one config per component but found " + configsFound + " for " + component + ". Sense there are two or more configs data stoar will pass the last found config to be stoared.");

            return config;
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

            var config = this.getComponentConfig(component);

            return instances.map(function (inst) {

                var data = self._filter(allInstanceData, 'componentInstance', inst);
                data = self._cleanupArray(data);

                var obj = {
                    id: inst,
                    data: self._mergeToObject(data)
                };

                // Add the config if it exists
                if (config.length) {
                    obj.config = self._cleanupArray(config)[0];
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
            var componentElement = document.querySelectorAll('[data-component]');

            // Parse the scripts from components and add their data to the Store
            for (var i = 0; i < componentElement.length; i++) {

                // Localize variables
                var element = componentElement[i];
                var isJSON = element.nodeName === 'SCRIPT';
                var name = element.dataset.component;
                var config = element.dataset.componentConfig !== undefined;
                var componentInstance = element.dataset.componentInstance;
                var data = {};

                if (isJSON) {
                    data = _extends({}, this._cleanup(_extends({}, element.dataset)), JSON.parse(element.innerHTML));
                } else {
                    data = this._cleanup(_extends({}, element.dataset));
                }

                // Add to the data JSON object
                data.componentName = name;
                data.componentInstance = componentInstance;
                data.componentConfig = config;
                if (!isJSON) data.element = element;

                // Add the data to the store, and initialize the app
                this.AllData.push(_extends({}, data));
            }

            return this.AllData;
        }
    }]);

    return Stoar;
}();