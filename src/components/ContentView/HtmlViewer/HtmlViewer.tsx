import { useEffect, useRef, useState } from 'react';

import ReactDOM from 'react-dom';
import SelectionTooltip from '../SelectionTooltip/SelectionTooltip';
import AudioComponent from '../Audio/Audio';

const PadaiHtmlContentViwer = ({ url }: { url: string }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);


    //-------------- Tooltip for text selection -----------------//
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = useState('');
    // 🧩 Load and sanitize HTML (strip <html>, <head>, <body>)
    useEffect(() => {
        if (!url) {
            setHtmlContent('');
            return;
        }
        let cancelled = false;
        fetch(url)
            .then((r) => r.text())
            .then((rawHtml) => {
                if (cancelled) return;
                const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                const cleanHtml = bodyMatch ? bodyMatch[1] : rawHtml;
                setHtmlContent(cleanHtml);
            })
            .catch(() => {
                if (!cancelled)
                    setHtmlContent('<div style="padding:12px">Failed to load content.</div>');
            });
        return () => {
            cancelled = true;
        };
    }, [url]);

    // Inject HTML directly into DOM element to preserve text selection on Android
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = htmlContent;
        }
    }, [htmlContent]);

    useEffect(() => {
        const preventContextMenu = (e: Event) => e.preventDefault();
        document.addEventListener('contextmenu', preventContextMenu);

        // Force text selection on innerHTML content and prevent iOS menu
        const forceSelectionStyles = () => {
            const styleId = 'force-selection-styles';
            let style = document.getElementById(styleId) as HTMLStyleElement;
            
            if (!style) {
                style = document.createElement('style');
                style.id = styleId;
                document.head.appendChild(style);
            }
            
            // Apply globally to prevent iOS menu
            style.textContent = `
                body, html, #root {
                    -webkit-touch-callout: none !important;
                }
                .html-div, .html-div *, 
                [class*="selectable"], 
                [class*="html-div"] {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                    -webkit-touch-callout: none !important;
                    touch-callout: none !important;
                }
                /* Apply to all elements within content area */
                .prose.bg-slate-100.selectable-text,
                .prose.bg-slate-100.selectable-text * {
                    -webkit-touch-callout: none !important;
                }
                /* Hide iOS selection handles/menu */
                ::selection,
                ::-moz-selection {
                    -webkit-touch-callout: none !important;
                }
            `;
        };

        forceSelectionStyles();

        let isHandlingSelection = false;

        const handleSelectionChange = () => {
            if (isHandlingSelection) return; // Prevent recursive calls
            
            const selection: any = window.getSelection();
            const text = selection?.toString();

            if (text && text.trim().length > 0 && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // Check if selection is within our content area (more lenient check)
                const containerRect = containerRef.current?.getBoundingClientRect();
                const isWithinContent = containerRect && 
                    rect.top >= (containerRect.top - 20) && 
                    rect.bottom <= (containerRect.bottom + 20) &&
                    rect.left >= (containerRect.left - 20) && 
                    rect.right <= (containerRect.right + 20);
                
                if (isWithinContent) {
                    isHandlingSelection = true;
                    
                    // Save selection data
                    const savedRange = range.cloneRange();
                    const savedText = text;
                    const savedRect = { ...rect };
                    
                    // IMMEDIATELY clear selection to prevent iOS menu from appearing
                    selection.removeAllRanges();
                    
                    // Restore selection using multiple microtasks to beat iOS menu timing
                    Promise.resolve().then(() => {
                        return Promise.resolve();
                    }).then(() => {
                        try {
                            selection.removeAllRanges();
                            selection.addRange(savedRange);
                            
                            // Show custom tooltip
                            setTooltipPos({
                                top: savedRect.top + window.scrollY - 40,
                                left: savedRect.left + window.scrollX,
                            });

                            setSelectedText(savedText);
                            setShowTooltip(true);
                            
                            isHandlingSelection = false;
                        } catch (e) {
                            // If range is invalid, try again
                            setTimeout(() => {
                                try {
                                    if (selection.rangeCount === 0 && savedRange) {
                                        selection.addRange(savedRange);
                                    }
                                    isHandlingSelection = false;
                                } catch (e2) {
                                    isHandlingSelection = false;
                                }
                            }, 10);
                        }
                    });
                } else {
                    setShowTooltip(false);
                }
            } else {
                setShowTooltip(false);
            }
        };

        // Only add selectionchange listener, no other listeners that might interfere
        document.addEventListener('selectionchange', handleSelectionChange);

        // Add mouseup listener to prevent selection from clearing on the contentRef div
        const handleMouseUp = (e: MouseEvent) => {
            // Prevent default if clicking on the content div to preserve selection
            const target = e.target as HTMLElement;
            if (contentRef.current && contentRef.current.contains(target)) {
                // Don't prevent default, just ensure selection is preserved
            }
        };

        // Prevent iOS default text selection menu - intercept immediately on touchend
        const handleTouchEnd = (e: TouchEvent) => {
            // Don't prevent default - allow selection to happen naturally
            // The selectionchange handler will intercept it immediately
        };

        // Prevent iOS context menu on long press but allow text selection
        const handleTouchStart = (e: TouchEvent) => {
            // Don't prevent default - we need to allow text selection to work
            // Only prevent if it's a very long press (context menu trigger)
        };
        
        // Intercept touchmove to prevent default behavior that might trigger iOS menu
        const handleTouchMove = (e: TouchEvent) => {
            // Allow normal scrolling and selection
        };

        // Additional handler to prevent iOS menu on contextmenu (iOS Safari)
        const handleContextMenu = (e: Event) => {
            if (contentRef.current && contentRef.current.contains(e.target as Node)) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        };

        // Critical: Prevent iOS menu by clearing and restoring selection immediately
        const preventIOSMenu = (e: TouchEvent) => {
            // Use requestAnimationFrame for immediate execution
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const selection = window.getSelection();
                    if (selection && selection.toString().length > 0 && contentRef.current?.contains(e.target as Node)) {
                        // Force clear and restore to prevent iOS menu
                        const range = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
                        if (range) {
                            selection.removeAllRanges();
                            requestAnimationFrame(() => {
                                try {
                                    selection.addRange(range);
                                } catch (e) {
                                    // Range might be invalid, ignore
                                }
                            });
                        }
                    }
                });
            });
        };

        if (contentRef.current) {
            contentRef.current.addEventListener('mouseup', handleMouseUp);
            contentRef.current.addEventListener('touchend', handleTouchEnd, { passive: true });
            contentRef.current.addEventListener('touchend', preventIOSMenu, { passive: true });
            contentRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
            contentRef.current.addEventListener('touchmove', handleTouchMove, { passive: true });
            contentRef.current.addEventListener('contextmenu', handleContextMenu, { capture: true });
            // Also add to document to catch iOS menu attempts
            document.addEventListener('contextmenu', handleContextMenu, { capture: true });
        }

        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
            document.removeEventListener('selectionchange', handleSelectionChange);
            if (contentRef.current) {
                contentRef.current.removeEventListener('mouseup', handleMouseUp);
                contentRef.current.removeEventListener('touchend', handleTouchEnd);
                contentRef.current.removeEventListener('touchend', preventIOSMenu);
                contentRef.current.removeEventListener('touchstart', handleTouchStart);
                contentRef.current.removeEventListener('touchmove', handleTouchMove);
                contentRef.current.removeEventListener('contextmenu', handleContextMenu, { capture: true });
            }
        };
    }, [htmlContent]); // Add htmlContent as dependency

    const handleTooltipAction = (action: string, text: string) => {
        console.log('action', action);
        console.log('text', text);
        setShowTooltip(false);
        // Don't clear selection immediately, let it fade naturally
        setTimeout(() => {
            window.getSelection()?.removeAllRanges();
        }, 200);
    };

    return (
        <>
            <div className="prose bg-slate-100 selectable-text" ref={containerRef} style={{
                position: 'relative', // required for overlay alignment
                padding: '10px 15px',
                overflowY: 'auto',
                maxHeight: '85vh',
                backgroundColor: '#f8fafc',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                touchAction: 'auto',
                fontSize: '15px',
                paddingBottom: '200px',
                WebkitTouchCallout: 'none' as any,
            }}>
                <div
                    ref={contentRef}
                    className="html-div origin-top-left selectable-text"
                    style={{
                        transform: `scale(${1})`,
                        transformOrigin: 'center top',
                        userSelect: 'text' as any,
                        WebkitUserSelect: 'text' as any,
                        MozUserSelect: 'text' as any,
                        msUserSelect: 'text' as any,
                        touchAction: 'pan-y' as any,
                        cursor: 'text',
                        WebkitTouchCallout: 'none' as any,
                        touchCallout: 'none' as any,
                    } as React.CSSProperties}
                    onTouchEnd={(e) => {
                        // Immediate prevention
                        const selection = window.getSelection();
                        if (selection && selection.toString().length > 0) {
                            const range = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
                            if (range) {
                                selection.removeAllRanges();
                                setTimeout(() => {
                                    try {
                                        selection.addRange(range);
                                    } catch (err) {
                                        // Ignore
                                    }
                                }, 0);
                            }
                        }
                    }}
                />

                {showTooltip &&
                    ReactDOM.createPortal(
                        <SelectionTooltip
                            top={tooltipPos.top}
                            left={tooltipPos.left}
                            selectedText={selectedText}
                            onAction={handleTooltipAction}
                        />,
                        document.body
                    )}
            </div >

            <AudioComponent
                text={htmlContent || ''}
                language={'en'}
                clickToPlayAndPause={isPlaying}
                contentRef={contentRef as React.RefObject<HTMLDivElement>}
            />
        </>
    );
};

export default PadaiHtmlContentViwer;

