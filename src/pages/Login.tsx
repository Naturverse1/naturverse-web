import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <main className="page">
      <header className="page-header">
        <h1>Login</h1>
        <p>Use a magic link or sign in with a provider.</p>
      </header>

      <LoginForm />
    </main>
  );
}
