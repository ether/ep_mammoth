'use strict';

const mammoth = require('mammoth');

let docxPath = '/home/jose/Desktop/centre.docx';
if (process.argv[2]) docxPath = process.argv[2];
console.log('Testing', docxPath);

require('mammoth/lib/docx/docx-reader').read({path: docxPath}).then((raw) => {
  console.log('Input data');
  const data = raw.value.children;
  // console.log(data);
  for (const i of data) {
    console.log('Line number', i);
    const blob = data[i];
    console.log(blob);
    const children = blob.children;
    const boo = children[0];
    console.log(boo);
    console.log('==========================\n\n');
  }
});

const options = {
  styleMap: [
    "p[style-name='center'] => center",
    "p[style-name='Heading 1'] => p:fresh > h1:fresh",
    "p[style-name='Heading 2'] => p:fresh > h2:fresh",
    "p[style-name='Heading 3'] => p:fresh > h3:fresh",
    "p[style-name='Heading 4'] => p:fresh > h4:fresh",
    "p[style-name='Heading 5'] => p:fresh > h5:fresh",
    "p[style-name='Heading 6'] => p:fresh > h6:fresh",
  ],
  transformDocument: transformElement,
};

mammoth.convertToHtml({path: docxPath}, options)
    .then((result) => {
      console.log(result);
    })
    .fail((e) => {
      console.log('ERROR!');
    })
    .done((result) => {
      console.log(result);
    });

const transformElement = (element) => {
  if (element.children) {
    element.children.forEach(transformElement);
  }
  if (element.type === 'paragraph') {
    if (element.alignment === 'center' && !element.styleId) {
      element.styleName = 'center';
    }
  }
  return element;
};
