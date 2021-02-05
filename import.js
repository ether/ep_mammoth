'use strict';

const mammoth = require('mammoth');
const fs = require('fs');
const settings = require('ep_etherpad-lite/node/utils/Settings');

exports.import = (hookName, args, callback) => {
  const srcFile = args.srcFile;
  const destFile = args.destFile;

  if (!settings.ep_mammoth) {
    settings.ep_mammoth = {};
  }
  if (settings.ep_mammoth.ignoreEmptyParagraphs !== false) {
    settings.ep_mammoth.ignoreEmptyParagraphs = true;
  }

  const options = {
    styleMap: [
      "p[style-name='center'] => p:fresh > center",
      "p[style-name='right'] => p:fresh > right",
      "p[style-name='left'] => p:fresh > left",
      "p[style-name='justify'] => p:fresh > justify",

      "p[style-name='Heading 1'] => p:fresh > h1:fresh",
      "p[style-name='Heading 2'] => p:fresh > h2:fresh",
      "p[style-name='Heading 3'] => p:fresh > h3:fresh",
      "p[style-name='Heading 4'] => p:fresh > h4:fresh",
      "p[style-name='Heading 5'] => p:fresh > h5:fresh",
      "p[style-name='Heading 6'] => p:fresh > h6:fresh",
    ],
    transformDocument: transformElement,
    ignoreEmptyParagraphs: settings.ep_mammoth.ignoreEmptyParagraphs,
  };

  // First things first do we handle this doc type?
  const docType = srcFile.split('.').pop();

  if (docType !== 'docx') return callback(); // we don't support this doctype in this plugin
  console.log('Using mammoth to convert DocX file');

  mammoth.convertToHtml(
      {
        path: srcFile,
      }, options).then(
      (result) => {
        fs.writeFile(destFile, `<!doctype html>\n<html lang='en'>
            <body>
            ${result.value}
            </body>
            </html>
          `, 'utf8', (err) => {
          if (err) callback(err, null);
          callback(destFile);
        });
      })
      .fail((e) => {
        console.warn('Mammoth failed to import this file');
        return callback();
      })
      .done(() => {
        // done
      });
};

const transformElement = (element) => {
  if (element.children) {
    element.children.forEach(transformElement);
  }
  if (element.type === 'paragraph') {
    if (element.alignment === 'center' && !element.styleId) {
      element.styleName = 'center';
    }
    if (element.alignment === 'left' && !element.styleId) {
      element.styleName = 'left';
    }
    if (element.alignment === 'right' && !element.styleId) {
      element.styleName = 'right';
    }
    if (element.alignment === 'justify' && !element.styleId) {
      element.styleName = 'justify';
    }
  }
  return element;
};
