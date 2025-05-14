
import React from 'react';

interface AuthFooterProps {
  activeTab: string;
  switchTab: (tab: string) => void;
}

export const AuthFooter = ({ activeTab, switchTab }: AuthFooterProps) => {
  return (
    <p className="text-sm text-muted-foreground">
      {activeTab === 'login' ? (
        <>
          Don't have an account?{' '}
          <a 
            href="#" 
            className="text-accent hover:underline"
            onClick={(e) => {
              e.preventDefault();
              switchTab('register');
            }}
          >
            Sign up
          </a>
        </>
      ) : (
        <>
          Already have an account?{' '}
          <a 
            href="#" 
            className="text-accent hover:underline"
            onClick={(e) => {
              e.preventDefault();
              switchTab('login');
            }}
          >
            Sign in
          </a>
        </>
      )}
    </p>
  );
};

export default AuthFooter;
