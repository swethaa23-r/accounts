
// ----------------------------------------------------
// DEMO MOCK DATABASE: Initialize Default Users
// ----------------------------------------------------
if (!localStorage.getItem('stackly_users_v2')) {
    const defaultUsers = [
        { name: 'Admin User', email: 'admin@stackly.com', password: 'password123', role: 'admin' },
        { name: 'Client User', email: 'client@stackly.com', password: 'password123', role: 'client' },
        { name: 'Swetha', email: 'swetha@gmail.com', password: 'password123', role: 'admin' }
    ];
    localStorage.setItem('stackly_users_v2', JSON.stringify(defaultUsers));
}


// =========================================
// PRELOADER
// =========================================
(function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const removePreloader = () => {
            if (preloader.classList.contains('preloader-hidden')) return;
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                document.body.classList.remove('preloader-active');
                if(preloader.parentNode) preloader.parentNode.removeChild(preloader);
            }, 750); // Matches CSS transition duration
        };

        // Remove on window load
        

        // Fallback: Remove after 2.5 seconds max to prevent infinite loading
        setTimeout(removePreloader, 1200);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-in-out'
        });
    }

    // 2. Sticky Navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Mobile Menu Management
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    const closeMenu = () => {
        if (navLinks) navLinks.classList.remove('active');
        if (navActions) navActions.classList.remove('active');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        document.body.style.overflow = ''; 
    };

    const toggleMenu = () => {
        const isActive = navLinks && navLinks.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            if(navLinks) navLinks.classList.add('active');
            if(navActions) navActions.classList.add('active');
            if(toggleBtn) {
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
            document.body.style.overflow = 'hidden'; 
        }
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    const allLinks = document.querySelectorAll('.nav-links a, .nav-actions a');
    allLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (navbar && !navbar.contains(e.target)) {
                closeMenu();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });



    // 5. Active Navigation State Detection
    const currentPath = window.location.pathname.split('/').pop();
    const navAnchors = document.querySelectorAll('.nav-links a');
    
    navAnchors.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('nav-current');
        }
    });

    
    
    function showError(inputElement, message) {
        clearError(inputElement);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.35rem';
        errorDiv.textContent = message;
        
        // Accessibility
        const errorId = inputElement.id ? inputElement.id + '-error' : 'error-' + Math.random().toString(36).substr(2, 9);
        errorDiv.id = errorId;
        inputElement.setAttribute('aria-invalid', 'true');
        inputElement.setAttribute('aria-describedby', errorId);
        
        let targetWrapper = inputElement;
        if (inputElement.parentElement && inputElement.parentElement.style.position === 'relative') {
            targetWrapper = inputElement.parentElement;
        }
        
        targetWrapper.parentNode.insertBefore(errorDiv, targetWrapper.nextSibling);
        inputElement.style.borderColor = '#ef4444';
    }

    function clearError(inputElement) {
        inputElement.removeAttribute('aria-invalid');
        const errorId = inputElement.getAttribute('aria-describedby');
        if (errorId) {
            const errorDiv = document.getElementById(errorId);
            if (errorDiv) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
            inputElement.removeAttribute('aria-describedby');
        } else {
            // Fallback cleanup
            let targetWrapper = inputElement;
            if (inputElement.parentElement && inputElement.parentElement.style.position === 'relative') {
                targetWrapper = inputElement.parentElement;
            }
            const nextEl = targetWrapper.nextSibling;
            if (nextEl && nextEl.classList && nextEl.classList.contains('error-message')) {
                nextEl.parentNode.removeChild(nextEl);
            }
        }
        inputElement.style.borderColor = '';
    }

    document.addEventListener('input', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            clearError(e.target);
            
            // Basic Password Strength Indicator
            if (e.target.id === 'sPassword') {
                const val = e.target.value;
                let strength = 0;
                if (val.length >= 8) strength++;
                if (/[A-Z]/.test(val)) strength++;
                if (/[0-9]/.test(val)) strength++;
                if (/[^A-Za-z0-9]/.test(val)) strength++;
                
                let strengthBar = document.getElementById('pwd-strength-bar');
                if (!strengthBar) {
                    strengthBar = document.createElement('div');
                    strengthBar.id = 'pwd-strength-bar';
                    strengthBar.style.height = '4px';
                    strengthBar.style.marginTop = '8px';
                    strengthBar.style.borderRadius = '2px';
                    strengthBar.style.transition = 'all 0.3s';
                    strengthBar.style.width = '100%';
                    strengthBar.style.backgroundColor = '#e2e8f0';
                    e.target.parentNode.parentNode.appendChild(strengthBar);
                }
                
                if (val === '') {
                    strengthBar.style.background = '#e2e8f0';
                } else if (strength <= 1) {
                    strengthBar.style.background = 'linear-gradient(to right, #ef4444 33%, #e2e8f0 33%)';
                } else if (strength === 2) {
                    strengthBar.style.background = 'linear-gradient(to right, #f59e0b 66%, #e2e8f0 66%)';
                } else {
                    strengthBar.style.background = 'linear-gradient(to right, #10b981 100%, #10b981 100%)';
                }
            }
        }
    });
    
    document.addEventListener('change', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            clearError(e.target);
            // Trim input on change (except passwords)
            if (e.target.type !== 'password' && typeof e.target.value === 'string') {
                e.target.value = e.target.value.trim();
            }
        }
    });

    document.addEventListener('submit', (e) => {
        const form = e.target;
        e.preventDefault(); 

        let isValid = true;
        let firstInvalidInput = null;

        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            clearError(field);
            const val = field.value.trim();
            const isRequired = field.hasAttribute('required') || field.getAttribute('data-custom-required') === 'true';
            
            if (isRequired) {
                if ((field.type === 'checkbox' && !field.checked) || (field.type !== 'checkbox' && val === '')) {
                    const fieldName = field.getAttribute('placeholder') || field.previousElementSibling?.textContent || 'This field';
                    showError(field, fieldName.replace(/[*:]/g, '').trim() + ' is required');
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }
            }

            if (val !== '') {
                // Min/Max length
                const min = field.getAttribute('minlength');
                if (min && val.length < parseInt(min)) {
                    showError(field, `Must be at least ${min} characters`);
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }
                const max = field.getAttribute('maxlength');
                if (max && val.length > parseInt(max)) {
                    showError(field, `Must be no more than ${max} characters`);
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }

                if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    showError(field, 'Please enter a valid email address');
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }
                
                if (field.type === 'tel' && !/^\d{10,15}$/.test(val.replace(/[^0-9]/g, ''))) {
                    showError(field, 'Please enter a valid phone number');
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }
            }

            if (form.id === 'proSignupForm') {
                if (field.id === 'sPassword' && val !== '') {
                    if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(val)) {
                        showError(field, 'Password must be 8+ chars and contain both letters & numbers');
                        isValid = false;
                        if (!firstInvalidInput) firstInvalidInput = field;
                        return;
                    }
                }
                if (field.id === 'sConfirmPassword' && val !== '') {
                    const passField = document.getElementById('sPassword');
                    if (passField && val !== passField.value.trim()) {
                        showError(field, 'Passwords do not match');
                        isValid = false;
                        if (!firstInvalidInput) firstInvalidInput = field;
                        return;
                    }
                }
            }
        });

        if (!isValid) {
            if (firstInvalidInput) firstInvalidInput.focus();
            return;
        }

        if (form.id === 'proLoginForm') {
            const emailInput = document.getElementById('loginEmail');
            const passInput = document.getElementById('loginPassword');
            const roleInput = document.getElementById('loginRole');
            
            const email = emailInput ? emailInput.value.trim() : '';
            const requestedRole = roleInput ? roleInput.value : 'client';
            
            // RELAXED SIMULATION: Allow ANY email and password
            const btn = document.getElementById('loginSubmitBtn') || form.querySelector('button[type="submit"]');
            if (btn) btn.textContent = "Authenticating...";
            
            let userName = 'User';
            if (email && email.includes('@')) {
                const namePart = email.split('@')[0];
                userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            }

            localStorage.setItem("stacklyUserName", userName);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", requestedRole);
            
            setTimeout(() => {
                window.location.href = requestedRole === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
            }, 1000);
            return;
        }

        if (form.id === 'proSignupForm') {
            const nameInput = document.getElementById('sName');
            const emailInput = document.getElementById('sEmail');
            const passInput = document.getElementById('sPassword');
            const roleInput = document.getElementById('sRole');
            
            const email = emailInput ? emailInput.value.trim() : '';
            
            let users = JSON.parse(localStorage.getItem('stackly_users_v2') || '[]');
            if (users.find(u => u.email === email)) {
                if (emailInput) showError(emailInput, 'Account with this email already exists');
                return;
            }
            
            const newUser = {
                name: nameInput ? nameInput.value.trim() : 'User',
                email: email,
                password: passInput ? passInput.value.trim() : '',
                role: roleInput ? roleInput.value : 'client'
            };
            
            users.push(newUser);
            localStorage.setItem('stackly_users_v2', JSON.stringify(users));
            
            const btn = document.getElementById('signupSubmitBtn') || form.querySelector('button[type="submit"]');
            if (btn) btn.textContent = "Creating Account...";
            
            setTimeout(() => { window.location.href = 'login.html'; }, 1000);
            return;
        }
        
        const successAction = form.getAttribute('data-success-action');
        if (successAction === '404') {
            window.location.href = '404.html';
        } else if (successAction === 'login_success') {
            const role = document.getElementById('loginRole');
            if(role && role.value === 'admin') window.location.href = 'admin-dashboard.html';
            else window.location.href = 'client-dashboard.html';
        } else if (successAction === 'contact_success') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = "Message Sent Successfully!";
                btn.style.backgroundColor = "#10b981";
            }
        } else if (successAction === 'profile_success' || successAction === 'password_success') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "Successfully Updated!";
                btn.style.backgroundColor = "#10b981"; 
                btn.style.color = "#ffffff";
                btn.style.borderColor = "#10b981";
                setTimeout(() => { 
                    btn.textContent = originalText; 
                    btn.style.backgroundColor = ""; 
                    btn.style.color = "";
                    btn.style.borderColor = "";
                }, 3000);
            }
        } else {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "Success!";
                btn.style.backgroundColor = "#10b981";
                setTimeout(() => { 
                    btn.textContent = originalText; 
                    btn.style.backgroundColor = ""; 
                }, 3000);
            }
        }
    });
});
