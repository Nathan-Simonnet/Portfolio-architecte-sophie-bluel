console.log('login')

// Switch 1 character by the next one, two by two
const encryption = (token) => {
    let tokenArray = [...token];
    let result = ""

    for (let i = 0; i < tokenArray.length - 1; i++) {
        result += [token[i + 1]]
        result += [token[i]]
        i++;
    }
    // If not even, the last character will not be processed by the loop, so i had to add it here
    if (tokenArray.length % 2 != 0) {
        result += tokenArray[tokenArray.length - 1]
    }
    // Store the encrypted token
    sessionStorage.setItem('token', result);
    window.location.href = "admin-mode.html";
}

// Launched by the submit button
const loginPoster = (mail, pw) => {
    const parameters =
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            email: mail,
            password: pw
        })
    }

    fetch("http://localhost:5678/api/users/login", parameters)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.message == "user not found") {
                // Reveal an error message
                userNotFoundReveal.classList.add("active")
            } else {
                // Hide the error messages
                userNotFoundReveal.classList.remove("active")
                errorOnLoginReveal.classList.remove('active')
                // Store informations for future fetches
                sessionStorage.setItem('id', data.userId);
                encryption(data.token)
            }
        })
        .catch((error) => {
            console.log(error)
            // Reveal an other error message
            errorOnLoginReveal.classList.add('active')
        });
}

// Submit handler
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    loginPoster(email.value, password.value)
});

// Debug tool, to delete!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Click on "login" to automatically fill the inputs
document.getElementById('easter').addEventListener('click', () => {
    email.value = "sophie.bluel@test.tld";
    password.value = "S0phie";
});