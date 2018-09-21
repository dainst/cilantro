/*Just a basis can be removed if not used*/
angular
    .module('module.resizer', [])
    .factory("resizer", function() {

        let sidebar = document.getElementById('main-sidebar');
        let tasks = document.getElementById('resizeButton');
        let container = document.getElementById('main-container')
        let posX = -1;
        let offset = 0;

//tasks.addEventListener('mousedown', initResize, false);

//Window funtion mousemove & mouseup
        resizer.initResize = function(e) {
            tasks.addEventListener('mousemove', Resize, false);
            tasks.addEventListener('mouseup', stopResize, false);
            posX = e.clientX;
        }
//resize the element
        resizer.Resize = function(e) {
            offset = (e.clientX - posX);
            sidebar.style.width = "calc(20% - 40px - " + offset + "px)";
            container.style.width = "calc(80% -" + offset + "px)";
        }

//on mouseup remove windows functions mousemove & mouseup
        resizer.stopResize = function(e) {
            posX = -1;
            offset = 0;
            tasks.removeEventListener('mousemove', Resize, false);
            tasks.removeEventListener('mouseup', stopResize, false);
        }

        return (resizer);
    });