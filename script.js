// ===== GLOBAL =====
let currentUser = null;
let currentChat = [];
let chats = [];

// ===== LOAD HISTORY (SEARCH TEXT ONLY) =====
let history = JSON.parse(localStorage.getItem("history")) || [];
const historyList = document.getElementById("historyList");

// function renderHistory() {
//     historyList.innerHTML = "";

//     history.forEach(item => {
//         let div = document.createElement("div");
//         div.className = "history-item";
//         div.textContent = item;

//         div.onclick = () => {
//             document.getElementById("query").value = item;

//             // hide greeting
//             let welcomeText = document.getElementById("welcomeText");
//             if (welcomeText) welcomeText.style.display = "none";
//         };

//         historyList.appendChild(div);
//     });
// }
function renderHistory() {
    if (!currentUser) {
        document.getElementById("historyList").innerHTML = "";
        return;
    }
}

// ===== SEARCH AI =====
// async function searchAI() {
//     let query = document.getElementById("query").value;
//     let welcomeText = document.getElementById("welcomeText");

//     if (query === "") return;

//     if (welcomeText) welcomeText.style.display = "none";

//     addMessage(query, "user");
//     document.getElementById("query").value = "";

//     addMessage("⏳ Thinking...", "ai");

//     try {
//         let response = await fetch("http://127.0.0.1:5000/ask", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ query: query })
//         });

//         let data = await response.json();
//         updateLastAIMessage(data.response);

//     } catch (error) {
//         updateLastAIMessage("Error connecting to AI!");
//     }
// }

// async function searchAI() {
//     let query = document.getElementById("query").value;
//     let welcomeText = document.getElementById("welcomeText");

//     if (query === "") return;
//     if (welcomeText) welcomeText.style.display = "none";

//     addMessage(query, "user");
//     document.getElementById("query").value = "";
//     addMessage("⏳ Thinking...", "ai");

//     try {
//         let response = await fetch("http://127.0.0.1:5000/ask", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ query: query })
//         });

//         let data = await response.json();
//         // updateLastAIMessage(data.response);
//         updateLastAIMessage(data.reply);

//         if (currentUser) {
//             renderChatHistory();
//         }

//     } catch (error) {
//         updateLastAIMessage("Error connecting to AI!");
//     }
// }

async function searchAI() {
    let query = document.getElementById("query").value;
    let welcomeText = document.getElementById("welcomeText");

    if (query === "") return;
    if (welcomeText) welcomeText.style.display = "none";

    addMessage(query, "user");
    document.getElementById("query").value = "";

    addMessage("⏳ Thinking...", "ai");

    try {
        const res = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: query }) // ✅ FIXED
        });

        const data = await res.json();

        if (data.reply) {
            updateLastAIMessage(data.reply);
        } else {
            updateLastAIMessage("⚠️ No response from AI");
            console.log(data); // debug
        }

    } catch (error) {
        updateLastAIMessage("❌ Error connecting to server");
        console.error(error);
    }
}


// ===== LOGIN / SIGNUP =====
function openLogin() {
    document.getElementById("loginModal").style.display = "block";
}
function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}
function openSignup() {
    document.getElementById("signupModal").style.display = "block";
}
function closeSignup() {
    document.getElementById("signupModal").style.display = "none";
}

// ===== SIGNUP =====
// document.getElementById("signupForm").addEventListener("submit", function (e) {
//     e.preventDefault();

//     let firstName = document.getElementById("firstName").value.trim();
//     let lastName = document.getElementById("lastName").value.trim();
//     let email = document.getElementById("signupEmail").value.trim();
//     let password = document.getElementById("signupPassword").value;
//     let confirmPassword = document.getElementById("confirmPassword").value;

//     if (!firstName || !lastName || !email || !password || !confirmPassword) {
//         alert("All fields are required!");
//         return;
//     }

//     if (password.length < 6) {
//         alert("Password must be at least 6 characters!");
//         return;
//     }

//     if (password !== confirmPassword) {
//         alert("Passwords do not match!");
//         return;
//     }

//     let users = JSON.parse(localStorage.getItem("users")) || [];

//     let exists = users.find(user => user.email === email);
//     if (exists) {
//         alert("Account already exists!");
//         return;
//     }

//     users.push({ firstName, lastName, email, password });
//     localStorage.setItem("users", JSON.stringify(users));

//     alert("Account created successfully 🎉");
//     closeSignup();
// });


