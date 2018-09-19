/*Just a basis can be removed if not used*/
let sidebar = document.getElementById('main-sidebar');
let tasks = document.getElementById('sidebar-tasks');
let container = document.getElementById('main-container');

//create box in bottom-left
let resizer = document.createElement('div');
resizer.style.width = '10px';
resizer.style.height = '10px';
resizer.style.background = 'red';
resizer.style.position = 'absolute';
resizer.style.right = 0;
resizer.style.bottom = 0;
resizer.style.cursor = 'se-resize';
//Append Child to Element
sidebar.appendChild(resizer);
//box function onmousemove
resizer.addEventListener('mousedown', initResize, false);

//Window funtion mousemove & mouseup
function initResize(e) {
    window.addEventListener('mousemove', Resize, false);
    window.addEventListener('mouseup', stopResize, false);
}
//resize the element
function Resize(e) {
    sidebar.style.width = (e.clientX - sidebar.offsetLeft) + 'px';
    sidebar.style.height = (e.clientY - sidebar.offsetTop) + 'px';
}
//on mouseup remove windows functions mousemove & mouseup
function stopResize(e) {
    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
}

