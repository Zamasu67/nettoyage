document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const rendezVousBtn = document.getElementById('rendez-vous-btn');
    const contactForm = document.getElementById('contact-form');
    const messageTypeSelect = document.getElementById('message-type');
    const autreMessageContainer = document.getElementById('autre-message-container');
    const autreMessageTextarea = document.getElementById('autre-message');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const parallaxImage = document.querySelector('.parallax-image');

    // Gestion du défilement vers la section contact
    if (rendezVousBtn) {
        rendezVousBtn.addEventListener('click', function() {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Afficher/masquer le champ de texte "Autre"
    if (messageTypeSelect) {
        messageTypeSelect.addEventListener('change', function() {
            const isAutre = this.value === 'autre';
            autreMessageContainer.style.display = isAutre ? 'block' : 'none';
            autreMessageTextarea.required = isAutre;
        });
    }

    // Configuration du calendrier
    if (dateInput) {
        flatpickr(dateInput, {
            minDate: "today",
            maxDate: new Date().fp_incr(30),
            disable: [date => date.getDay() === 0],
            locale: "fr",
            onChange: (selectedDates) => updateAvailableHours(selectedDates[0])
        });
    }

    // Mise à jour des heures disponibles
    function updateAvailableHours(selectedDate) {
        timeSelect.innerHTML = '';
        for (let hour = 9; hour < 18; hour++) {
            const option = document.createElement('option');
            option.value = option.textContent = `${hour}:00`;
            timeSelect.appendChild(option);
        }
    }

    // Gestion de la soumission du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(this);
            formData.append('sendEmail', 'true');

            if (messageTypeSelect.value === 'autre') {
                formData.set('message', `autre: ${autreMessageTextarea.value}`);
            }

            if ([...formData.values()].every(Boolean)) {
                const scriptURL = "https://script.google.com/macros/s/AKfycbwzpfcD9ns4_zTc5Mvget5KxcbsDl3SyjM8PdDbz4CPbMPlFjsebR0z4NNnKyJ-2GLv/exec";

                fetch(scriptURL, { method: 'POST', body: formData })
                    .then(response => response.text())
                    .then(() => {
                        alert("Réservation ajoutée avec succès et notification envoyée !");
                        this.reset();
                    })
                    .catch(error => {
                        alert("Erreur lors de l'envoi de la réservation.");
                        console.error('Erreur:', error);
                    });
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        });
    }
})