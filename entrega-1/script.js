const initialize = () => {

    //Estado inicial de las validaciones
    const validations = {
        name: {
            isEmpty:true,
            isNotOnlyLetters:true,
            isNotGreaterThan:true,
        },
        lastname: {
            isEmpty:true,
            isNotOnlyLetters:true,
            isNotGreaterThan:true,  
        },
        dni: {
            isEmpty:true,
            isNotGreaterThan:true,
            isNotDni:true,
        },
        birthdate: {
            isEmpty:true,
            isNotInvalidDate: true,
        },
        residenceCountry: {
            isEmpty:true,
            isNotOnlyLetters:true,
            isNotGreaterThan:true,
        },
        email: {
            isEmpty:true,
            isNotEmail:true,
        }
    }
    
    //Elementos
    const nameElement = document.getElementById("name");
    const lastNameElement = document.getElementById("lastname");
    const dniElement = document.getElementById("dni");
    const birthdateElement = document.getElementById("birthdate");
    const residenceCountryElement = document.getElementById("residenceCountry");
    const emailElement = document.getElementById("email");
    const btnSubmit = document.getElementById("submit");
    const btnChangeMode = document.getElementById("btnChangeMode");

    //Eventos
    btnChangeMode.addEventListener("click", (e) => switchMode(e));

    btnSubmit.addEventListener("click", (e) => submitForm(e, validations));
    
    //Validaciones de los inputs al cambiar de foco
    nameElement.onblur = () => {
        const value = nameElement.value.trim();
        const errorElement = document.getElementById("nameError");
        const minLength = 3;
        validations.name.isNotGreaterThan=isNotGreaterThan(minLength, value, errorElement)
        validations.name.isNotOnlyLetters=isNotOnlyLetters(value,errorElement)
        validations.name.isEmpty=isEmpty(value,errorElement);
        if (
            !validations.name.isEmpty &&
            !validations.name.isNotOnlyLetters && 
            !validations.name.isNotGreaterThan
        ) {
            errorElement.innerText="";
        }
    }
    lastNameElement.onblur = () => {
        const value = lastNameElement.value.trim();
        const errorElement = document.getElementById("lastnameError");
        validations.lastname.isNotGreaterThan=isNotGreaterThan(2, value, errorElement);
        validations.lastname.isNotOnlyLetters=isNotOnlyLetters(value,errorElement)
        validations.lastname.isEmpty=isEmpty(value,errorElement);
        if (
            !validations.lastname.isEmpty &&
            !validations.lastname.isNotOnlyLetters &&
            !validations.lastname.isNotGreaterThan
        ) {
            errorElement.innerText="";
        }
    }

    dniElement.onblur = () => {
        const value = dniElement.value.trim();
        const errorElement = document.getElementById("dniError");
        const minLength = 7;
        validations.dni.isNotGreaterThan=isNotGreaterThan(minLength, value, errorElement);
        validations.dni.isNotDni=isNotDni(value, errorElement);
        validations.dni.isEmpty=isEmpty(value,errorElement);
        if (
            !validations.dni.isEmpty &&
            !validations.dni.isNotGreaterThan &&
            !validations.dni.isNotDni
        ) {
            errorElement.innerText="";
        }
    }

    birthdateElement.onblur = () => {
        const value = birthdateElement.value;
        const errorElement = document.getElementById("birthdateError");
        validations.birthdate.isNotInvalidDate=isNotInvalidDate(value,errorElement)
        validations.birthdate.isEmpty=isEmpty(value,errorElement);
        if (!validations.birthdate.isEmpty && !validations.birthdate.isNotInvalidDate) {
            errorElement.innerText="";
        }
        console.log(validations)
    }

    residenceCountryElement.onblur = () => {
        const value = residenceCountryElement.value.trim();
        const errorElement = document.getElementById("residenceCountryError");
        const minLength = 3;
        validations.residenceCountry.isNotGreaterThan=isNotGreaterThan(minLength, value, errorElement);
        validations.residenceCountry.isNotOnlyLetters=isNotOnlyLetters(value,errorElement)
        validations.residenceCountry.isEmpty=isEmpty(value,errorElement);
        if (
            !validations.residenceCountry.isEmpty &&
            !validations.residenceCountry.isNotOnlyLetters &&
            !validations.residenceCountry.isNotGreaterThan
        ) {
            errorElement.innerText="";
        }
    }

    emailElement.onblur = () => {
        const value = emailElement.value.trim();
        const errorElement = document.getElementById("emailError");
        validations.email.isNotEmail=isNotEmail(value,errorElement)
        validations.email.isEmpty=isEmpty(value,errorElement);
        if (!validations.email.isEmpty && (!validations.email.isNotEmail)) {
            errorElement.innerText="";
        }
    }

}

//FUnciones de las validaciones
const isEmpty = (value,errorElement) => {
    if (value === "") {
        errorElement.innerText="Campo requerido"
        return true;
    } return false;
}

const isNotEmail = (value,errorElement) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    if (!regex.test(value)) {
        errorElement.innerText="Email invalido"
        return true;
    } return false;
}

const isNotOnlyLetters = (value,errorElement) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
    if (!regex.test(value)) {
        errorElement.innerText="Este campo solo puede contener letras";
        return true;
    } return false;

}

const isNotInvalidDate = (value,errorElement) => {
    const inputBirthdate = new Date(value);
    const dayLimit = new Date();
    dayLimit.setFullYear(dayLimit.getFullYear()-18)

    dayLimit.setHours(0, 0, 0, 0);
    inputBirthdate.setHours(0, 0, 0, 0);
    if (!(inputBirthdate.getTime() < dayLimit.getTime())) {
        errorElement.innerText="Debes ser mayor de edad para registrarte";
        return true;
    } return false;
}

const isNotGreaterThan = (minLength, value, errorElement) => {
    if (value.length < minLength) {
        errorElement.innerText="La cantidad minima de caracteres es " + minLength;
        return true;
    } return false;
}

const isNotDni = (value, errorElement) => {
    const regex = /^[0-9]{1,10}$/;
    if (!regex.test(value)) {
        errorElement.innerText="Número de DNI invalido";
        return true;
    } return false;
}

//Función del boton "Enviar"
const submitForm = (e, validations) => {
    e.preventDefault();
    const submitMessageElement = document.getElementById("submitMessage");

    if (
        !validations.name.isEmpty && !validations.name.isNotOnlyLetters && !validations.name.isNotGreaterThan &&
        !validations.lastname.isEmpty && !validations.lastname.isNotOnlyLetters && !validations.lastname.isNotGreaterThan &&
        !validations.dni.isEmpty && !validations.dni.isNotGreaterThan && !validations.dni.isNotDni &&
        !validations.birthdate.isEmpty && !validations.birthdate.isNotInvalidDate &&
        !validations.residenceCountry.isEmpty && !validations.residenceCountry.isNotOnlyLetters && !validations.residenceCountry.isNotGreaterThan &&
        !validations.email.isEmpty && !validations.email.isNotEmail
    ) {
        submitMessageElement.innerText="El formulario se ha enviado correctamente!";
    }
}

//Cambiar de modo
const switchMode = (e) => {
    const formElement = document.getElementById("form");
    const isContrastMode = formElement.classList.contains("contrast-mode");
    
    if (isContrastMode) {
        formElement.classList.remove("contrast-mode");
        e.target.innerText="Cambiar a Modo Alto Contraste";
    }
    else {
        formElement.classList.add("contrast-mode");
        e.target.innerText="Salir del Modo Alto Contraste";
    }
}

document.addEventListener("DOMContentLoaded", initialize);