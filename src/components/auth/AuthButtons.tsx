import { signInWithGoogle } from '@/lib/auth';

export default function AuthButtons() {
  return (
    <button onClick={() => void signInWithGoogle()}>
      Continue with Google
    </button>
  );
}
