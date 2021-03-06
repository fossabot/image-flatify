/**
 * image-flatify
 * https://github.com/paazmaya/image-flatify
 *
 * Take a directory, search images recursively and rename as single flat directory with date based filenames
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const fs = require('fs'),
  execSync = require('child_process').execSync;

const fecha = require('fecha');

/**
 * Get the best guess for the date when the video was taken
 *
 * @param {string} filepath  Media file path
 *
 * @returns {string|bool} Date formatted as a string or false when no match
 */
const getDateStringMediainfo = function getDateStringMediainfo (filepath) {
  const cmdMediainfo = `mediainfo -f "${filepath}" | grep date`;

  let possible = false;

  try {
    const mediaDate = execSync(cmdMediainfo, {
      timeout: 2000,
      encoding: 'utf8'
    });

    const lines = mediaDate.split('\n');

    if (lines.length > 0) {
      const MATCH_REPLACE = /^[\s:]+/gu;
      possible = lines[0].replace(/[a-zA-Z]+/gu, '').trim().replace(MATCH_REPLACE, '');
    }
  }
  catch (error) {
    console.log('Using Mediainfo failed');
  }

  return possible;
};

/**
 * Get the best guess for the date when the picture was taken
 *
 * @param {string} filepath  Media file path
 *
 * @returns {string} Date formatted as a string
 * @see http://www.graphicsmagick.org/GraphicsMagick.html#details-format
 */
const getDateStringGraphicsMagick = function getDateStringGraphicsMagick (filepath) {
  const cmdIdentify = `gm identify -format %[EXIF:DateTime] "${filepath}"`;

  let exifDate = '';

  try {
    // gm identify: No decode delegate for this image format (00000.MTS).
    // gm identify: Request did not return an image.
    exifDate = execSync(cmdIdentify, {
      timeout: 2000,
      encoding: 'utf8'
    });
  }
  catch (error) {
    console.log('Using GraphicsMagick failed');
  }

  return exifDate.trim();
};

/**
 * Get the best guess for the date when the picture was taken
 *
 * @param {string} filepath  Media file path
 *
 * @returns {string|bool} Date formatted as a string or false when failed
 */
const getDateString = function getDateString (filepath) {

  try {
    fs.accessSync(filepath);
  }
  catch (error) {
    console.error(`File ${filepath} did not exists`);

    return false;
  }

  let exifDate = getDateStringGraphicsMagick(filepath);

  const MATCH_REPLACE = /(:|\s)/gu;
  const MATCH_INITIAL_NUMBER = /^\d+/u;

  if (typeof exifDate === 'string' && exifDate.match(MATCH_INITIAL_NUMBER)) {
    exifDate = exifDate.trim().replace(MATCH_REPLACE, '-');
  }
  else {
    exifDate = getDateStringMediainfo(filepath);

    if (typeof exifDate === 'string' && exifDate.match(MATCH_INITIAL_NUMBER)) {
      exifDate = exifDate.trim().replace(MATCH_REPLACE, '-');
    }
    else {
      // https://nodejs.org/api/fs.html#fs_stat_time_values
      const stat = fs.statSync(filepath);
      const formatString = 'YYYY-MM-DD-HH-mm-ss';

      exifDate = fecha.format(stat.birthtime, formatString);

      // In case birthtime is zero, then should not be trusted and used mtime instead
      // const dateM = fecha.format(stat.mtime, formatString);
      // const dateC = fecha.format(stat.ctime, formatString);
    }
  }

  return exifDate;
};

module.exports = getDateString;

// Exposed for testing
module.exports._getDateStringMediainfo = getDateStringMediainfo;
module.exports._getDateStringGraphicsMagick = getDateStringGraphicsMagick;
