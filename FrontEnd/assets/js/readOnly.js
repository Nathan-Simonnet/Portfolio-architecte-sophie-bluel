console.log("Read only")

sessionStorage.clear()
const baseUrl = "http://localhost:5678/api/";
let token;
let works;
let laImage;

const workDeleter = (id) => {

    const parameters =
    {
        method: 'DELETE',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${sessionStorage['token']}`
        },
    }

    fetch(baseUrl + 'works/' + id, parameters)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => console.log(error))

}

deleteLast.addEventListener('click', () => {
    workDeleter(works[works.length - 1].id)
});
const workPoster = (img, title, cat) => {
    console.log(img, title, cat)
    const formData = new FormData();
    formData.append('image', img);
    formData.append('title', title);
    formData.append('category', cat);
    console.log(formData)
    console.log(sessionStorage.getItem("token"))

    const parameters =
    {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${sessionStorage['token']}`
        },
        body: formData
    }

    fetch(baseUrl + 'works', parameters)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => console.log(error))
}

const fileUploaderTest = document.getElementById('fileUploaderTest')
fileUploaderTest.addEventListener('input', (e) => {
    const file = e.target.files[0];
    workPoster(file, "letitre", 2)

});

const worksFetcher = () => {
    fetch(baseUrl + 'works')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            works = data;
        })
        .catch((error) => console.log(error))
}

const categoriesFetcher = () => {
    fetch(baseUrl + 'categories')
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            worksFetcher();
        })
        .catch((error) => console.log(error))
}

const loginPoster = () => {
    const parameters =
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            email: "sophie.bluel@test.tld",
            password: "S0phie"
        })
    }

    fetch(baseUrl + 'users/login', parameters)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            sessionStorage.setItem('token', data.token);
            categoriesFetcher();
        })
        .catch((error) => console.log(error))
}

loginPoster()





