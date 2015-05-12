var path = require('path');
var fs   = require('fs');
//模块文件的根路径
var source_path      = '/app/src/js/';
var bower_components = '/bower_components';
var template = path.join(__dirname,source_path + 'template');
var service  = path.join(__dirname,source_path + 'service');
var common   = path.join(__dirname,source_path + 'common');
var lib      = path.join(__dirname,source_path + 'lib');
var bower    = path.join(__dirname,bower_components);
//需要输出的文件路径
var entry_path  = './app/src/js/pages';
var entry_obj = {};
fs.readdirSync(entry_path).forEach(function(value,index){
    entry_obj[(value).replace('.js','')] = entry_path + '/' + value
});
console.log(lib);
module.exports = {
    //这里是整个输出页面的调试
    //注意这里设定文件路径的时候,要加./
    //简直我擦啊
    entry:entry_obj,
    output:{
       filename:'app/src/js/build/[name].build.js'
    },
    resolve:{
       modulesDirectories:[service,template,common,lib,bower]
    }
};