import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import ReactImageMagnify from 'react-image-magnify';

import styles from './ImageGallery.module.css';

const ImageGallery = ({ styleInfo, setIsExpanded }) => {
  const [mainImageSrc, setMainImageSrc] = useState('');
  const [fullSizeImages, setFullSizeImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  const [view, setView] = useState('default');

  const [expandView, setExpandView] = useState(false);
  const [zoomView, setZoomView] = useState(false);
  const [carouselStyle, setCarouselStyle] = useState(styles.carousel);

  // ------------------ POPULATE STATE FUNCTIONS ------------------

  const getImages = () => {
    if (Object.entries(styleInfo).length > 0) {
      setMainImageSrc(styleInfo.photos[0].url);

      const newFullSizeImages = [];
      const newThumbnails = [];

      for (let i = 0; i < styleInfo.photos.length; i += 1) {
        newFullSizeImages.push(styleInfo.photos[i].url);
        newThumbnails.push(styleInfo.photos[i].thumbnail_url);
      }
      setFullSizeImages(newFullSizeImages);
      setThumbnails(newThumbnails);
    }
  };

  const renderThumbnails = () => {
    setIndex(0);

    const newSlides = [];

    for (let i = 0; i < thumbnails.length; i += 1) {
      const currentSlide = [];
      let j = i;
      let counter = 0;
      while (currentSlide.length < 7 && counter < thumbnails.length) {
        currentSlide.push({ src: thumbnails[j], index: j });
        j += 1;
        counter += 1;
        if (j === thumbnails.length) {
          j = 0;
        }
      }
      newSlides.push(currentSlide);
    }
    setSlides(newSlides);
  };

  // ------------------ EVENT HANDLERS ------------------

  const handleSelect = (selectedIndex) => {
    setMainImageSrc(fullSizeImages[selectedIndex]);
    setIndex(selectedIndex);
  };

  const expand = () => {
    switch (view) {
      case 'default':
        setCarouselStyle(styles.carouselExpanded);
        setView('expanded');
        setIsExpanded(true);
        break;
      case 'expanded':
        setCarouselStyle(styles.carouselZoomed);
        setView('zoomed');
        break;
      default:
        setCarouselStyle(styles.carousel);
        setView('default');
        setIsExpanded(false);
    }

    // if (!expandView) {
    //   // defaultView -> expandView
    //   setCarouselStyle(styles.carouselExpanded);
    //   setExpandView(!expandView);
    // } else if (!zoomView) {
    //   // expandedView -> zoomView
    //   setCarouselStyle(styles.carouselZoomed);
    //   setZoomView(!zoomView);
    // } else {
    //   // -> defaultView
    //   setCarouselStyle(styles.carousel);
    //   setExpandView(false);
    //   setZoomView(false);
    // }
  };

  // ------------------ CONDITIONAL RENDERING FUNCTIONS ------------------

  const renderCarouselItem = (image) => {
    switch (view) {
      case 'default':
      case 'expanded':
        return (
          <Image
            className={styles.mainImage}
            src={image || '/no-image-icon.png'}
            alt="main product image"
            onClick={expand}
            fluid
          />
        );
      case 'zoomed':
        return (
          <div onClick={expand} onKeyUp={expand} role="button" tabIndex={0}>
            <ReactImageMagnify
              // https://github.com/ethanselzer/react-image-magnify
              enlargedImagePosition="over"
              style={{ zIndex: 2 }}
              enlargedImageContainerStyle={{ width: '100vh', height: '100vh' }}
              enlargedImageStyle={{ position: 'fixed' }}
              {...{
                smallImage: {
                  alt: 'zoomed main product image',
                  isFluidWidth: true,
                  src: mainImageSrc || '/no-image-icon.png',
                },
                largeImage: {
                  src: mainImageSrc || '/no-image-icon.png',
                  width: 2400,
                  height: 3600,
                },
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    getImages();
  }, [styleInfo]);

  useEffect(() => {
    renderThumbnails();
  }, [thumbnails]);

  return (
    <>
      <div className={styles.mainImageContainer}>

        {/* Main Image: */}
        <Carousel
          className={carouselStyle}
          indicators={false}
          interval={null}
          activeIndex={index}
          onSelect={handleSelect}
        >

          {fullSizeImages.length > 0 ? fullSizeImages.map((image) => (
            <Carousel.Item key={image} style={{ height: '100%' }}>
              {renderCarouselItem(image)}
            </Carousel.Item>

          )) : null}
        </Carousel>
        <button
          onClick={() => {
            if (view === 'default') {
              expand();
            } else {
              setCarouselStyle(styles.carousel);
              setView('default');
            }
          }}
          className={styles.expandButton}
          type="button"
          aria-label="expand image"
        />
      </div>

      {/* Thumbnails: */}
      <Carousel
        indicators={false}
        // controls={false}
        interval={null}
        // onSelect={handleSelect}
        activeIndex={index}
        onSelect={handleSelect}
      >
        {slides.length > 0 ? slides.map((slide, i) => (
          <Carousel.Item key={i} style={{ height: '78px' }}>
            {slide.length > 0 ? slide.map((srcObj) => (
              <Image
                className={styles.thumbnailImage}
                src={srcObj.src || '/no-image-icon.png'}
                alt="thumbnail product image"
                // width={78}
                // height={78}
                // eslint-disable-next-line react/no-array-index-key
                key={srcObj.index}
                onClick={() => handleSelect(srcObj.index)}
                style={srcObj.index === index ? { 'border-style': 'double' } : null}
              />
            )) : null}
          </Carousel.Item>
        )) : null}
      </Carousel>
    </>
  );
};

ImageGallery.propTypes = {
  styleInfo: PropTypes.shape({
    photos: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      thumbnail_url: PropTypes.string,
    })),
  }),
};

ImageGallery.defaultProps = {
  styleInfo: null,
};

export default ImageGallery;
