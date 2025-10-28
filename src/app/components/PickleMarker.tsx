'use client'

interface PickleLocation {
    id: string
    name: string
    rentalRate: number
    image: string
    latitude: number
    longitude: number
    miles: number
}

interface PickleMarkerProps {
    pickle: PickleLocation
}

export default function PickleMarker({ pickle }: PickleMarkerProps) {
    return (
        <div
            style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                width: '160px',
                fontFamily: 'Raleway, sans-serif',
                cursor: 'pointer',
                position: 'relative',
                transform: 'translate(-50%, -100%)',
                marginBottom: '8px',
                pointerEvents: 'auto'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -100%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -100%) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            }}
        >
            {/* Pointer triangle */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid white'
                }}
            />

            {/* Image */}
            <img
                src={pickle.image}
                alt={pickle.name}
                style={{
                    width: '100%',
                    height: '80px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    marginBottom: '8px'
                }}
            />

            {/* Content */}
            <div style={{ textAlign: 'center' }}>
                <div
                    style={{
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#1f2937',
                        marginBottom: '4px',
                        lineHeight: '1.2',
                        fontFamily: 'Raleway, sans-serif'
                    }}
                >
                    {pickle.name}
                </div>
                <div
                    style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '4px',
                        fontFamily: 'Raleway, sans-serif'
                    }}
                >
                    {pickle.miles} miles away
                </div>
                <div
                    style={{
                        fontSize: '12px',
                        color: '#71bd4b',
                        fontWeight: '700',
                        fontFamily: 'Raleway, sans-serif'
                    }}
                >
                    ${pickle.rentalRate}/day
                </div>
            </div>
        </div>
    );
}