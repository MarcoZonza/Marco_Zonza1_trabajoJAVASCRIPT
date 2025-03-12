document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPresupuesto");
    const totalSpan = document.getElementById("total");
    const descuentoSpan = document.createElement("span");
    descuentoSpan.id = "descuento";
    descuentoSpan.style.marginLeft = "10px";
    totalSpan.parentNode.appendChild(descuentoSpan);

    const inputsContacto = {
        nombre: document.getElementById("nombre"),
        apellidos: document.getElementById("apellidos"),
        telefono: document.getElementById("telefono"),
        email: document.getElementById("email")
    };
    const producto = document.getElementById("producto");
    const plazo = document.getElementById("plazo");
    const extras = document.querySelectorAll("input[name='extras']");
    const aceptar = document.getElementById("aceptar");

    const validarNombre = (valor) => /^[A-Za-zÀ-ÿ\s]{1,15}$/.test(valor.trim());
    const validarApellidos = (valor) => /^[A-Za-zÀ-ÿ\s]{1,40}$/.test(valor.trim());
    const validarTelefono = (valor) => /^\d{9}$/.test(valor.trim());
    const validarEmail = (valor) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor.trim());

    const validateInput = (input, id, validationFn) => {
        const valor = input.value.trim();
        const errorSpan = document.getElementById(`error-${id}`);
        if (!valor) {
            errorSpan.textContent = `${id.charAt(0).toUpperCase() + id.slice(1)} es obligatorio`;
            return false;
        } else if (!validationFn(valor)) {
            errorSpan.textContent = `El ${id} no es válido`;
            return false;
        } else {
            errorSpan.textContent = "";
            return true;
        }
    };

    const calcularPresupuesto = () => {
        let subtotal = parseFloat(producto.value) || 0;
        extras.forEach(extra => {
            if (extra.checked) subtotal += parseFloat(extra.value);
        });

        const plazoValue = parseInt(plazo.value) || 1;
        let descuento = 0;
        let total = subtotal;

        if (plazoValue > 15) {
            descuento = subtotal * 0.15; // 15% de descuento
            total = subtotal * 0.85;
            descuentoSpan.textContent = `(Descuento: -${descuento.toFixed(2)}€)`;
        } else if (plazoValue > 5) {
            descuento = subtotal * 0.10;
            total = subtotal * 0.90;
            descuentoSpan.textContent = `(Descuento: -${descuento.toFixed(2)}€)`;
        } else if (plazoValue >= 1) {
            descuento = subtotal * 0.05;
            total = subtotal * 0.95;
            descuentoSpan.textContent = `(Descuento: -${descuento.toFixed(2)}€)`;
        } else {
            descuentoSpan.textContent = "";
        }

        totalSpan.textContent = total.toFixed(2) + "€";
    };

    Object.keys(inputsContacto).forEach(id => {
        inputsContacto[id].addEventListener("input", () => validateInput(inputsContacto[id], id, {
            nombre: validarNombre,
            apellidos: validarApellidos,
            telefono: validarTelefono,
            email: validarEmail
        }[id]));
    });

    [producto, plazo, ...extras].forEach(input => {
        input.addEventListener("change", calcularPresupuesto);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const allContactValid = Object.keys(inputsContacto).every(id =>
            validateInput(inputsContacto[id], id, {
                nombre: validarNombre,
                apellidos: validarApellidos,
                telefono: validarTelefono,
                email: validarEmail
            }[id])
        );
        const plazoValid = plazo.value >= 1 && plazo.value <= 30;
        const productoValido = !!producto.value;
        const aceptarChecked = aceptar.checked;

        if (allContactValid && plazoValid && productoValido && aceptarChecked) {
            alert(`Presupuesto enviado correctamente.\nTotal: ${totalSpan.textContent} ${descuentoSpan.textContent}`);
            form.reset();
            totalSpan.textContent = "0€";
            descuentoSpan.textContent = "";
        } else {
            let errorMessage = "Por favor, corrige los siguientes errores:\n";
            if (!allContactValid) errorMessage += "- Completa y corrige los datos de contacto.\n";
            if (!plazoValid) errorMessage += "- El plazo debe estar entre 1 y 30 días.\n";
            if (!productoValido) errorMessage += "- Selecciona un producto.\n";
            if (!aceptarChecked) errorMessage += "- Acepta las condiciones.\n";
            alert(errorMessage);
        }
    });

    form.addEventListener("reset", () => {
        Object.keys(inputsContacto).forEach(id => {
            document.getElementById(`error-${id}`).textContent = "";
        });
        totalSpan.textContent = "0€";
        descuentoSpan.textContent = "";
    });

    calcularPresupuesto();
});