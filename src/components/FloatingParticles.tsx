'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container, ISourceOptions } from '@tsparticles/engine';

interface FloatingParticlesProps {
    variant?: 'entry' | 'reveal' | 'celebration';
}

export default function FloatingParticles({ variant = 'entry' }: FloatingParticlesProps) {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = useCallback(async (container?: Container) => {
        if (container) {
            console.log('Particles loaded:', container);
        }
    }, []);

    const options: ISourceOptions = useMemo(() => {
        const baseOptions: ISourceOptions = {
            fullScreen: false,
            background: {
                color: {
                    value: 'transparent',
                },
            },
            fpsLimit: 60,
            particles: {
                color: {
                    value: variant === 'celebration'
                        ? ['#F8B4B4', '#FECACA', '#FEE2E2', '#EF4444', '#D4A574']
                        : ['#F8B4B4', '#FECACA', '#FEE2E2', '#FFECD2'],
                },
                move: {
                    direction: 'none',
                    enable: true,
                    outModes: {
                        default: 'out',
                    },
                    random: true,
                    speed: variant === 'entry' ? 0.3 : variant === 'celebration' ? 2 : 0.5,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        width: 800,
                        height: 800,
                    },
                    value: variant === 'entry' ? 20 : variant === 'celebration' ? 60 : 35,
                },
                opacity: {
                    value: { min: 0.2, max: 0.6 },
                    animation: {
                        enable: true,
                        speed: 0.5,
                        sync: false,
                    },
                },
                shape: {
                    type: variant === 'celebration' ? ['circle', 'heart'] : ['circle'],
                },
                size: {
                    value: { min: 3, max: variant === 'entry' ? 8 : 12 },
                },
                wobble: {
                    enable: true,
                    distance: 10,
                    speed: 3,
                },
            },
            detectRetina: true,
        };

        // Add heart shapes for reveal and celebration
        if (variant !== 'entry') {
            baseOptions.particles!.shape = {
                type: ['circle', 'image'],
                options: {
                    image: {
                        src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0Y4QjRCNCIgZD0iTTEyIDIxLjM1bC0xLjQ1LTEuMzJDNS40IDE1LjM2IDIgMTIuMjggMiA4LjUgMiA1LjQyIDQuNDIgMyA3LjUgM2MxLjc0IDAgMy40MS44MSA0LjUgMi4wOUMxMy4wOSAzLjgxIDE0Ljc2IDMgMTYuNSAzIDE5LjU4IDMgMjIgNS40MiAyMiA4LjVjMCAzLjc4LTMuNCA2Ljg2LTguNTUgMTEuNTRMMTIgMjEuMzV6Ii8+PC9zdmc+',
                        width: 24,
                        height: 24,
                    },
                },
            };
        }

        return baseOptions;
    }, [variant]);

    if (!init) {
        return null;
    }

    return (
        <div className="particles-container">
            <Particles
                id={`tsparticles-${variant}`}
                particlesLoaded={particlesLoaded}
                options={options}
                className="w-full h-full"
            />
        </div>
    );
}
