// import { useEffect, useRef, useState } from 'react';

// import ReactDOM from 'react-dom';
// import SelectionTooltip from '../SelectionTooltip/SelectionTooltip';
// import AudioComponent from '../Audio/Audio';

// const PadaiHtmlContentViwer = ({ url }: { url: string }) => {
//     const [htmlContent, setHtmlContent] = useState('');
//     const containerRef = useRef<HTMLDivElement>(null);
//     const contentRef = useRef<HTMLDivElement>(null);
//     const [isPlaying, setIsPlaying] = useState(false);


//     //-------------- Tooltip for text selection -----------------//
//     const textRef = useRef<HTMLDivElement>(null);
//     const tooltipRef = useRef<HTMLDivElement>(null);

//     const [showTooltip, setShowTooltip] = useState(false);
//     const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
//     const [selectedText, setSelectedText] = useState('');

//     const clickedOnTooltipRef = useRef(false);
//     // 🧩 Load and sanitize HTML (strip <html>, <head>, <body>)
//     useEffect(() => {
//         if (!url) {
//             setHtmlContent('');
//             return;
//         }
//         let cancelled = false;
//         fetch(url)
//             .then((r) => r.text())
//             .then((rawHtml) => {
//                 if (cancelled) return;
//                 const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
//                 const cleanHtml = bodyMatch ? bodyMatch[1] : rawHtml;
//                 setHtmlContent(cleanHtml);
//             })
//             .catch(() => {
//                 if (!cancelled)
//                     setHtmlContent('<div style="padding:12px">Failed to load content.</div>');
//             });
//         return () => {
//             cancelled = true;
//         };
//     }, [url]);
//     useEffect(() => {
//         const preventContextMenu = (e: Event) => e.preventDefault();
//         document.addEventListener('contextmenu', preventContextMenu);

//         // Force text selection on innerHTML content
//         const forceSelectionStyles = () => {
//             if (contentRef.current) {
//                 const style = document.createElement('style');
//                 style.id = 'force-selection-styles';
//                 style.textContent = `
//                     .html-div * {
//                         -webkit-user-select: text !important;
//                         -moz-user-select: text !important;
//                         -ms-user-select: text !important;
//                         user-select: text !important;
//                     }
//                 `;
//                 if (!document.getElementById('force-selection-styles')) {
//                     document.head.appendChild(style);
//                 }
//             }
//         };

//         forceSelectionStyles();

//         const handleSelectionChange = () => {
//             const selection: any = window.getSelection();
//             const text = selection?.toString();

//             if (text && text.trim().length > 0 && selection.rangeCount > 0) {
//                 const range = selection.getRangeAt(0);
//                 const rect = range.getBoundingClientRect();

//                 // Check if selection is within our content area (more lenient check)
//                 const containerRect = containerRef.current?.getBoundingClientRect();
//                 const isWithinContent = containerRect && 
//                     rect.top >= (containerRect.top - 20) && 
//                     rect.bottom <= (containerRect.bottom + 20) &&
//                     rect.left >= (containerRect.left - 20) && 
//                     rect.right <= (containerRect.right + 20);
                
//                 if (isWithinContent) {
//                     setTooltipPos({
//                         top: rect.top + window.scrollY - 40,
//                         left: rect.left + window.scrollX,
//                     });

//                     setSelectedText(text);
//                     setShowTooltip(true);
//                 } else {
//                     setShowTooltip(false);
//                 }
//             } else {
//                 setShowTooltip(false);
//             }
//         };

//         // Only add selectionchange listener, no other listeners that might interfere
//         document.addEventListener('selectionchange', handleSelectionChange);

//         // Add mouseup listener to prevent selection from clearing on the contentRef div
//         const handleMouseUp = (e: MouseEvent) => {
//             // Prevent default if clicking on the content div to preserve selection
//             const target = e.target as HTMLElement;
//             if (contentRef.current && contentRef.current.contains(target)) {
//                 // Don't prevent default, just ensure selection is preserved
//             }
//         };

//         if (contentRef.current) {
//             contentRef.current.addEventListener('mouseup', handleMouseUp);
//         }

//         return () => {
//             document.removeEventListener('contextmenu', preventContextMenu);
//             document.removeEventListener('selectionchange', handleSelectionChange);
//             if (contentRef.current) {
//                 contentRef.current.removeEventListener('mouseup', handleMouseUp);
//             }
//         };
//     }, [htmlContent]); // Add htmlContent as dependency

//     const handleTooltipAction = (action: string, text: string) => {
//         console.log('action', action);
//         console.log('text', text);
//         setShowTooltip(false);
//         // Don't clear selection immediately, let it fade naturally
//         setTimeout(() => {
//             window.getSelection()?.removeAllRanges();
//         }, 200);
//     };

//     return (
//         <>
//             <div className="prose bg-slate-100 selectable-text" ref={containerRef} style={{
//                 position: 'relative', // required for overlay alignment
//                 padding: '10px 15px',
//                 overflowY: 'auto',
//                 maxHeight: '85vh',
//                 backgroundColor: '#f8fafc',
//                 userSelect: 'text',
//                 WebkitUserSelect: 'text',
//                 touchAction: 'auto',
//                 fontSize: '15px',
//             }}>

//                 <p>Lorem20 ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>

//                 <div
//                     ref={contentRef}
//                     className="html-div origin-top-left selectable-text"
//                     style={{
//                         transform: `scale(${1})`,
//                         transformOrigin: 'center top',
//                         userSelect: 'text' as any,
//                         WebkitUserSelect: 'text' as any,
//                         MozUserSelect: 'text' as any,
//                         msUserSelect: 'text' as any,
//                         touchAction: 'pan-y' as any,
//                         cursor: 'text',
//                         WebkitTouchCallout: 'default' as any,
//                     }}
//                     dangerouslySetInnerHTML={{ __html: htmlContent }}
//                 />

//                 {showTooltip &&
//                     ReactDOM.createPortal(
//                         <SelectionTooltip
//                             top={tooltipPos.top}
//                             left={tooltipPos.left}
//                             selectedText={selectedText}
//                             onAction={handleTooltipAction}
//                         />,
//                         document.body
//                     )}
//             </div >

//             <AudioComponent
//                 text={htmlContent || ''}
//                 language={'en'}
//                 clickToPlayAndPause={isPlaying}
//                 contentRef={contentRef as React.RefObject<HTMLDivElement>}
//             />
//         </>
//     );
// };

// export default PadaiHtmlContentViwer;


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

        // Force text selection on innerHTML content
        const forceSelectionStyles = () => {
            if (contentRef.current) {
                const style = document.createElement('style');
                style.id = 'force-selection-styles';
                style.textContent = `
                    .html-div * {
                        -webkit-user-select: text !important;
                        -moz-user-select: text !important;
                        -ms-user-select: text !important;
                        user-select: text !important;
                    }
                `;
                if (!document.getElementById('force-selection-styles')) {
                    document.head.appendChild(style);
                }
            }
        };

        forceSelectionStyles();

        const handleSelectionChange = () => {
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
                    setTooltipPos({
                        top: rect.top + window.scrollY - 40,
                        left: rect.left + window.scrollX,
                    });

                    setSelectedText(text);
                    setShowTooltip(true);
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

        if (contentRef.current) {
            contentRef.current.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('selectionchange', handleSelectionChange);
            if (contentRef.current) {
                contentRef.current.removeEventListener('mouseup', handleMouseUp);
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
                paddingBottom: '200px'
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
                        WebkitTouchCallout: 'default' as any,
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

