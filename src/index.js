module.exports = class Stoar {

    constructor(){

        this.AllData            = [];

        this._filter            = this._filter.bind(this);
        this._list              = this._list.bind(this);
        this._cleanupArray      = this._cleanupArray.bind(this);
        this._cleanup           = this._cleanup.bind(this);
        this._mergeToObject     = this._mergeToObject.bind(this);
        this.getInstances       = this.getInstances.bind(this);
        this.getAllData         = this.getAllData.bind(this);
        this.getComponentConfig = this.getComponentConfig.bind(this);

        var data                = this.getAllData();
        var componentList       = this._list( data, 'componentName' );
        var components          = [];
        var self                = this;

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

        // console.log('[ list ]', list)

        return list;
    }

    _cleanupArray( data ){
        return data.filter( ( item ) => {
            this._cleanup(item)
            return item;
        });
    }

    _cleanup( item ){
        if( item.component ) delete item.component
        delete item.componentConfig;
        delete item.componentInstance;
        delete item.componentName
        return item;
    }

    _mergeToObject( data ) {
        let newObj = {}

        data.forEach( ( item, key ) => {
            newObj = {
                ...newObj,
                ...item
            }
        } )

        return newObj
    }

    getComponentConfig( component ){

        var allInstanceData = this._filter( this.AllData, 'componentName', component );
        var instances       = this._list( allInstanceData, 'componentInstance' );
        var self            = this;
        var config          = {};
        var configsFound    = 0;

        instances.forEach( ( instance, index ) => {

            var data   = self._filter( allInstanceData, 'componentInstance', instance );
            var foundConfig = self._filter( data, 'componentConfig', true );

            if( foundConfig.length ) {
                config = foundConfig;
                configsFound ++;
            }

        } )

        if( configsFound > 1 ) console.warn( "There should only be one config per component but found " + configsFound + " for " + component + ". Sense there are two or more configs data stoar will pass the last found config to be stoared.")

        return config;
    }

    /*
     * Returns array of instances of the passed component name
     */
    getInstances( component ){

        var allInstanceData = this._filter( this.AllData, 'componentName', component );
        var instances       = this._list( allInstanceData, 'componentInstance' );
        var self            = this;

        var config          = this.getComponentConfig( component );

        return instances.map( function( inst ){

            var data   = self._filter( allInstanceData, 'componentInstance', inst );


            var config2 = self._filter( data, 'componentConfig', true );
                data   = self._filter( data, 'componentConfig', false )
                data   = self._cleanupArray( data );

            var obj = {
                id   : inst,
                data : self._mergeToObject( data )
            };

            // Add the config if it exists
            if ( config.length ){
                obj.config = self._cleanupArray( config )[0];
            }


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
                data   = isJSON ? JSON.parse( script.innerHTML ) : this._cleanup(  { ...script.dataset } );



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
