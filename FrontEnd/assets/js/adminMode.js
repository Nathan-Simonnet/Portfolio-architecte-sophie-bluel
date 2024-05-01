console.log('admin')

// Decryption of the token
const decryption = (token) => {

    console.log(token)
    let tokenArray = [...token];
    let result = ""

    for (let i = 0; i < tokenArray.length - 1; i++) {
        result += [token[i + 1]]
        result += [token[i]]
        i++;
    }

    if (tokenArray.length % 2 != 0) {
        result += tokenArray[tokenArray.length - 1]
    }

    console.log(result)
}; decryption(sessionStorage.getItem('token'));