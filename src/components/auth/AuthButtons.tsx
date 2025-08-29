import { CAN_SIGN_IN } from '@/lib/env';
import { signInWithGoogle } from '@/lib/auth';

export default function AuthButtons() {
  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) console.warn('[naturverse] sign-in blocked:', error.message);
  };

  return (
    <button onClick={handleGoogle} disabled={!CAN_SIGN_IN} aria-disabled={!CAN_SIGN_IN}>
      Continue with Google
    </button>
  );
}
