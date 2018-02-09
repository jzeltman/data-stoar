# data-stoar
data-stoar is a page parser that will look for script tags on the current page with specific data attributes and pass them back as a formatted object.

#### NPM
```bash
npm install data-stoar
```
#### Yarn
```bash
yarn add data-stoar
```

## How to use data-stoar
Data is passed to the data-stoar via data-attributes or json script tags in the rendered HTML. If you use the script tag I recommend using the type of "applicaiton/json" that way your browser will not execute the script tag.

```HTML
<script type="application/json"
        data-component="myNewComponent"
        data-component-config
        data-component-instance="1">
        {
            "myTestData"  : "Data passed to my component",
            "myTestData2" : {
                foo : "BAR",
                baz : "zing"
            }
        }
</script>

<div
    data-component="myNewComponent"
    data-component-instance="2"
    data-my-special-info="Component info specific to this instance"
    data-title-info="The Data Stoar is fantastic">
    <h1>My cool component</h1>
</div>

```
There are three data attributes that data-stoar looks for on a html tag
1) `data-component` This is the name associated with the component when the array of found components is returned
2) `data-component-config` This tells data-stoar that this particular json is a config for all components found on the page of this component type. So this json object will be passed to each component, in the example above, with the type `myNewComponent`.
3) `data-component-instance` This attribute will tell data-stoar that you want this json data to go to a specific instance of a component on the page. In the case above `1`.
4) If you have chosen to use data attributes to pass data to the data-stoar then all the other data attributes on the tag will be passed in the data or config objects returned in the data from data-stoar.

In your javascript now you can create a new instance of the data-stoar by doing the following:

```javascript
import DataStoar from 'data-stoar'

let pageComponents = new DataStoar();

/* Result from the HTML above
pageComponents [
    {
        "name": "myNewComponent",
        "instances": [
            {
                "id": "1",
                "data": {},
                "config": {
                    "myTestData"  : "Data passed to my component",
                    "myTestData2" : {
                        foo : "BAR",
                        baz : "zing"
                    }
                }
            },
            {
                "id": "2",
                "config": {
                    "myTestData"  : "Data passed to my component",
                    "myTestData2" : {
                        foo : "BAR",
                        baz : "zing"
                    }
                },
                "data": {
                    "mySpecialInfo" : "Component info specific to this instance",
                    "titleInfo" : "The Data Stoar is fantastic",
                    "element"   : <DOM ELEMENT/>
                }
            }
            }
        ]
    },
]
*/
```


## Change Log
### v2.2.0 - 02.9.2018
* Any extra data attributes on the script tags will now be passed in either the config or the data objects just as they are for html tags.

### v2.1.0 - 01.31.2018
* In the return object I now pass back the dom element that the data-component attribute was tied to when that element is not a script tag. This allows you to have a handle on the DOM element so you can bind to the targeted element.

### v2.0.0 - 01.30.2018 - Breaking Changes
* The data attribute in the instance object is no longer an array. *This is the breaking Change*
* The instance object now returns the config with every instance
* You can now use data attributes to pass data to the data-stoar not just use the json script tag
* Added some more documentation
