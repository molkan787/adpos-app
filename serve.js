const { spawnLiveOutput, path, sleep, cp, rimraf } = require('./helpers');
const watch = require('node-watch');
const nodePath = require('path');
const debounce = require('debounce');

let electronLaunched = false;
async function run(){
    const flags = getFlags();
    if(!flags['skip-vue']){
        await startVueServe();
    }
    await sleep(500);
    await launchElectron();
    console.log('DONE!');
    process.exit(0);
}

function startVueServe(){
    const otherArgs = []; //['--mode', 'production'];
    return new Promise(resolve => {
        console.log('Compiling Vue App...');
        spawnLiveOutput({
            cwd: path('adpos'),
            cmd: 'cmd',
            args: ['/c', path('adpos', 'node_modules', '.bin', 'vue-cli-service.cmd'), 'serve', ...otherArgs],
            printTitle: 'VUE SERVE',
        }, data => {
            if(!electronLaunched && data.includes('App running at')){
                electronLaunched = true;
                resolve();
            }
        });
    })
}

function launchElectron(){
    console.log('Launching Electron...');
    const spawnElectron = () => spawnLiveOutput({
        cwd: path('electron'),
        cmd: 'cmd',
        args: ['/c', path('electron', 'node_modules', '.bin', 'electron'), '.'],
        printTitle: 'ELECTRON',
    });
    // const _spanElectron = debounce(() => spawnElectron, 1000);
    let electron = spawnElectron();
    return new Promise(() => 0);
}

function getFlags(){
    const flags = {};
    for(let arg of process.argv){
        if(arg.startsWith('--')){
            flags[arg.substr(2)] = true;
        }
    }
    return flags;
}

run();