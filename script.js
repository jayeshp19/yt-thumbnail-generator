let selectedTextContainer = null;

document.getElementById('workspace').addEventListener('click', function(event) {
    if (event.target === this) {
        const text = prompt('Enter text:');
        if (text) addText(text);
    }
});

function addText(text) {
    const textColorInput = document.getElementById('textColorInput').value;
    const textSizeInput = document.getElementById('textSizeInput').value;

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    textContainer.style.position = 'absolute';
    textContainer.style.left = '50px'; // Default position, adjust as needed
    textContainer.style.top = '50px';
    textContainer.style.cursor = 'move';
    textContainer.style.color = textColorInput;
    textContainer.style.fontSize = textSizeInput + 'px';

    const textNode = document.createElement('div');
    textNode.classList.add('text');
    textNode.contentEditable = true;
    textNode.innerText = text;
    textContainer.appendChild(textNode);

    document.getElementById('workspace').appendChild(textContainer);

    makeDraggable(textContainer, document.getElementById('workspace'));

    textContainer.onclick = function() {
        selectedTextContainer = this;
        document.getElementById('textResizeControls').style.display = 'block';
        document.getElementById('textSizeRange').value = parseInt(this.style.fontSize);
    };
}

// Image Handling
function addImage() {
    var imageInput = document.getElementById('imageInput');
    if (imageInput.files && imageInput.files[0]) {
        var imageNode = document.createElement('img');
        imageNode.src = URL.createObjectURL(imageInput.files[0]);
        imageNode.onload = function() {
            URL.revokeObjectURL(this.src);
        };
        imageNode.style.width = '100%';
        imageNode.style.height = 'auto';
        document.getElementById('workspace').appendChild(imageNode);
    }
}


function makeDraggable(element, boundary) {
    let initialX, initialY, mousePressX, mousePressY;

    element.addEventListener('mousedown', function(event) {
        event.preventDefault();
        mousePressX = event.clientX;
        mousePressY = event.clientY;
        initialX = element.offsetLeft;
        initialY = element.offsetTop;

        function onMouseMove(event) {
            const dx = event.clientX - mousePressX;
            const dy = event.clientY - mousePressY;
            const newX = initialX + dx;
            const newY = initialY + dy;

            // Restrict movement within the boundary
            const rect = boundary.getBoundingClientRect();
            if (newX >= 0 && newX + element.offsetWidth <= rect.width) {
                element.style.left = newX + 'px';
            }
            if (newY >= 0 && newY + element.offsetHeight <= rect.height) {
                element.style.top = newY + 'px';
            }
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    element.ondragstart = () => false;
}

document.getElementById('textSizeRange').addEventListener('input', function() {
    if (selectedTextContainer) {
        selectedTextContainer.style.fontSize = this.value + 'px';
    }
});

function deleteText() {
    if (selectedTextContainer) {
        selectedTextContainer.remove();
        selectedTextContainer = null;
        document.getElementById('textResizeControls').style.display = 'none';
    }
}

// Generating the Thumbnail
function generateThumbnail() {
    var workspace = document.getElementById('workspace');
    var generateBtn = document.getElementById('generateBtn');
    generateBtn.innerText = 'Generating...';
    html2canvas(workspace).then(function(canvas) {
        var img = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.href = img;
        link.download = 'thumbnail.png';
        link.click();
        generateBtn.innerText = 'Generate Thumbnail';
    });
}