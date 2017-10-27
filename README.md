# data-stoar
data-stoar is a page parser that will look for script tags on the current page with specific data attributes and pass them back as a formatted object.

```bash
npm install data-stoar
```

## How to use data-stoar
Data is passed to the data-stoar via script tags in the rendered HTML. I recommend using the script tag type of "applicaiton/json" that way your browser will never exicute the script tag.

```HTML
<script type="application/json"
        data-component="myNewComponent"
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
    data-component-instance="1"
    data-my-special-info="Component info specific to this instance"
    data-title-info="The Data Stoar is fantastic">
    <h1>My cool component</h1>
</div>

```
There are three data attributes that data-stoar looks for on the script tag
1) `data-component` This is the name associated with the component when the array of found components is returned
2) `data-component-config` This tells data-stoar that this particlar json is a config for all components found on the page of this component type. So this json object will be passed to each component, in the example above, with the type `myNewComponent`.
3) `data-component-instance` This attribute will tell data-stoar that you want this json data to go to a spicific instance of a component on the page. In the case above `1`.

In your javascript now you can create a new instance of the data-stoar by doing the following:

```javascript
import DataStoar from 'data-stoar'

let pageComponents = new DataStoar();

/*
pageComponents [
  {
      "name": "myNewComponent",
      "instances": [
          {
              "id": "1",
              "data": [],
              "config": {
                  "myTestData"  : "Data passed to my component",
                  "myTestData2" : {
                      foo : "BAR",
                      baz : "zing"
                  }
               }
          }
      ]
  },
]
*/
```
