document.addEventListener('DOMContentLoaded', () => {

      const workspace = document.getElementById('workspace');
      const backgroundInput = document.getElementById('backgroundInput');
      const textSizeRange = document.getElementById('textSizeRange');
      const deleteTextBtn = document.getElementById('deleteTextBtn');
      let selectedTextElement = null;
    
      backgroundInput.addEventListener('change', handleBackgroundChange);
      workspace.addEventListener('click', handleWorkspaceClick);
      textSizeRange.addEventListener('input', handleTextSizeChange);
      deleteTextBtn.addEventListener('click', handleDeleteText);
    
      function handleBackgroundChange() {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          reader.onload = e => workspace.style.backgroundImage = `url(${e.target.result})`;
          reader.readAsDataURL(this.files[0]);
        }
      }
    
      function handleWorkspaceClick() {
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
          textElement.addEventListener('click', handleTextElementClick);
        }
      }
    
      function handleTextElementClick(e) {
        e.stopPropagation();
        selectedTextElement = e.target;
        textSizeRange.classList.remove('hidden');
        deleteTextBtn.classList.remove('hidden');
      }
    
      function handleTextSizeChange() {
        if (selectedTextElement) {
          selectedTextElement.style.fontSize = `${textSizeRange.value}px`;
        }
      }
    
      function handleDeleteText() {
        if (selectedTextElement) {
          workspace.removeChild(selectedTextElement);
          textSizeRange.classList.add('hidden');
          deleteTextBtn.classList.add('hidden');
          selectedTextElement = null;
        }
      }
    });
    