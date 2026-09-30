import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="movie-card" style={{ height: '380px' }}>
      <div className="skeleton-shimmer" style={{ width: '100%', height: '70%' }} />
      <div className="p-3 d-flex flex-column gap-2" style={{ height: '30%' }}>
        <div className="skeleton-shimmer" style={{ height: '18px', width: '80%', borderRadius: '4px' }} />
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="skeleton-shimmer" style={{ height: '14px', width: '30%', borderRadius: '4px' }} />
          <div className="skeleton-shimmer" style={{ height: '14px', width: '20%', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
}
