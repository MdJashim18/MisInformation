import React from 'react';
import BaImg1 from '../../../assets/b1.PNG';
import BaImg2 from '../../../assets/b2.PNG';
import BaImg3 from '../../../assets/b3.PNG';
import BaImg4 from '../../../assets/b4.PNG';

const Banner = () => {
    return (
        <div className="w-full mx-auto">
            <div className="carousel w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Slide 1: Online Courses */}
                <div id="slide1" className="carousel-item relative w-full">
                    <img src={BaImg1} className="w-full object-cover" alt="Online Courses" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-30">
                        <a href="#slide4" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❮</a>
                        <a href="#slide2" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❯</a>
                    </div>
                </div>

                {/* Slide 2: Expert Instructors */}
                <div id="slide2" className="carousel-item relative w-full">
                    <img src={BaImg2} className="w-full object-cover" alt="Expert Instructors" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-30">
                        <a href="#slide1" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❮</a>
                        <a href="#slide3" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❯</a>
                    </div>
                </div>

                {/* Slide 3: Interactive Learning */}
                <div id="slide3" className="carousel-item relative w-full">
                    <img src={BaImg3} className="w-full object-cover" alt="Interactive Learning" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-30">
                        <a href="#slide2" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❮</a>
                        <a href="#slide4" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❯</a>
                    </div>
                </div>

                {/* Slide 4: Certification */}
                <div id="slide4" className="carousel-item relative w-full">
                    <img src={BaImg4} className="w-full object-cover" alt="Get Certified" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-30">
                        <a href="#slide3" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❮</a>
                        <a href="#slide1" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❯</a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Banner;