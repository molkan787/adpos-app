const copy = require('recursive-copy');
const rm = require('rimraf');
const { exec, path, replaceInTextFile } = require('./helpers');

async function run(){
    console.log('Building Vue App...')
    await exec('cd adpos && yarn build')

    console.log('Copying build files to electron app')
    rm.sync(path('electron', 'app'))
    await copy(path('adpos', 'dist'), path('electron', 'app'))

    console.log('Preparing index.html ...')
    await replaceInTextFile(path('electron', 'app', 'index.html'), new RegExp('="/', 'g'), '="./');

    console.log('Building Electron app...')
    await exec('cd electron && yarn build')

    console.log('Build done!');
}

run();