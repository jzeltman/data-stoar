module.exports = class Stoar {

    constructor(){

        this.AllData           = [];

        var data               = this.getAllData();
        var componentList      = this._list( data, 'componentName' );
        var components         = [];
        var self               = this;

        componentList.map( function( component ){
            components.push({
                name : component,
                instances : self.getInstances( component )
            });
        });

        return {
            components
        };
    }

    /*
     * Filter an array by a passed key and value
     */
    _filter( arr, key, value ){
        return arr.filter( function( i ){
            return i[ key ] === value;
        });
    }

    /*
     * Returns a list matching the value passed of the
     */
    _list( arr, value ){

        var list = [];
        arr.map( function( inst ){

            var key = inst[ value ] || 0;
            if ( list.indexOf( key ) < 0 ){
                list.push( key );
            }
        });

        return list;
    }

    _cleanup( data ){
        return data.filter( function( item ){
            if( item.component ) delete item.component
            delete item.componentConfig;
            delete item.componentInstance;
            delete item.componentName
            return item;
        });
    }

    /*
     * Returns array of instances of the passed component name
     */
    getInstances( component ){

        var allInstanceData = this._filter( this.AllData, 'componentName', component );
        var instances       = this._list( allInstanceData, 'componentInstance' );
        var self            = this;

        return instances.map( function( inst ){

            var data   = self._filter( allInstanceData, 'componentInstance', inst );
            var config = self._filter( data, 'componentConfig', true );
                data   = self._filter( data, 'componentConfig', false )
                data   = self._cleanup( data );

            var obj = {
                id   : inst,
                data
            };

            // Add the config if it exists
            if ( config.length ){ obj.config = self._cleanup( config )[0]; }

            return obj;
        });
    }

    /*
     * Scrapes the DOM for all script tags with the `data-component` attribute
     */
    getAllData(){

        // Grab the component script elements
        var componentScripts = document.querySelectorAll('[data-component]');

        // Parse the scripts from components and add their data to the Store
        for ( var i = 0; i < componentScripts.length; i++ ){

            // Localize variables
            var script = componentScripts[i],
                isJSON = ( ( script.nodeName === 'SCRIPT' ) && ( script.type === 'application/json' ) ),
                name   = script.dataset.component,
                config = script.dataset.componentConfig !== undefined,
                componentInstance = script.dataset.componentInstance,
                data   = isJSON ? JSON.parse( script.innerHTML ) : this._cleanup( [ {...script.dataset} ] );

                // Add to the data JSON object
                data.componentName = name;
                data.componentInstance = componentInstance;
                data.componentConfig = config;

            // Add the data to the store, and initialize the app
            this.AllData.push( { ...data } );

        }

        return this.AllData;

    }

};
