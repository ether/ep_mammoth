'use strict';

const log4js = require('ep_etherpad-lite/node_modules/log4js');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const settings = require('ep_etherpad-lite/node/utils/Settings');

const logger = log4js.getLogger('ep_mammoth');

exports.import = async (hookName, {srcFile, destFile, fileEnding, padId}) => {
  if (fileEnding !== '.docx') return;
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

  logger.info(`Using mammoth to convert DocX file ${srcFile} for pad ${padId || '<unknown>'}`);
  const {value} = await mammoth.convertToHtml({path: srcFile}, options);
  const html = `<!doctype html>\n<html lang='en'><body>${value}</body></html>`;
  await fs.writeFile(destFile, html, 'utf8');
  return destFile;
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