// ===== LOGIN =====
// document.getElementById("loginForm").addEventListener("submit", function (e) {
//     e.preventDefault();

//     let email = document.getElementById("loginEmail").value;// ===== SIGNUP =====
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showPopup("All fields are required!");
        return;
    }

    if (password.length < 6) {
        showPopup("Password must be at least 6 characters!");
        return;
    }

    if (password !== confirmPassword) {
        showPopup("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let exists = users.find(user => user.email === email);
    if (exists) {
        showPopup("Account already exists!");
        return;
    }

    users.push({ firstName, lastName, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    showPopup("Account created successfully 🎉");
    closeSignup();
});

// ===== LOGIN =====
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        showPopup("Welcome " + validUser.firstName + " 🎉");

        currentUser = validUser;
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));

        loadUserChats();
        showProfile(validUser);
        closeLogin();

    } else {
        showPopup("Invalid Credentials!");
    }
});


//     let password = document.getElementById("loginPassword").value;

//     let users = JSON.parse(localStorage.getItem("users")) || [];

//     let validUser = users.find(user => user.email === email && user.password === password);

//     if (validUser) {
//         alert("Welcome " + validUser.firstName + " 🎉");

//         currentUser = validUser;
//         localStorage.setItem("loggedInUser", JSON.stringify(validUser));

//         loadUserChats();
//         showProfile(validUser);
//         closeLogin();

//     } else {
//         // alert("Invalid Credentials!");
//         showPopup("Invalid Credentials!");
//     }
// });



// ===== USER CHAT LOAD =====
function loadUserChats() {
    if (!currentUser) return;

    let key = "chats_" + currentUser.email;
    chats = JSON.parse(localStorage.getItem(key)) || [];

    renderChatHistory();
}

// ===== CHAT FUNCTIONS =====
function addMessage(text, type) {
    let chatBox = document.getElementById("chatBox");

    let div = document.createElement("div");
    div.className = "message " + type;
    div.textContent = text;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    currentChat.push({ text, type });
}

function updateLastAIMessage(text) {
    let chatBox = document.getElementById("chatBox");
    let messages = chatBox.getElementsByClassName("ai");

    if (messages.length > 0) {
        messages[messages.length - 1].textContent = text;
    }

    currentChat[currentChat.length - 1].text = text;
}

// ===== NEW CHAT =====
// function newChat() {

//     // ⚠️ USER NOT LOGGED IN
//     if (!currentUser) {
//         let confirmLogin = confirm("⚠️ Your chats won’t be saved.\n\nDo you want to login to save chats?");

//         if (confirmLogin) {
//             openLogin(); // open login modal
//         }
//     }

//     // SAVE CHAT ONLY IF LOGGED IN
//     if (currentChat.length > 0 && currentUser) {

//         chats.unshift(currentChat);

//         let key = "chats_" + currentUser.email;
//         localStorage.setItem(key, JSON.stringify(chats));

//         renderChatHistory();
//     }

//     // RESET CHAT
//     currentChat = [];
//     document.getElementById("chatBox").innerHTML = "";

//     let welcomeText = document.getElementById("welcomeText");

//     if (welcomeText) {
//         welcomeText.style.display = "block";
//         setRandomGreeting(); // greeting show karega
//     }
// }

function newChat() {

    if (!currentUser) {
        showConfirm("⚠️ Your chats won’t be saved.\n\nDo you want to login to save chats?", function () {
            openLogin();
        });
    }

    if (currentChat.length > 0 && currentUser) {

        chats.unshift(currentChat);

        let key = "chats_" + currentUser.email;
        localStorage.setItem(key, JSON.stringify(chats));

        renderChatHistory();
    }

    currentChat = [];
    document.getElementById("chatBox").innerHTML = "";

    let welcomeText = document.getElementById("welcomeText");

    if (welcomeText) {
        welcomeText.style.display = "block";
        setRandomGreeting();
    }
}


// ===== RENDER CHAT =====
function renderChatHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    chats.forEach((chat, index) => {

        let div = document.createElement("div");
        div.className = "history-item";
        div.style.display = "flex";
        div.style.justifyContent = "space-between";

        let text = document.createElement("span");
        text.textContent = chat[0]?.text || "New Chat";
        text.style.cursor = "pointer";

        text.onclick = () => loadChat(index);

        let delBtn = document.createElement("span");
        delBtn.textContent = "🗑";
        delBtn.style.display = "none";
        delBtn.style.cursor = "pointer";

        delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteSingleChat(index);
        };

        div.onmouseenter = () => delBtn.style.display = "block";
        div.onmouseleave = () => delBtn.style.display = "none";

        div.appendChild(text);
        div.appendChild(delBtn);
        historyList.appendChild(div);
    });
}

