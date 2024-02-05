document.addEventListener("DOMContentLoaded", () => {
    const workspace = document.getElementById("workspace"),
          backgroundInput = document.getElementById("backgroundInput"),
          textSizeRange = document.getElementById("textSizeRange"),
          textInput = document.getElementById("textInput"),
          addTextBtn = document.getElementById("addTextBtn"),
          colorPicker = document.getElementById("colorPicker"),
          controller = document.getElementById("controller"),
          stick = document.getElementById("stick");

    let currentTextElement = null;
    let joystickCenter = { x: 0, y: 0 };

    window.addEventListener("resize", setupJoystick);

    function setupJoystick() {
        if (!controller.classList.contains("hidden")) {
            const rect = controller.getBoundingClientRect();
            joystickCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            stick.style.transform = "translate(-50%, -50%)";
        }
    }

    function moveTextElement(dx, dy) {
        if (!currentTextElement) return;
    
        const sensitivity = 0.05; // Adjust sensitivity as needed
        dx *= sensitivity;
        dy *= sensitivity;
    
        const workspaceRect = workspace.getBoundingClientRect();
        const textRect = currentTextElement.getBoundingClientRect();
    
        // Convert current left and top from % to pixels for calculation
        let currentLeft = parseFloat(currentTextElement.style.left || '50%') * workspaceRect.width / 100;
        let currentTop = parseFloat(currentTextElement.style.top || '50%') * workspaceRect.height / 100;
    
        // Calculate the new position in pixels
        let newLeft = currentLeft + dx;
        let newTop = currentTop + dy;
    
        // Convert the new position back to % to maintain responsiveness
        newLeft = (newLeft / workspaceRect.width) * 100;
        newTop = (newTop / workspaceRect.height) * 100;
    
        // Ensure the new position keeps the text element within the workspace boundaries
        // Adjust these calculations if your text element's anchor point isn't in the top-left corner
        newLeft = Math.max(0, Math.min(100, newLeft));
        newTop = Math.max(0, Math.min(100, newTop));
    
        currentTextElement.style.left = `${newLeft}%`;
        currentTextElement.style.top = `${newTop}%`;
    }

    function activateJoystick(e) {
        e.preventDefault();
        document.addEventListener("mousemove", handleJoystickMove);
        document.addEventListener("touchmove", handleJoystickMove, { passive: false });
        document.addEventListener("mouseup", stopJoystickMove);
        document.addEventListener("touchend", stopJoystickMove);
    }

    function handleJoystickMove(e) {
        e.preventDefault();
        const point = e.touches ? e.touches[0] : e;
        let dx = point.clientX - joystickCenter.x;
        let dy = point.clientY - joystickCenter.y;

        const maxDistance = 50;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > maxDistance) {
            const angle = Math.atan2(dy, dx);
            dx = Math.cos(angle) * maxDistance;
            dy = Math.sin(angle) * maxDistance;
        }

        stick.style.transform = `translate(${dx}px, ${dy}px)`;
        moveTextElement(dx, dy);
    }

    function stopJoystickMove() {
        document.removeEventListener("mousemove", handleJoystickMove);
        document.removeEventListener("mouseup", stopJoystickMove);
        document.removeEventListener("touchmove", handleJoystickMove);
        document.removeEventListener("touchend", stopJoystickMove);
        stick.style.transform = "translate(-50%, -50%)";
    }

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

    addTextBtn.addEventListener("click", function() {
        const textValue = textInput.value.trim();
        if (!textValue) return;

        const textElement = document.createElement("div");
        textElement.textContent = textValue;
        textElement.classList.add("text-element");
        setupTextElement(textElement);
        textInput.value = "";
    });

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

        element.addEventListener("click", function() {
            if (currentTextElement) {
                currentTextElement.style.border = "none";
            }
            currentTextElement = element;
            element.style.border = "2px solid red";
            textSizeRange.value = parseInt(window.getComputedStyle(currentTextElement).fontSize);
            textSizeRange.classList.remove("hidden");
            colorPicker.classList.remove("hidden");
            controller.classList.remove("hidden");
            setupJoystick(); // Ensure joystick is correctly positioned when a text element is selected
        });
    }

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

    controller.addEventListener("mousedown", activateJoystick);
    controller.addEventListener("touchstart", activateJoystick, { passive: false });
});
