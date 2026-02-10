import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

type Placement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

interface PortalDropdownProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: React.ReactNode;
    children: React.ReactNode;
    /** Placement of the dropdown relative to the trigger, default: 'bottom-end' */
    placement?: Placement;
    /** Gap between trigger and dropdown in px, default: 8 */
    offset?: number;
    /** Extra className for the dropdown panel */
    className?: string;
    /** Whether the trigger is disabled */
    disabled?: boolean;
}

const PortalDropdown: React.FC<PortalDropdownProps> = ({
    open,
    onOpenChange,
    trigger,
    children,
    placement = 'bottom-end',
    offset = 8,
    className = '',
    disabled = false,
}) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Calculate dropdown position based on trigger rect and placement
    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const [vertical, horizontal] = placement.split('-') as [string, string];

        let top: number;
        let left: number;

        if (vertical === 'bottom') {
            top = rect.bottom + offset;
        } else {
            top = rect.top - offset;
        }

        if (horizontal === 'end') {
            left = rect.right;
        } else {
            left = rect.left;
        }

        setPosition({ top, left });
    }, [placement, offset]);

    // Update position when opened and on scroll/resize
    useEffect(() => {
        if (!open) return;
        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [open, updatePosition]);

    // Close on click outside
    useEffect(() => {
        if (!open) return;

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (
                dropdownRef.current && !dropdownRef.current.contains(target) &&
                triggerRef.current && !triggerRef.current.contains(target)
            ) {
                onOpenChange(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onOpenChange]);

    // Close on Escape key
    useEffect(() => {
        if (!open) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onOpenChange(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onOpenChange]);

    // Build transform based on placement
    const getTransform = () => {
        const [vertical, horizontal] = placement.split('-') as [string, string];
        const translateX = horizontal === 'end' ? '-100%' : '0';
        const translateY = vertical === 'top' ? '-100%' : '0';
        return `translate(${translateX}, ${translateY})`;
    };

    return (
        <>
            <div
                ref={triggerRef}
                onClick={() => { if (!disabled) onOpenChange(!open); }}
                className="inline-flex"
            >
                {trigger}
            </div>

            {open && createPortal(
                <div
                    ref={dropdownRef}
                    className={`fixed bg-card shadow-lg border border-border z-[9999] ${className}`}
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        transform: getTransform(),
                    }}
                >
                    {children}
                </div>,
                document.body,
            )}
        </>
    );
};

export default PortalDropdown;
