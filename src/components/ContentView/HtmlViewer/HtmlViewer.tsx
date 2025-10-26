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
    const textRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = useState('');

    const clickedOnTooltipRef = useRef(false);

    useEffect(() => {
        const preventContextMenu = (e: Event) => e.preventDefault();
        document.addEventListener('contextmenu', preventContextMenu);

        const handleSelectionChange = () => {
            const selection: any = window.getSelection();
            const text = selection?.toString();

            if (text && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // Check if selection is within our content area
                const containerRect = containerRef.current?.getBoundingClientRect();
                if (containerRect && 
                    rect.top >= containerRect.top && 
                    rect.bottom <= containerRect.bottom &&
                    rect.left >= containerRect.left && 
                    rect.right <= containerRect.right) {

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

        // Add event listeners to both document and container
        document.addEventListener('selectionchange', handleSelectionChange);

        // Also add mouseup event to handle selection in dynamic content
        const handleMouseUp = () => {
            // Small delay to ensure selection is complete
            setTimeout(handleSelectionChange, 10);
        };

        // Add selection event specifically for the content area
        const handleContentSelection = (e: Event) => {
            e.stopPropagation();
            setTimeout(handleSelectionChange, 10);
        };

        if (containerRef.current) {
            containerRef.current.addEventListener('mouseup', handleMouseUp);
            containerRef.current.addEventListener('selectstart', handleContentSelection);
        }

        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('selectionchange', handleSelectionChange);
            if (containerRef.current) {
                containerRef.current.removeEventListener('mouseup', handleMouseUp);
                containerRef.current.removeEventListener('selectstart', handleContentSelection);
            }
        };
    }, [htmlContent]); // Add htmlContent as dependency

    const handleTooltipAction = (action: string, text: string) => {
        alert(`${action} clicked for: "${text}"`);
        setShowTooltip(false);
        window.getSelection()?.removeAllRanges();
    };



    useEffect(() => {
        console.log('url', url);
        if (!url) {
            setHtmlContent('');
            return;
        }
        let isCancelled = false;
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load content: ${res.status}`);
                return res.text();
            })
            .then(html => {
                if (!isCancelled) setHtmlContent(html);
            })
            .catch(() => {
                if (!isCancelled) setHtmlContent('<div style="padding:12px">Failed to load content.</div>');
            });
        return () => { isCancelled = true; };
    }, [url]);
    return (
        <>
            <div className="prose bg-slate-100 selectable-text" ref={containerRef} style={{
                overflow: 'auto',
                fontSize: '14px',
                padding: '1px 15px',
                paddingTop: '7px',
                marginBottom: '150px'
            }}>

                <p>Lorem20 ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>

                <div
                    ref={contentRef}
                    className="html-div origin-top-left selectable-text"
                    style={{ 
                        transform: `scale(${1})`, 
                        transformOrigin: 'center top',
                        userSelect: 'text',
                        WebkitUserSelect: 'text',
                        MozUserSelect: 'text',
                        msUserSelect: 'text',
                        touchAction: 'auto',
                        cursor: 'text',
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
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


// import { useEffect, useRef, useState } from 'react';
// import ReactDOM from 'react-dom';
// import SelectionTooltip from '../SelectionTooltip/SelectionTooltip';

// const PadaiHtmlContentViwer = ({ url }: { url: string }) => {
//   const [htmlContent, setHtmlContent] = useState('');
//   const containerRef = useRef<HTMLDivElement>(null);
//   const overlayRef = useRef<HTMLDivElement>(null);
//   const lastRectsRef = useRef<DOMRect[]>([]);

//   const [showTooltip, setShowTooltip] = useState(false);
//   const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
//   const [selectedText, setSelectedText] = useState('');

//   // 🧩 Load and sanitize HTML (strip <html>, <head>, <body>)
//   useEffect(() => {
//     if (!url) {
//       setHtmlContent('');
//       return;
//     }
//     let cancelled = false;
//     fetch(url)
//       .then((r) => r.text())
//       .then((rawHtml) => {
//         if (cancelled) return;
//         const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
//         const cleanHtml = bodyMatch ? bodyMatch[1] : rawHtml;
//         setHtmlContent(cleanHtml);
//       })
//       .catch(() => {
//         if (!cancelled)
//           setHtmlContent('<div style="padding:12px">Failed to load content.</div>');
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [url]);

//   // 🧩 Selection & tooltip logic (overlay-based)
//   useEffect(() => {
//     const container = containerRef.current;
//     if (container) {
//       container.style.userSelect = 'text';
//       (container.style as any).webkitUserSelect = 'text';
//       container.style.touchAction = 'pan-y'; // Allow vertical scrolling
//     }

//     // Prevent default context menu on long press (but allow scrolling)
//     const preventContextMenu = (e: Event) => {
//       // Only prevent context menu, not scrolling
//       if (e.type === 'contextmenu') {
//         e.preventDefault();
//         e.stopPropagation();
//         return false;
//       }
//     };

//     const handleSelectionEnd = () => {
//       const sel = window.getSelection();
//       if (!sel || sel.rangeCount === 0) return;
//       const text = sel.toString().trim();
//       if (!text) return;

//       const range = sel.getRangeAt(0);
//       const rects = Array.from(range.getClientRects());
//       drawOverlay(rects); // ✅ draw yellow highlight boxes
//       lastRectsRef.current = rects;

//       const rect = range.getBoundingClientRect();
//       setTooltipPos({
//         top: rect.top + window.scrollY - 45,
//         left: rect.left + window.scrollX + rect.width / 2,
//       });
//       setSelectedText(text);
//       setShowTooltip(true);
//     };

//     const handleMouseUp = () => {
//       setTimeout(handleSelectionEnd, 10);
//     };

//     const handleTouchEnd = (e: TouchEvent) => {
//       // Don't prevent default to allow scrolling
//       setTimeout(handleSelectionEnd, 100);
//     };

//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         showTooltip &&
//         containerRef.current &&
//         !containerRef.current.contains(e.target as Node)
//       ) {
//         clearOverlay();
//         setShowTooltip(false);
//       }
//     };

//     const handleScroll = () => {
//       if (lastRectsRef.current.length) {
//         // redraw overlay on scroll
//         drawOverlay(lastRectsRef.current);
//       }
//     };

//     // Add event listeners
//     document.addEventListener('mouseup', handleMouseUp);
//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('contextmenu', preventContextMenu);
//     document.addEventListener('touchend', handleTouchEnd, { passive: true });
//     container?.addEventListener('scroll', handleScroll);

//     return () => {
//       document.removeEventListener('mouseup', handleMouseUp);
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('contextmenu', preventContextMenu);
//       document.removeEventListener('touchend', handleTouchEnd);
//       container?.removeEventListener('scroll', handleScroll);
//     };
//   }, [showTooltip]);

//   // 🟡 Draw highlight overlays relative to container scroll
//   function drawOverlay(rects: DOMRect[]) {
//     clearOverlay();
//     const overlay = overlayRef.current;
//     const container = containerRef.current;
//     if (!overlay || !container) return;

//     const containerRect = container.getBoundingClientRect();

//     rects.forEach((r) => {
//       const mark = document.createElement('div');
//       mark.style.position = 'absolute';
//       mark.style.top = `${r.top - containerRect.top + container.scrollTop}px`;
//       mark.style.left = `${r.left - containerRect.left + container.scrollLeft}px`;
//       mark.style.width = `${r.width}px`;
//       mark.style.height = `${r.height}px`;
//       mark.style.background = 'rgba(255,230,120,0.6)';
//       mark.style.borderRadius = '2px';
//       mark.style.pointerEvents = 'none';
//       overlay.appendChild(mark);
//     });
//   }

//   function clearOverlay() {
//     if (overlayRef.current) overlayRef.current.innerHTML = '';
//   }

//   const handleTooltipAction = (action: string, text: string) => {
//     alert(`${action} on: ${text}`);
//     clearOverlay();
//     setShowTooltip(false);
//   };

//   return (
//     <>
//        <div
//          ref={containerRef}
//          style={{
//            position: 'relative', // required for overlay alignment
//            padding: '10px 15px',
//            overflowY: 'auto',
//            maxHeight: '85vh',
//            backgroundColor: '#f8fafc',
//            userSelect: 'text',
//            WebkitUserSelect: 'text',
//            touchAction: 'pan-y', // Allow vertical scrolling
//            WebkitTouchCallout: 'none', // Disable iOS callout
//            WebkitUserSelect: 'text', // Allow text selection
//            KhtmlUserSelect: 'text',
//            MozUserSelect: 'text',
//            msUserSelect: 'text',
//            fontSize: '15px',
//          }}
//        >


//         {/* Render fetched HTML */}
//         <div
//           className="html-content"
//           style={{ cursor: 'text', lineHeight: '1.6' }}
//           dangerouslySetInnerHTML={{ __html: htmlContent }}
//         />

//         {/* Highlight overlay layer */}
//         <div
//           ref={overlayRef}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             zIndex: 10,
//             pointerEvents: 'none',
//           }}
//         ></div>

//         {/* Floating tooltip */}
//         {showTooltip &&
//           ReactDOM.createPortal(
//             <SelectionTooltip
//               top={tooltipPos.top}
//               left={tooltipPos.left}
//               selectedText={selectedText}
//               onAction={handleTooltipAction}
//             />,
//             document.body
//           )}
//       </div>
//     </>
//   );
// };

// export default PadaiHtmlContentViwer;

// import AudioComponent from '../Audio/Audio';
// import { useEffect, useRef, useState } from 'react';
// import ReactDOM from 'react-dom';

// const PadaiHtmlContentViwer = ({ url }: { url: string }) => {
//     const [htmlContent, setHtmlContent] = useState('');
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [selectedText, setSelectedText] = useState('');

//     const contentRef = useRef<HTMLDivElement>(null);
//     const [isPlaying, setIsPlaying] = useState(false);

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

//     // 🧩 Selection & button logic (native browser selection)
//     useEffect(() => {
//         const handleMouseUp = () => {
//             const sel = window.getSelection();
//             if (!sel || sel.rangeCount === 0) return;
//             const text = sel.toString().trim();
//             if (!text) return;

//             setSelectedText(text);
//         };

//         document.addEventListener('mouseup', handleMouseUp);

//         return () => {
//             document.removeEventListener('mouseup', handleMouseUp);
//         };
//     }, []);

//     // 🧩 Handle "Ask AI" button click
//     const handleAskAI = () => {
//         alert(`You asked: "${selectedText}"`); // Replace with AI interaction logic
//     };

//     return (
//         <>
//             <div
//                 ref={containerRef}
//                 style={{
//                     position: 'relative', // required for overlay alignment
//                     padding: '10px 15px',
//                     overflowY: 'auto',
//                     maxHeight: '85vh',
//                     backgroundColor: '#f8fafc',
//                     userSelect: 'text',
//                     WebkitUserSelect: 'text',
//                     touchAction: 'auto',
//                     fontSize: '15px',
//                 }}
//             >
//                 <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
//                     Try selecting text below:
//                 </p>

//                 {/* Render fetched HTML */}
//                 <div
//                     className="html-content"
//                     style={{ cursor: 'text', lineHeight: '1.6' }}
//                     dangerouslySetInnerHTML={{ __html: htmlContent }}
//                 />

//                 {/* "Ask AI" Button */}
//                 {selectedText && (
//                     <button
//                         onClick={handleAskAI}
//                         style={{
//                             marginTop: '15px',
//                             padding: '10px 15px',
//                             backgroundColor: '#4CAF50',
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: '5px',
//                             cursor: 'pointer',
//                             fontSize: '16px',
//                         }}
//                     >
//                         Ask AI
//                     </button>
//                 )}
//             </div>
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
