import { Footer } from "@shared/components/LandingPage/Footer"
import { Outlet, useMatches } from "@tanstack/react-router"

const HIDE_FOOTER_PATHS = [
    '/auth/reset-password/verify-otp',
    '/auth/signup/verify-otp',
    '/auth/forgot-password/verify-otp',
]

const AuthLayout = () => {
    const matches = useMatches()
    const currentPath = matches[matches.length - 1]?.pathname ?? '/'
    const shouldHideFooter = HIDE_FOOTER_PATHS.some(path => currentPath.includes(path) || currentPath === path)
    return (
        <div className="auth-wrapper">
            <Outlet />
            {!shouldHideFooter && <Footer />}
        </div>
    )
}

export default AuthLayout