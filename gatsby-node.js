const geojson = require('togeojson')
const DOMParser = require('xmldom').DOMParser;
const crypto = require('crypto')

const parseDocument = content => new DOMParser().parseFromString(content);

const parseKML = markup => geojson.kml(parseDocument(markup))

exports.onCreateNode = async ({ node, boundActionCreators, loadNodeContent, createNodeId }) => {

  // we only care about KML content
  if (node.internal.mediaType === "application/vnd.google-earth.kml+xml") {

    const content = await loadNodeContent(node)

    //parse KML data
    const data = parseKML(content)

    if (data.type && data.type === "FeatureCollection") {
      if (data.features) {
        const { createNode } = boundActionCreators
        data.features.forEach(feature => {
          if (feature.type && feature.type === 'Feature' && feature.properties && feature.properties.name) {
            const nodeId = createNodeId(`feature-${feature.properties.name}`)
            const nodeContent = JSON.stringify(feature)
            const nodeContentDigest = crypto
              .createHash('md5')
              .update(nodeContent)
              .digest('hex')

            const nodeData = Object.assign({}, feature, {
              id: nodeId,
              parent: null,
              children: [],
              internal: {
                type: `KML${feature.geometry.type}`,
                content: nodeContent,
                contentDigest: nodeContentDigest,
              },
            })

            createNode(nodeData, createNodeId)
          }
        })
      }
    }
  }

}
