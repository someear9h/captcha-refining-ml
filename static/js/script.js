let lastMousePosition = { x: 0, y: 0 };
let mouseMovements = 0;
let typingStartTime = 0;
let typingEndTime = 0;

// Track mouse movement
document.addEventListener("mousemove", (e) => {
    const mouseMoveThreshold = 20;
    if (Math.abs(e.clientX - lastMousePosition.x) > mouseMoveThreshold || 
        Math.abs(e.clientY - lastMousePosition.y) > mouseMoveThreshold) {
        mouseMovements++;
        lastMousePosition = { x: e.clientX, y: e.clientY };
    }
});

// Enable submit button when user types
document.getElementById("user_input").addEventListener("input", () => {
    document.getElementById("submit_button").disabled = false;
});

// Start timer when user focuses on input
document.getElementById("user_input").addEventListener("focus", () => {
    typingStartTime = Date.now();
});

// Stop timer when user clicks submit
document.getElementById("submit_button").addEventListener("click", function() {
    const userInput = document.getElementById("user_input").value.trim();
    if (userInput === "") {
        alert("Please type something before submitting.");
        return;
    }

    typingEndTime = Date.now();
    const timeTaken = typingEndTime - typingStartTime;
    const typingSpeed = userInput.length / (timeTaken / 1000); // chars per second
    const delay = 0.1 * Math.random();

    // Update UI
    document.getElementById("typing_speed").innerText = `Typing Speed: ${typingSpeed.toFixed(2)} chars/sec`;
    document.getElementById("time_taken").innerText = `Time Taken: ${timeTaken} ms`;
    document.getElementById("mouse_movement").innerText = `Mouse Movements: ${mouseMovements}`;
    document.getElementById("delay").innerText = `Delay: ${delay.toFixed(2)}`;

    // Send data to backend
    sendDataToFlaskServer(timeTaken, typingSpeed, mouseMovements, delay);
});

function sendDataToFlaskServer(timeTaken, typingSpeed, mouseMovements, delay) {
    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            time_taken: timeTaken,
            typing_speed: typingSpeed,
            mouse_movement: mouseMovements,
            delay: delay
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("status").innerText = 
            `Status: ${data.prediction === "bot" ? "Access Denied! (Bot Detected)" : "Access Granted!"}`;
    })
    .catch(error => console.error("Error:", error));
}
