document.addEventListener("DOMContentLoaded", () => {
    const workspace = document.getElementById("workspace"),
          backgroundInput = document.getElementById("backgroundInput"),
          textSizeRange = document.getElementById("textSizeRange"),
          textInput = document.getElementById("textInput"),
          addTextBtn = document.getElementById("addTextBtn"),
          textList = document.getElementById("textList"),
          colorPicker = document.getElementById("colorPicker");

    let currentTextElement = null;

    // Function to update the list of texts
    function updateTextList(element, textValue) {
        const listItem = document.createElement("li");
        listItem.textContent = textValue;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
            workspace.removeChild(element);
            textList.removeChild(listItem);
            if (currentTextElement === element) {
                currentTextElement = null;
                textSizeRange.classList.add("hidden");
                colorPicker.classList.add("hidden");
            }
        };

        listItem.appendChild(deleteButton);
        textList.appendChild(listItem);
    }

    // Function to add text to the workspace
    addTextBtn.addEventListener("click", function() {
        const textValue = textInput.value.trim();
        if (!textValue) return;

        const textElement = document.createElement("div");
        textElement.textContent = textValue;
        textElement.classList.add("text-element");
        setupTextElement(textElement);
        updateTextList(textElement, textValue);
        textInput.value = "";
    });

    // Function to setup text element properties
    function setupTextElement(element) {
        element.style.position = "absolute";
        element.style.left = "50%";
        element.style.top = "50%";
        element.style.transform = "translate(-50%, -50%)";
        element.style.color = "#" + colorPicker.value;
        element.contentEditable = true;
        element.style.minWidth = "20px";
        element.style.outline = "none";
        workspace.appendChild(element);

        // Enable drag-and-drop
        element.draggable = true;
        element.addEventListener("dragstart", dragStart);
        element.addEventListener("click", selectTextElement);
    }

    // Drag and Drop functionality
    function dragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
        currentTextElement = e.target;
    }

    workspace.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    workspace.addEventListener("drop", (e) => {
        e.preventDefault();
        const left = e.clientX - workspace.offsetLeft;
        const top = e.clientY - workspace.offsetTop;
        currentTextElement.style.left = `${left}px`;
        currentTextElement.style.top = `${top}px`;
        currentTextElement.style.transform = "translate(-50%, -50%)";
    });

    // Function to select and highlight a text element
    function selectTextElement(event) {
        if (currentTextElement) {
            currentTextElement.style.border = "none";
        }
        currentTextElement = event.target;
        currentTextElement.style.border = "2px solid red";
        textSizeRange.value = parseInt(window.getComputedStyle(currentTextElement).fontSize);
        textSizeRange.classList.remove("hidden");
        colorPicker.classList.remove("hidden");
    }

    // Background Image Upload
    backgroundInput.addEventListener("change", function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                workspace.style.backgroundImage = `url(${e.target.result})`;
            };
            reader.onerror = function() {
                alert("Failed to load the image.");
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Text Size and Color Adjustment
    textSizeRange.addEventListener("input", function() {
        if (currentTextElement) {
            currentTextElement.style.fontSize = `${this.value}px`;
        }
    });

    colorPicker.addEventListener("change", function() {
        if (currentTextElement) {
            currentTextElement.style.color = "#" + this.value;
        }
    });
});