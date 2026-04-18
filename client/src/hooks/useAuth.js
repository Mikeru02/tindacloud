function useAuth() {
    const token = localStorage.getItem('token');

    return { isAuthenticated: !!token }
}

export default useAuth;