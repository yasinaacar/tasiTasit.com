const termsAndConditions = document.getElementById('termsAndConditions');
const password = document.getElementById('password');
const passwordAgain = document.getElementById('passwordagain');
const signUpBtn = document.getElementById('signUpBtn');
const noMatches = document.getElementById('noMatches');

passwordAgain.addEventListener("input", () => {
    if (password.value === passwordAgain.value) {
        noMatches.style.display = "none"; // İf have a matches between passwords hide error message
        termsAndConditions.disabled=false;
        termsAndConditions.addEventListener('change', function () {
            signUpBtn.disabled = !termsAndConditions.checked; // Update sign up button status
        });

    } else {
        noMatches.style.display = "block"; // İf have a matches between passwords show error message
        termsAndConditions.checked=true ? termsAndConditions.checked=false : "";
        termsAndConditions.disabled=true;
        signUpBtn.disabled = true; // Disabled sign up button
    }
});