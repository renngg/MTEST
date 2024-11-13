'use client'

import { useEffect, useState } from 'react';

export default function Check({ session }) {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      if (session && session.user) {
        await fetch('/api/checkUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    };

    checkUser();
  }, [session]);

  return (
    <>
    </>
  );
}