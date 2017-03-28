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

const tape = require('tape');

const getTargetPath = require('../../lib/get-target-path');

tape('getTargetPath - Uses prefix', (test) => {
  test.plan(1);

  const destDir = '';
  const filepath = 'tests/fixtures/IMG_0640.JPG';
  const options = {
    prefix: 'hoplaa-'
  };
  const output = getTargetPath(destDir, filepath, options);

  test.equal(output, 'hoplaa-2016-06-05-20-40-00.JPG');
});

tape('getTargetPath - Uses prefix and lowercases', (test) => {
  test.plan(1);

  const destDir = '';
  const filepath = 'tests/fixtures/IMG_0640.JPG';
  const options = {
    prefix: 'hoplaa-',
    lowercaseSuffix: true
  };
  const output = getTargetPath(destDir, filepath, options);

  test.equal(output, 'hoplaa-2016-06-05-20-40-00.jpg');
});

tape('getTargetPath - Uses prefix, hash and lowercases', (test) => {
  test.plan(1);

  const destDir = '';
  const filepath = 'tests/fixtures/IMG_0640.JPG';
  const options = {
    prefix: 'hoplaa-',
    appendHash: true,
    lowercaseSuffix: true
  };
  const output = getTargetPath(destDir, filepath, options);

  test.equal(output, 'hoplaa-2016-06-05-20-40-00_1e7712e1b543b324baa6bd6b101b4dc3.jpg');
});

tape('getTargetPath - Keep suffix as is', (test) => {
  test.plan(1);

  const destDir = '';
  const filepath = 'tests/fixtures/IMG_0640.JPG';
  const options = {
    lowercaseSuffix: false
  };
  const output = getTargetPath(destDir, filepath, options);

  test.equal(output, '2016-06-05-20-40-00.JPG', 'Target filename has uppercase suffix');
});

tape('getTargetPath - Add hash before suffix', (test) => {
  test.plan(1);

  const destDir = '';
  const filepath = 'tests/fixtures/IMG_0640.JPG';
  const options = {
    appendHash: true
  };
  const output = getTargetPath(destDir, filepath, options);

  test.equal(output, '2016-06-05-20-40-00_706e885f464419f27ebe952861e43d25.JPG', 'Target filename contains hash');
});

tape('getTargetPath - Add hash before suffix while lowercased suffix', (test) => {
  test.plan(1);

  const destDir = '';
  const filepath = 'tests/fixtures/IMG_0640.JPG';
  const options = {
    lowercaseSuffix: true,
    appendHash: true
  };
  const output = getTargetPath(destDir, filepath, options);

  test.equal(output, '2016-06-05-20-40-00_706e885f464419f27ebe952861e43d25.jpg', 'Target filename contains hash and lowercase suffix');
});

tape('getTargetPath - Source not existing', (test) => {
  test.plan(1);

  const destDir = '';
  const filepath = 'tests/fixtures/not-here.png';
  const options = {
    lowercaseSuffix: true
  };
  const output = getTargetPath(destDir, filepath, options);

  test.notOk(output);
});