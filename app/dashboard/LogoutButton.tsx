'use client'

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <Button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="py-3 w-full bg-red-700 rounded-md text-white hover:bg-red-800"
    >
      Logout
    </Button>
  );
}
