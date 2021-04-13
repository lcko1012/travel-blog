import React from 'react'


const handleSubmit = async e => {
    e.preventDefault()
    alert("Click submit")
}

function Register() {
    return (
        <main>
        <div class="register">
            <h3>Creat an account</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm password" />
                <button type="submit">
                    SUBMIT & REGISTER 
                </button>
                
            <div class="register__divider">
                <span>OR</span>
            </div>
            </form>
            <div class="register__social">
                <a href="#" class="register__social--facebook">
                    <i class="fab fa-facebook-f"></i>
                    Facebook</a>
                <a href="#" class="register__social--google">
                    <i class="fab fa-google"></i>
                    Google</a>
            </div>

        </div>
    </main>
    )
}

export default Register
