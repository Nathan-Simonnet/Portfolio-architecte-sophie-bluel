console.log('admin')

// Decryption of the token
const decryption = (token) => {

    console.log(token);
    let tokenArray = [...token];
    let decryptedToken = "";

    for (let i = 0; i < tokenArray.length - 1; i++) {
        decryptedToken += [token[i + 1]];
        decryptedToken += [token[i]];
        i++;
    };

    if (tokenArray.length % 2 != 0) {
        decryptedToken += tokenArray[tokenArray.length - 1];
    };

    return decryptedToken;
}; // decryption(sessionStorage.getItem('token'));

// DOM injections


// Fetched handler


// Modals handler
const modalOuter = document.getElementById('modal-outer');
const modalInner = document.getElementById('modal-inner');


// Contact form handler
document.getElementById('form-contact').addEventListener('submit', (e) => {
    e.preventDefault();
});