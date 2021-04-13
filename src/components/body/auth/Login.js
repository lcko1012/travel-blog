import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <main>
        <div class="register">
            <h3>Login</h3>
            <form action="">
                <input type="text" placeholder="Username"/>
                <input type="password" placeholder="Password"/>
                <button>
                    LOG IN
                </button>
                <Link>
                    Forgot password?
                </Link>
                
            <div class="register__divider">
                <span>OR</span>
            </div>
            </form>
            <div class="register__social">
                <a href="" class="register__social--facebook">
                    <i class="fab fa-facebook-f"></i>
                    Facebook</a>
                <a href="" class="register__social--google">
                    <i class="fab fa-google"></i>
                    Google</a>
            </div>
            <Link to="/register">
                <p className="register__link">
                    Don't have an account? Register
                </p>
            </Link>
        </div>
    </main>
    )
}

export default Login
