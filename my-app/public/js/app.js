document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token); // Save token for future API calls
      alert('Login successful');
      window.location.href = '/dashboard';
    } else {
      alert(data.error);
    }
  });
  