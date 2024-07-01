import React from 'react';

export default function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-white  z-50">
      <div className="h-full bg-padel-green animate-pulse" style={{ width: '100%' }}></div>
    </div>
  );
}
