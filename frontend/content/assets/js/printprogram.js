(function(jz) {

    function render(program) {
        console.log(program);
    }

    jz.printprogram = function() {
        jz.data.program().then(render);
    }

})(window.jz = window.jz || {});