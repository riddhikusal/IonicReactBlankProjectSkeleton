import { useEffect, useRef, useState } from 'react';
import AudioComponent from '../Audio/Audio';

const PadaiHtmlContentViwer = ({ url }: { url: string }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

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
            <div className="prose bg-slate-100" ref={containerRef} style={{
                overflow: 'auto',
                fontSize: '14px',
                padding: '1px 15px',
                paddingTop: '7px',
                marginBottom: '150px'
            }}>
                <div
                    ref={contentRef}
                    className="html-div origin-top-left user-select"
                    style={{ transform: `scale(${1})`, transformOrigin: 'center top' }}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
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