const Home = () => {
    const handleLogin = () => {
      window.location.href = "http://localhost:5000/auth/google"; // Update with your backend URL
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome to the URL Shortener</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Sign in with Google
        </button>
      </div>
    );
  };
  
  export default Home;
  