// InfiniteCarousel.tsx
import React, { useCallback, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';

interface InfiniteCarouselProps {
  carouselImages: string[];
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  carouselImages
}) => {
  const slickRef = useRef<Slider | null>(null);
  const previous = useCallback(() => slickRef.current?.slickPrev(), []);
  const next = useCallback(() => slickRef.current?.slickNext(), []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 8000,
    draggable: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    appendDots: (dots: any) => (
      <div
        style={{
          width: '100%',
          position: 'absolute',
          bottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ul> {dots} </ul>
      </div>
    ),
    dotsClass: 'dots_custom'
  };

  return (
    <CarouselContainer>
      <Slider {...settings} ref={slickRef}>
        {carouselImages.map((image, index) => (
          <CarouselImage
            key={index}
            src={image}
            alt={`Carousel ${index + 1}`}
          />
        ))}
      </Slider>
      <CarouselButtons>
        <ArrowButton onClick={previous}>
          <img src={'/assets/goprev.png'} alt={'pre-arrow'} />
        </ArrowButton>
        <ArrowButton onClick={next}>
          <img src={'/assets/gonext.png'} alt={'next-arrow'} />
        </ArrowButton>
      </CarouselButtons>
    </CarouselContainer>
  );
};

export default InfiniteCarousel;

const CarouselContainer = styled.div`
  position: relative;
  width: 1440px;
  height: 401px;
  justify-content: center;
  align-items: center;
  margin: 0px auto;
  overflow: hidden;
  .dots_custom {
    display: inline-block;
    vertical-align: middle;
    margin: auto 0;
    padding: 0;
  }

  .dots_custom li {
    list-style: none;
    cursor: pointer;
    display: inline-block;
    margin: 0 6px;
    padding: 0;
  }

  .dots_custom li button {
    border: none;
    background: #d1d1d1;
    color: transparent;
    cursor: pointer;
    display: block;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    padding: 0;
  }

  .dots_custom li.slick-active button {
    background-color: #08c1ce;
  }
`;

const CarouselImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border: 2px solid red;
  box-sizing: border-box;
`;
const CarouselButtons = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

const ArrowButton = styled.div`
  img {
    width: 50px;
    height: 50px;
    cursor: pointer;
    user-select: none;
  }
`;
