import React from 'react';

const ImageLoaderSkeleton = () => {
    return (
        <div style={{ animation: 'skeleton-loading 1s linear infinite alternate' }}>
            <div className="skeleton-image" style={{ height: '200px', width: '100%', marginBottom: '4px', borderRadius: '0.25rem', backgroundColor: '#868383' }} />
           
        </div>
    );
};

export default ImageLoaderSkeleton;
