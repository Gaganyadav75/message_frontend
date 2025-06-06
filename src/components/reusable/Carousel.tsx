import { ArrowLeftIcon, ArrowRightIcon } from '@mui/x-date-pickers/icons';
import React, { useState, useEffect, useCallback } from 'react'
import { publish } from '../../handlers/reusable/Event';

type CarouselProps = {
    children: React.ReactNode;
    autoSlide?: boolean;
    autoSlideInterval?: number;
    className?:string;
    selectedItem?:number
};

const Carousel: React.FC<CarouselProps> = ({ children, autoSlide = false, autoSlideInterval = 3000,selectedItem=0 }) => {
    const slides = React.Children.toArray(children); // Converts children to an array
    const [curr, setCurr] = useState(selectedItem);

    const prev = () => setCurr((curr) => (curr != 0 ? curr - 1:curr-0 ));

   const next = useCallback(() => {
        setCurr((curr) => (curr !== slides.length - 1 ? curr + 1 : curr));
    }, [slides.length]);

    useEffect(()=>{
        publish('file-index-change',curr)
    },[curr])

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, [autoSlide, autoSlideInterval,next]); 

    return (
        <div className={'overflow-hidden relative w-full h-full '}>
            {/* Slides Container */}
            <div className='flex flex-nowrap w-full h-full transition-transform ease-out duration-500' style={{ transform: `translateX(-${curr * 100}%)` }}>
                {slides}
            </div>

            {/* Navigation Arrows */}
    
                <button title='prev' onClick={prev} className='absolute opacity-50 hover:opacity-100 left-4 top-1/2 -translate-y-1/2 p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white'>
                    <ArrowLeftIcon />
                </button>
                <button title='next' onClick={next} className='absolute opacity-50 hover:opacity-100 right-4 top-1/2 -translate-y-1/2  p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white'>
                    <ArrowRightIcon />
                </button>

            {/* Dots for Slide Indicators */}
            <div className='absolute bottom-4 right-0 left-0'>
                <div className='flex items-center justify-center gap-2'>
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`transition-all w-1.5 h-1.5 bg-white rounded-full ${curr === i ? "p-0.5" : "bg-opacity-50"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Carousel;
