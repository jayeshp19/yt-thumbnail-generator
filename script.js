document.addEventListener('DOMContentLoaded', () => {
    const workspace = document.getElementById('workspace');
    const backgroundInput = document.getElementById('backgroundInput');
    const textSizeRange = document.getElementById('textSizeRange');
    const deleteTextBtn = document.getElementById('deleteTextBtn');
    let selectedTextElement = null;

    // Change workspace background
    backgroundInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = e => workspace.style.backgroundImage = `url(${e.target.result})`;
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Add text to workspace
    workspace.addEventListener('click', () => {
        const text = prompt('Enter text:');
        if (text) {
            const textElement = document.createElement('div');
            textElement.textContent = text;
            textElement.style.position = 'absolute';
            textElement.style.left = '50%';
            textElement.style.top = '50%';
            textElement.style.transform = 'translate(-50%, -50%)';
            textElement.contentEditable = true;
            textElement.style.minWidth = '20px';
            textElement.style.outline = 'none';
            workspace.appendChild(textElement);

            textElement.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedTextElement = textElement;
                textSizeRange.style.display = 'block';
                deleteTextBtn.style.display = 'inline-block';
                // Highlight selected text element if needed
            });
        }
    });

    // Resize selected text
    textSizeRange.addEventListener('input', () => {
        if (selectedTextElement) {
            selectedTextElement.style.fontSize = `${textSizeRange.value}px`;
        }
    });

    // Delete selected text
    deleteTextBtn.addEventListener('click', () => {
        if (selectedTextElement) {
            workspace.removeChild(selectedTextElement);
            textSizeRange.style.display = 'none';
            deleteTextBtn.style.display = 'none';
            selectedTextElement = null;
        }
    });
});