// ===== LOAD CHAT =====
function loadChat(index) {
    currentChat = chats[index];
    let chatBox = document.getElementById("chatBox");

    document.getElementById("welcomeText").style.display = "none";

    chatBox.innerHTML = "";

    currentChat.forEach(msg => {
        let div = document.createElement("div");
        div.className = "message " + msg.type;
        div.textContent = msg.text;
        chatBox.appendChild(div);
    });
}

// ===== DELETE =====
// function deleteSingleChat(index) {
//     if (!confirm("Delete this chat?")) return;

//     chats.splice(index, 1);

//     let key = "chats_" + currentUser.email;
//     localStorage.setItem(key, JSON.stringify(chats));

//     renderChatHistory();
//     document.getElementById("chatBox").innerHTML = "";
// }
function deleteSingleChat(index) {
    showConfirm("Delete this chat?", function () {

        chats.splice(index, 1);

        let key = "chats_" + currentUser.email;
        localStorage.setItem(key, JSON.stringify(chats));

        renderChatHistory();
        document.getElementById("chatBox").innerHTML = "";
    });
}


// function deleteHistory() {
//     if (!confirm("Delete all chats?")) return;

//     chats = [];
//     currentChat = [];

//     let key = "chats_" + currentUser.email;
//     localStorage.removeItem(key);

//     document.getElementById("chatBox").innerHTML = "";
//     document.getElementById("historyList").innerHTML = "";

//     let welcomeText = document.getElementById("welcomeText");
//     if (welcomeText) {
//         welcomeText.style.display = "block";
//         setRandomGreeting(); // 🔥
//     }
// }
function deleteHistory() {
    showConfirm("Delete all chats?", function () {

        chats = [];
        currentChat = [];

        let key = "chats_" + currentUser.email;
        localStorage.removeItem(key);

        document.getElementById("chatBox").innerHTML = "";
        document.getElementById("historyList").innerHTML = "";

        let welcomeText = document.getElementById("welcomeText");
        if (welcomeText) {
            welcomeText.style.display = "block";
            setRandomGreeting();
        }

        showPopup("All chats deleted 🗑️");
    });
}

// ===== PROFILE =====
function toggleProfile() {
    let d = document.getElementById("profileDropdown");
    d.style.display = d.style.display === "block" ? "none" : "block";
}

function showProfile(user) {
    document.getElementById("authButtons").style.display = "none";
    document.getElementById("profileSection").style.display = "block";

    document.getElementById("profileName").textContent = user.firstName;
    document.getElementById("userName").textContent = user.firstName + " " + user.lastName;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userPassword").textContent = user.password;
}

// ===== LOGOUT =====
// function logout() {
//     localStorage.removeItem("loggedInUser");

//     currentUser = null;
//     chats = [];
//     currentChat = [];

//     document.getElementById("authButtons").style.display = "block";
//     document.getElementById("profileSection").style.display = "none";

//     document.getElementById("chatBox").innerHTML = "";
//     document.getElementById("historyList").innerHTML = "";

//     let welcomeText = document.getElementById("welcomeText");
//     if (welcomeText) welcomeText.style.display = "block";

//     alert("Logged out!");
// }

// ===== LOGOUT =====
// OLD logout() function ko replace karo sirf isse

// function logout() {
//     showConfirm("Are you sure you want to logout?"), function () {
//     // let confirmLogout = confirm("Are you sure you want to logout?");
    

//     // ✅ Agar cancel dabaya toh kuch bhi mat karo
//     if (!confirmLogout) {
//         return;
//     }

//     // ✅ Agar OK dabaya toh logout hoga
//     localStorage.removeItem("loggedInUser");

//     currentUser = null;
//     chats = [];
//     currentChat = [];

//     document.getElementById("authButtons").style.display = "block";
//     document.getElementById("profileSection").style.display = "none";

//     document.getElementById("chatBox").innerHTML = "";
//     document.getElementById("historyList").innerHTML = "";

