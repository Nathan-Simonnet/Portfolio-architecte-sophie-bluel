console.log('admin')
let firstConnection = true;
// Reday to be filled with datas from GET works
// Allows to add and delete without fetching everytime
let works;

//// Decryption of the token
const decryption = (token) => {

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

//// DOM injections 
// Home page injection
const galleryImgInjection = (array) => {

    // clear the allery first
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }

    // Create and inject an img for every elements of the array
    for (let i = 0; i < array.length; i++) {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = array[i].imageUrl;
        image.alt = array[i].title;
        image.dataset.imgId = array[i].id;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = array[i].title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }

};

// Outer modal injection
const outerModalImgInjection = (array) => {
    const outerModalGallery = document.getElementById('modal-outer-gallery-container');
    // clear the allery first
    while (outerModalGallery.firstChild) {
        outerModalGallery.removeChild(outerModalGallery.firstChild);
    }
    // Create and inject an img and delete btn for every elements of the array
    for (let i = 0; i < array.length; i++) {
        const figure = document.createElement('figure');
        figure.classList.add('modal-outer-image-container')
        figure.dataset.imgId = array[i].id;
        const img = document.createElement('img');
        img.classList.add('modal-outer-image')
        img.src = array[i].imageUrl;
        img.alt = array[i].title;
        img.dataset.imgId = array[i].id;
        const newDiv = document.createElement('div');
        newDiv.classList.add('modal-outer-image-delete-logo-container')
        const logo = document.createElement('i');
        logo.classList.add('fa-solid')
        logo.classList.add('fa-trash-can')
        logo.classList.add('delete-logo')
        logo.setAttribute('tabindex', i + 2);
        newDiv.appendChild(logo);
        figure.appendChild(newDiv);
        figure.appendChild(img);
        outerModalGallery.appendChild(figure);
    }

    document.querySelectorAll('.modal-outer-image-delete-logo-container').forEach((btn) => {
        btn.addEventListener('click', () => {
            console.log(btn.parentNode.dataset.imgId)
            // Delete locally the image from the array
            works = works.filter((work) => {
                return work.id != btn.parentNode.dataset.imgId
            })
            console.log(works);
            galleryImgInjection(works);
            outerModalImgInjection(works);
            // Fetch a delete request for the image 
            workDeleter(btn.parentNode.dataset.imgId)

        });
        // For keyboard user
        btn.addEventListener('keydown', (e) => {
            // Check if the pressed key is Enter (keycode 13)
            if (e.key === 'Enter') {
                // Execute the button's click event
                e.target.click();
            }
        });
    });
};

//// Fetched handler
const baseUrl = "http://localhost:5678/api/";

const worksFetcher = () => {
    fetch(baseUrl + 'works')
        .then((response) => response.json())
        .then((data) => {
            works = data;
            console.log(works);
            if (firstConnection == true) {
                galleryImgInjection(data);
                firstConnection = false;
            }
        })
        .catch((error) => console.log(error))
}; worksFetcher();

const workDeleter = (id) => {

    const parameters =
    {
        method: 'DELETE',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${decryption(sessionStorage['token'])}`
        },
    }

    fetch(baseUrl + 'works/' + id, parameters)
        .then((response) => console.log('Succes:', response))
        .catch((error) => console.log('Error', error))

}

//// Modals handler
const modalOuter = document.getElementById('modal-outer');
const modalInner = document.getElementById('modal-inner');

// Inner modal events
const innerModalHandler = () => {
    modalInner.showModal();
    // Close inner modal mouse users
    document.getElementById('modal-inner-close').addEventListener('click', () => {
        modalInner.close();
    });
    // Close inner modal Keyboard users
    document.getElementById('modal-inner-close').addEventListener('keydown', (e) => {
        e.key == 'Enter' ? modalInner.close() : null
    });
    // Close both inner and outer modals mouse users
    document.getElementById('modal-inner-and-outer-close').addEventListener('click', () => {
        modalInner.close(); modalOuter.close();
    });
    // Close both inner and outer modals Keyboard users
    document.getElementById('modal-inner-and-outer-close').addEventListener('keydown', (e) => {
        if (e.key == 'Enter') { modalInner.close(); modalOuter.close(); };
    });
    //// Fom handler
    const modalForm = document.getElementById('modal-inner-file-uploader');
    // All 3 required elements of the form
    const fileUploaderInput = document.getElementById('file-uploader-input');
    const fileTitle = document.getElementById('modal-inner-form-file-title');
    const fileCategory = document.getElementById('modal-inner-form-file-category');

    // Border onfocus for keyboard users
    fileUploaderInput.addEventListener('focus', () => {
        document.querySelector('.file-uploader-container').classList.add('active');
        fileUploaderInput.addEventListener('blur', () => {
            document.querySelector('.file-uploader-container').classList.remove('active');
        });
    });





    // If all required elements are filled, submit become green
    modalForm.addEventListener('input', () => {
        if (fileUploaderInput.files[0] &&
            fileTitle.value &&
            fileCategory.value) {
            document.getElementById('file-uploader-btn-submit').classList.add("active")
        } else {
            document.getElementById('file-uploader-btn-submit').classList.remove("active")
        }
    });

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault()
    });
}
// Outer modal events
const outerModalHandler = () => {
    modalOuter.showModal()

    // Close outer modal
    document.getElementById('modal-outer-close').addEventListener('click', () => {
        modalOuter.close()
    });
    // Close outer modal for keyboard users
    document.getElementById('modal-outer-close').addEventListener('keydown', (e) => {
        e.key === 'Enter' ? modalOuter.close() : null;
    });
    // Images injection + buttons event listener
    outerModalImgInjection(works)

    // Open inner modal + events
    document.getElementById('modal-inner-open').addEventListener('click', () => {
        innerModalHandler()
    });
}
//  Open outer modal mouse users
document.getElementById('portfolio-edit-mode').addEventListener('click', () => {
    outerModalHandler()
});
// Open outer modal keyboard users
document.getElementById('portfolio-edit-mode').addEventListener('keydown', (e) => {
    e.key === 'Enter' ? outerModalHandler() : null;
});

// Contact form handler
document.getElementById('form-contact').addEventListener('submit', (e) => {
    e.preventDefault();
});