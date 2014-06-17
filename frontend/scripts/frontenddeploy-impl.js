#!/usr/bin/env node
/* global process, require, console, _: true */

var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    readline = require('readline'),
    shell = require('shelljs'),
    semver = require('semver'),
    utils = {}, deploy = {}, config = {}, git = {};

deploy.environments = {

  jzweb: {
    prod: { server: 'javabin@2014.javazone.no', dir: '/home/javabin/web/jz-frontend' },
    test: { server: 'javabin@test.2014.javazone.no', dir: '/home/javabin/web/jz-frontend' },
    dev: { server: 'javabin@192.168.111.222', dir: '/home/javabin/web/jz-frontend' }
  }

};

/* --------------------------------- */

utils.timestamp = function() {
  if(!utils.timestamp.current) {
    utils.timestamp.current = (new Date()).getTime();
  }
  return utils.timestamp.current;
};

utils.directoryExists = function(f) {
  return fs.existsSync(f) && fs.lstatSync(f).isDirectory();
};

utils.fileExists = function(f) {
  return fs.existsSync(f) && !fs.lstatSync(f).isDirectory();
};

utils.log = function(type) {
  if(!type) return console.log();
  var len = Math.max(0, 10 - type.length);
  var pad = new Array(len + 1).join(' ');
  var title = pad + type.toLowerCase();
  var message = _.rest(arguments).join(' ');
  console.log('  \033[36m%s\033[m : \033[90m%s\033[m', title, message);
};

utils.fatal = function() {
  utils.log.apply(this, arguments);
  utils.log();
  process.exit(1);
};

utils.read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

utils.any = function(haystack) {
    return !!_.find(_.rest(arguments), function(arg) {
        return haystack.indexOf(arg) > -1;
    });
};

/* --------------------------------- */

git.fetch = function() {
    return shell.exec('git fetch', { silent: true }).output;
};

git.status = function() {
    return shell.exec('git status', { silent: true }).output;
};

git.onmaster = function() {
    return utils.any(git.status(), 'On branch master');
};

git.pristine = function() {
    git.fetch();
    var gitstatus = git.status();
    var clean = utils.any(gitstatus, 'working directory clean');
    var synced = !utils.any(gitstatus, 'Your branch is ahead', 'Your branch is behind', 'have diverged');
    return clean && synced;
};

git.tag = function(tagname) {
    shell.exec('git tag ' + tagname, { silent: true });
    shell.exec('git push --tags origin master', { silent: true });
    utils.log('git', 'tagged commit with tag', tagname);
};

git.verify = function() {
    if(!git.onmaster())
        utils.fatal('git', 'You are not on the master branch.');
    if(!git.pristine())
        utils.fatal('git', 'The GIT repo is not clean and synced.');
};

/* --------------------------------- */

deploy.build = function() {
  shell.rm('-rf', 'public');
  var res = deploy.cmd('pacbot -b');
  if(res.code !== 0) process.exit(1);
};


deploy.verify = function() {
  if(!utils.directoryExists('public')) utils.fatal('error', 'missing public dir');
};

deploy.cmd = function() {
  return shell.exec(_.toArray(arguments).join(' '));
};

deploy.ssh = function(server) {
  var cmd = "'" + _.rest(arguments).join(' ') + "'";
  return deploy.cmd('ssh', server, cmd);
};

deploy.server = function(server) {
  if(server.indexOf('@') === -1) {
    var user = 'javabin';
    return user + '@' + server;
  } else {
    return server;
  }
};

deploy.test = function() {
  if(utils.fileExists('scripts/test')) {
    var res = shell.exec('./scripts/test');
    if(res.code !== 0) process.exit(1);
  }
};

deploy.verifySSH = function() {
  var project   = deploy.environments[config.project];
  var server    = deploy.server(project[config.target].server);
  utils.log('ssh', 'verifying connection to server (to check that you have access to the box)');
  deploy.ssh(server, 'cd', '/');
};

deploy.sync = function() {
  var project   = deploy.environments[config.project];
  var server    = deploy.server(project[config.target].server);
  var directory = project[config.target].dir;
  var root      = directory;
  if(!server || !directory) return;

  var res;
  var folder = '' + utils.timestamp();
  var remote = server + ':' + path.join(root, folder);
  var remove = 'for i in `find . -maxdepth 1 -type d -mmin +1440 \\( -name "[0-9]*" \\) \\( ! -name . \\) \\( ! -name .. \\) -print`; do rm -rf $i; done';
  utils.log('to', remote);

  utils.log('ssh', 'creating deployment folder if it does not exist');
  res = deploy.ssh(server, 'mkdir', '-p', root);
  if(res.code !== 0) utils.fatal('ssh', 'could not create', root);

  utils.log('ssh', 'checking if current folder exists');
  res = deploy.ssh(server, 'cd', root, '&&', 'test', '-L', 'current');
  if(res.code !== 0) {
    utils.log('ssh', 'current folder does not exist - continue...')
  } else {
    utils.log('ssh', 'copying current folder');
    res = deploy.ssh(server, 'cd', root, '&&', 'cp', '-pr', 'current/', folder);
    if(res.code !== 0) utils.fatal('ssh', 'failed');
  }

  utils.log('rsync', 'uploading changes');
  res = deploy.cmd('rsync', '-a', '--delete', '--no-p', '--no-g', 'public/', '--chmod=Dg+s,ug+rwx,Fug+rw,+X,o+r', '--perms', remote);
  if(res.code !== 0) utils.fatal('rsync', 'failed');

  utils.log('ssh', 'swapping symlink');
  res = deploy.ssh(server, 'cd', root, '&&', 'ln -sfn', folder, 'current');
  if(res.code !== 0) utils.fatal('ssh', 'symlink failed');

  utils.log('ssh', 'deleting old folders');
  deploy.ssh(server, 'cd', root, '&&', remove);
};

deploy.perform = function() {
  utils.log('target', config.target);
  deploy.build();
  deploy.verify();
  deploy.sync();
  utils.log();
  config.end = (new Date()).getTime();
  utils.log('time', Math.round((config.end - config.start) / 1000), 'seconds');
};

/* --------------------------------- */

utils.log();
config.start   = utils.timestamp();
config.target  = process.argv.length === 3 ? process.argv[2] : process.argv[3];
config.project = process.argv.length === 4 ? process.argv[2] : utils.fatal('error', 'Ugyldig antall parametre! Bruk [dev|test|prod] som parameter...' , process.argv.slice(3)); 
config.pacbot  = shell.exec('pacbot -V', { silent: true }).output.replace(/\n/, '');

// Check pacbot version
if(!shell.which('pacbot') || !semver.satisfies(config.pacbot, '>= 0.20.0')) {
  utils.fatal('error', 'No pacbot installed, or to old version...');
}

// Check environment name
if(!deploy.environments[config.project][config.target]) {
  utils.fatal('error', 'unknown env', config.target);
}

// Chech ssh connection
deploy.verifySSH();

// Deploy
if(config.target === 'prod') {
  git.verify();
  deploy.test();
  utils.log();
  utils.read.question('Skriv "produksjon" for å bekrefte deploy til prod: ', function(answer) {
    if(answer !== 'produksjon') process.exit(0);
    utils.log();
    deploy.perform();
    git.tag(utils.timestamp());
    utils.read.close();
  });
} else {
  deploy.perform();
  utils.read.close();
}