//     let welcomeText = document.getElementById("welcomeText");
//     if (welcomeText) {
//         welcomeText.style.display = "block";
//         setRandomGreeting();
//     }

//     // alert("Logged out!");
//     showPopup("Logged out!");
// }

// ===== AUTO LOGIN =====
// window.onload = function () {
//     let user = JSON.parse(localStorage.getItem("loggedInUser"));

//     if (user) {
//         currentUser = user;
//         showProfile(user);
//         loadUserChats();
//     }

//     renderHistory();

//     let welcomeText = document.getElementById("welcomeText");

//     if (welcomeText && currentChat.length === 0) {
//         welcomeText.style.display = "block";
//         setRandomGreeting();
//     }
// };
function logout() {
    showConfirm("Are you sure you want to logout?", function () {

        localStorage.removeItem("loggedInUser");

        currentUser = null;
        chats = [];
        currentChat = [];

        document.getElementById("authButtons").style.display = "block";
        document.getElementById("profileSection").style.display = "none";

        document.getElementById("chatBox").innerHTML = "";
        document.getElementById("historyList").innerHTML = "";

        let welcomeText = document.getElementById("welcomeText");
        if (welcomeText) {
            welcomeText.style.display = "block";
            setRandomGreeting();
        }

        showPopup("Logged out!");
    });
}

window.onload = function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user) {
        currentUser = user;
        showProfile(user);
        loadUserChats();
    } else {
        document.getElementById("historyList").innerHTML = "";
    }

    let welcomeText = document.getElementById("welcomeText");

    if (welcomeText && currentChat.length === 0) {
        welcomeText.style.display = "block";
        setRandomGreeting();
    }
};

const greetings = [
    "Hello, how can I help you? 👋",
    "What do you want to explore today? 🔍",
    "Ask me anything! 🤖",
    "Ready to research something new? 🚀",
    "Welcome back! What’s on your mind? 💡",
    "Let’s discover something amazing today 🌟",
    "Need help? I'm here for you 😊"
];

function typeText(element, text, speed = 40) {
    element.textContent = "";
    let i = 0;

    let interval = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
    }, speed);
}

function setRandomGreeting() {
    let welcomeText = document.getElementById("welcomeText");
    let randomIndex = Math.floor(Math.random() * greetings.length);

    typeText(welcomeText, greetings[randomIndex]);
}
// ===== ENTER PRESS = SEARCH =====
// A   
// document.getElementById("query").addEventListener("keypress", function (e) 
document.getElementById("query").addEventListener("keypress", function (e) 
{
    if (e.key === "Enter") {
        e.preventDefault();
        searchAI();
    }
});

// toggle side bar

function toggleSidebar() {
    let sidebar = document.querySelector(".sidebar");
    let btn = document.getElementById("toggleSidebarBtn");

    sidebar.classList.toggle("closed");

    if (sidebar.classList.contains("closed")) {
        btn.title = "Open sidebar";
    } else {
        btn.title = "Close sidebar";
    }
}

// ===== CUSTOM POPUP =====
function showPopup(message) {
    let oldPopup = document.getElementById("customPopup");
    if (oldPopup) oldPopup.remove();

    let popup = document.createElement("div");
    popup.id = "customPopup";

    popup.innerHTML = `
        <div class="popup-box">
            <p>${message}</p>
            <button onclick="closePopup()">OK</button>
        </div>
    `;

    document.body.appendChild(popup);
}

function closePopup() {
    let popup = document.getElementById("customPopup");
    if (popup) popup.remove();
}

function showConfirm(message, callback) {
    let oldPopup = document.getElementById("customPopup");
    if (oldPopup) oldPopup.remove();

    let popup = document.createElement("div");
    popup.id = "customPopup";

    popup.innerHTML = `
        <div class="popup-box">
            <p>${message}</p>
            <div style="margin-top:15px;">
                <button onclick="confirmYes()">Yes</button>
                <button onclick="closePopup()" style="background:gray;">No</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    window.confirmYes = function () {
        closePopup();
        callback();
    };
}

// async function Search() {
//     let input = document.getElementById("input");
//     let message = input.value;

//     document.getElementById("chat").innerHTML += `<p><b>You:</b> ${message}</p>`;

//     const res = await fetch("http://127.0.0.1:5000/chat", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ message })
//     });

//     const data = await res.json();

//     document.getElementById("chat").innerHTML += `<p><b>AI:</b> ${data.reply}</p>`;

//     input.value = "";
// }