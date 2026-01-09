class AuthService {
    login = async (email: string, password: string) => {
        return {
            token: "1234567890"
        }
    }
}

export default AuthService;