const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

module.exports = function bundle (Components, out, config) {
  if (!Components.length) {
    return
  }
  const entry = path.join(out, 'entry.js')
  const absoluteOut = path.resolve(out)
  let init = `
    import React from "react";\n
    import ReactDOM from "react-dom";\n
    window.Components = {};\n

    import Wrapper from '${path.relative(absoluteOut, path.join(__dirname, 'wrapper.jsx'))}';\n
    window.React = React;\n
    window.ReactDOM = ReactDOM;\n
    window.Wrapper = Wrapper;\n
  `
  if (config.betterDocs.component) {
    if(config.betterDocs.component.wrapper) {
      const absolute = path.resolve(config.betterDocs.component.wrapper)
      init +=`
      import _CustomWrapper from '${path.relative(absoluteOut, absolute)}';\n
      Components._CustomWrapper = _CustomWrapper;\n
      `
    }
    if(config.betterDocs.component.entry
      && config.betterDocs.component.entry.length) {
      init = `${config.betterDocs.component.entry.join('\n')}\n${init}`
    }
  }
  const entryFile = init + Components.map(c => {
    const { displayName, filePath} = c.component
    const relativePath = path.relative(absoluteOut, filePath)
    return [
      `import ${displayName} from '${relativePath}';`,
      `Components.${displayName} = ${displayName};`,
    ].join('\n')
  }).join('\n\n')

  console.log('Generating entry file for "components" plugin')
  fs.writeFileSync(entry, entryFile);
  console.log('Bundling components')
  const outDist = path.join(out, 'build')
  const cmd = `parcel build ${entry} --out-dir ${outDist}`
  console.log(`running: ${cmd}`)
  try {
    execSync(cmd)
  } catch (error) {
    if(error.output && error.output.length){
     console.log(error.output[1].toString())
    }
    throw error
  }
}