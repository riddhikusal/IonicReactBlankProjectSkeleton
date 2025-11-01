import { JSX, useEffect, useRef, useState } from "react";
import { Synthesizeaudio } from "../../../services/homeService";
import { useChapterStore } from "../../../services/store/chapter.store";

export interface AudioProps {
    text: string;
    language: string;
    clickToPlayAndPause: boolean;
    contentRef: React.RefObject<HTMLDivElement | null>;
}

const AudioComponent = ({ text, language, clickToPlayAndPause, contentRef }: AudioProps) => {
    // const containerRef = useRef<HTMLDivElement>(null);
    // const contentRef = useRef<HTMLDivElement>(null);
    const chapterInfo = useChapterStore((state) => state.chapterInfo);
    const setAudioIsPlaying = useChapterStore((state) => state.setAudioIsPlaying);
    const setContentLoaded = useChapterStore((state) => state.setContentLoaded);
    const setContentLoading = useChapterStore((state) => state.setContentLoading);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoop, setIsLoop] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);


    const onTimeUpdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
        setDuration(audioRef.current?.duration || 0);
    }
    const onLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
    }


    const base64ToArrayBuffer = (base64: string) => {
        base64 = base64.replace(/_/g, "/").replace(/-/g, "+");
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
        return bytes.buffer;
    };

    const startSpeech = async (text: string, language: string) => {
        console.log('[AUDIO COMPONENT] startSpeech');
        if (!text.trim()) {
            alert('Please enter text to generate audio.');
            return;
        }

        setLoadingAudio(true);
        // setContentLoading?.(true);

        try {

            const payload = {
                text, language
            };
            const response = await Synthesizeaudio(payload);


            const blob = new Blob([new Uint8Array(base64ToArrayBuffer(response.audio))], {
                type: 'audio/mpeg',
            });

            if (audioRef.current) {
                audioRef.current.src = URL.createObjectURL(blob);
                // setIsPlaying(true);
                // setIsPaused(false);
                // setAudioIsPlaying?.(true);
                setContentLoaded?.(true);
                audioRef.current.play();
            }
        } catch (err) {
            console.log('[AUDIO COMPONENT] error', err);
            alert('Error generating speech.');
        } finally {
            setLoadingAudio(false);
            setContentLoading?.(false);
        }
    };

    const toggleSpeech = () => {
        console.log('[AUDIO COMPONENT] toggleSpeech');
        const audio = audioRef.current;
        if (!audio) return;

        if (!chapterInfo.contentLoaded) {
            audio.pause();
            setIsPaused(true);
        }
        if (isPlaying && !isPaused) {
            audio.pause();
            setIsPaused(true);
        } else if ((isPlaying && isPaused) || chapterInfo.contentLoaded) {
            audio.play();
            setIsPaused(false);
        } else {
            // if (contentRef && contentRef.current && contentRef.current.innerText) {
            //     const text = contentRef.current.innerText || '';
            //     if (text && chapterInfo.contentLoading) startSpeech(text, language);
            // }
        }
    };


    const textToSpeachApiCall = () => {
        if (contentRef && contentRef.current && contentRef.current.innerText) {
            const text = contentRef.current.innerText || '';
            if (text && chapterInfo.contentLoading) startSpeech(text, language);
        }
    }

    const audioPlayingStartOrClear = ()=>{
        const audio = audioRef.current;
        if (!audio) return;
        if (chapterInfo.contentLoaded) {
            setIsPaused(false);
            setAudioIsPlaying?.(true);
        } else {
            setIsPaused(true);
            setAudioIsPlaying?.(false);
        }
    }

    const audioPlayOrPause = ()=>{
        console.log('[AUDIO COMPONENT] audioPlayOrPause');
        const audio = audioRef.current;
        if (!audio) return;
        function play(audio:any){
            audio.play();
         }
         function pause(audio:any){
            audio.pause();
         }
        if(!chapterInfo.audioIsPlaying){
            pause(audio);
            setIsPaused(true);
            return;
        }
        if(chapterInfo.audioIsPlaying){
            play(audio);
            setIsPaused(false);
            return;
        }
        // if (!isPaused) {
        //     pause(audio);
        //     setIsPaused(true);
        // } else if (isPaused) {
        //     play(audio);
        //     setIsPaused(false);
        // }else{
           
        // }
    }

    useEffect(() => {
        console.log('[AUDIO COMPONENT] chapterInfo.contentLoading', chapterInfo.contentLoading);
        if (chapterInfo.contentLoading) textToSpeachApiCall();
    }, [chapterInfo.contentLoading]);
    useEffect(() => {
        audioPlayingStartOrClear();
    }, [chapterInfo.contentLoaded]);
    useEffect(() => {
        audioPlayOrPause();
    }, [chapterInfo.audioIsPlaying]);

    useEffect(() => {
        // toggleSpeech();
        console.log('[AUDIO COMPONENT] chapterInfo.audioIsPlaying', chapterInfo.audioIsPlaying);
        console.log('[AUDIO COMPONENT] chapterInfo.contentLoaded', chapterInfo.contentLoaded);
    }, [chapterInfo.audioIsPlaying, chapterInfo.contentLoaded,]);

    return (<audio
        ref={audioRef}
        hidden
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
    />);
}

export default AudioComponent;