console.log('admin')
// True if workfetcher succed, and allow the rest of the page
let connectionEstablished = false;
// If yes, inject images into the gallery
let firstConnection = true;
// Ready to be filled with datas from GET works
let works;

//// Utility box
// Decryption of the token stored
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
};
// Empty any div with a loop, handy 
const emptyThis = (id) => {
    const div = document.getElementById(id)
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
// Reset inner modal form values and style
const resetFormInputsAndStyle = () => {
    // Reveal the placeholder div
    document.getElementById('placeholder').classList.remove('hidden');
    // Hide the div ready to be filled with the image uploaded
    document.getElementById('to-fill').classList.add('hidden');
    // Empty all 3 inputs value
    document.getElementById('file-uploader-input').value = "";
    document.getElementById('modal-inner-form-file-title').value = "";
    document.getElementById('modal-inner-form-file-category').value = "";
    // Background button submit green to grey
    document.getElementById('file-uploader-btn-submit').classList.remove("active")
}

//// DOM injections 
// Home page injection
const galleryImgInjection = (array) => {

    emptyThis('gallery')

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
    // clear the gallery first
    emptyThis('modal-outer-gallery-container');
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
    // Buttons event
    document.querySelectorAll('.modal-outer-image-delete-logo-container').forEach((btn) => {
        btn.addEventListener('click', () => {
            // Delete locally the image from the array
            works = works.filter((work) => {
                return work.id != btn.parentNode.dataset.imgId
            })
            // Inject the new array
            outerModalImgInjection(works);
            galleryImgInjection(works);
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

// GET works
const worksFetcher = () => {
    console.log('Trying to get ' + baseUrl + 'works')
    fetch(baseUrl + 'works')
        .then((response) => response.json())
        .then((data) => {
            works = data;
            console.log(works);
            // An error message is hidden at the bottom of the filter 
            document.getElementById('connexion-pb').classList.remove('active')
            if (firstConnection == true) { galleryImgInjection(data); firstConnection = false; }
        })
        .catch((error) => {
            console.log(error)
            // An error message appear at the bottom of the filter 
            document.getElementById('connexion-pb').classList.add('active')
        })
}; worksFetcher();

// Delete work + id
const workDeleter = (id) => {
    console.log('Trying to delete item id n°' + id)
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

// Post work 
const workPoster = (img, title, cat) => {
    console.log('Trying to post ' + title)
    const formData = new FormData();
    formData.append('image', img);
    formData.append('title', title);
    formData.append('category', cat);

    const parameters =
        { method: 'POST', headers: { 'accept': 'application/json', 'Authorization': `Bearer ${decryption(sessionStorage['token'])}` }, body: formData }

    fetch(baseUrl + 'works', parameters)
        .then((response) => response.json())
        .then((data) => {
            console.log("Succes:", data);
            // Empty the form elements
            // Reset input file placeholder style,  empty all 3 form elements, and submit style
            resetFormInputsAndStyle();
            // Add it to work
            works.push(data);
            // Reinject the new image, and only the new image
            const singleGalleryInjection = (data) => {
                const figure = document.createElement('figure');
                const image = document.createElement('img');
                image.src = data.imageUrl;
                image.alt = data.title;
                image.dataset.imgId = data.id;
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = data.title;
                figure.appendChild(image);
                figure.appendChild(figcaption);
                document.getElementById('gallery').appendChild(figure);
            };
            const singleOuterModalImgInjection = (data) => {
                const figure = document.createElement('figure');
                figure.classList.add('modal-outer-image-container');
                figure.dataset.imgId = data.id;
                const img = document.createElement('img');
                img.classList.add('modal-outer-image')
                img.src = data.imageUrl;
                img.alt = data.title;
                img.dataset.imgId = data.id;
                const newDiv = document.createElement('div');
                newDiv.classList.add('modal-outer-image-delete-logo-container');
                const logo = document.createElement('i');
                logo.classList.add('fa-solid');
                logo.classList.add('fa-trash-can');
                logo.classList.add('delete-logo');
                logo.setAttribute('tabindex', 99);
                newDiv.appendChild(logo);
                figure.appendChild(newDiv);
                figure.appendChild(img);
                document.getElementById('modal-outer-gallery-container').appendChild(figure);
                console.log(img)
            };
            singleGalleryInjection(data);
            singleOuterModalImgInjection(data);
        })
        .catch((error) => {
            console.log(error);
            alert("Nous n'arrivons pas à poster cette image... Si ce message persiste, vérifiez votre connexion, actualisez la page ou réessayez plus tard.");
        })
}

//// Modals handler
const modalOuter = document.getElementById('modal-outer');
const modalInner = document.getElementById('modal-inner');
// Prevent some events to be duplicated
let innerModalEventsAlreadyLoaded = false;

// Inner modal events handler
const innerModalHandler = () => {
    modalInner.showModal();

    // Reset input file at any open of inner modal
    resetFormInputsAndStyle();

    if (innerModalEventsAlreadyLoaded == false) {
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

        fileUploaderInput.addEventListener('input', (e) => {
            // Hide the placeholder div
            document.getElementById('placeholder').classList.add('hidden');
            // Reveal a new div filled with the image uploaded
            const toFill = document.getElementById('to-fill');
            toFill.classList.remove('hidden')
            emptyThis('to-fill')
            // Create an inject the image thumbnail
            const figure = document.createElement('figure');
            const image = document.createElement('img');
            image.src = URL.createObjectURL(e.target.files[0]);
            image.alt = e.target.files[0].name.split('.')[0];
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = e.target.files[0].name.split('.')[0];
            figure.appendChild(image);
            figure.appendChild(figcaption);
            toFill.appendChild(figure);
        });

        // If all required elements are filled, submit become green
        modalForm.addEventListener('input', (e) => {
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
            // Fetch a POST request
            workPoster(fileUploaderInput.files[0], fileTitle.value, fileCategory.value)
        });
        innerModalEventsAlreadyLoaded = true;
    }
}
// Outer modal events handler
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