
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-foreground rounded-xl shadow-lg border border-border-color">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-text-main">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-accent hover:text-blue-500">
              sign in to an existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name" name="name" type="text" autoComplete="name" required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border-color bg-background placeholder-gray-500 text-text-main focus:outline-none focus:ring-primary-accent focus:border-primary-accent sm:text-sm"
                placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
             <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address" name="email" type="email" autoComplete="email" required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border-color bg-background placeholder-gray-500 text-text-main focus:outline-none focus:ring-primary-accent focus:border-primary-accent sm:text-sm"
                placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password" name="password" type="password" autoComplete="new-password" required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border-color bg-background placeholder-gray-500 text-text-main focus:outline-none focus:ring-primary-accent focus:border-primary-accent sm:text-sm"
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-accent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-accent disabled:bg-gray-500">
              {isLoading ? <LoadingSpinner /> : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
