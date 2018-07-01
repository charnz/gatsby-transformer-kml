# gatsby-transformer-kml
Parses [KML](https://developers.google.com/kml/) files into [GeoJSON](http://geojson.org/) objects. GeoJSON `Feature` objects are converted into individual nodes

## Install

`npm install gatsby-transformer-kml --save`

## How to use

Ensure you have `gatsby-source-filesystem` installed

`npm install gatsby-source-filesystem` 

Configure your `gatsby-config.js` to point to the directory where your `.kml` files can be found

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    `gatsby-transformer-kml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/kml/`,
      },
    },
  ],
};

```

## How to query

GeoJSON nodes will be of types `KmlPoint`, `KmlLineString`, `KmlPolygon`, `KmlMultiPoint`, `KmlMultiLineString`, and `KmlMultiPolygon`. 

You can query the resulting GeoJSON nodes like the following

```graphql
{
  allKmlPoint {
    edges {
      node {
        properties {
          name
        }
      }
    }
  }
}
```

## Notes

Only files with valid MIME type of `application/vnd.google-earth.kml+xml` are supported. Other media types will be ignored by the plugin. `kmz` is not supported

Currently only data that can be parsed to GeoJSON format is supported. Other KML features such as overlays are not yet implemented.


