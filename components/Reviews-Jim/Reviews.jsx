/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import { useTracking } from 'react-tracking';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';

import ReviewsList from './components/ReviewsList';
import ReviewsBreakdown from './components/ReviewsBreakdown';

const Reviews = ({
  productId, setProductRating, reviewsRef, productName,
}) => {
  // const { trackEvent } = useTracking({ module: 'Reviews' });
  const [productReviews, setProductReviews] = useState([]);
  const [productMeta, setProductMeta] = useState(null);
  const [sortStatus, setSortStatus] = useState('relevant');
  const [renderToggle, setRenderToggle] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [ratingsLength, setRatingsLength] = useState(selectedRatings.length);
  const [getToggle, setGetToggle] = useState(false);

  const getProductReviews = (product, sort, count = 100) => {
    const api = `http://3.12.241.25:5000/reviews/${product}`;
    // const api = `http://localhost:5000/reviews/${product}`;
    console.log('product: ', product);
    // if (count) {
    //   api += `&count=${count}`;
    // }

    const options = {
      url: api,
      method: 'get',
      headers: {
        Authorization: config.TOKEN,
      },
    };

    axios(options)
      .then((res) => {
        console.log({res});
        setProductReviews(res.data);
      })
      .then(() => {
        setGetToggle(false);
      })
      .then(() => {
        setRenderToggle(true);
      })
      .catch((err) => { console.log('GET REVIEWS ERROR ', err); });
  };

  const getProductMeta = (product) => {
    const api = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/meta';
    const options = {
      url: `${api}?product_id=${product}`,
      method: 'get',
      headers: {
        Authorization: config.TOKEN,
      },
    };

    axios(options)
      .then((res) => {
        setProductMeta(res.data);
      })
      .catch((err) => { console.log('GET META ERROR ', err); });
  };

  const handleSortChange = (e) => {
    e.preventDefault();
    setSortStatus(e.target.value);
  };

  useEffect(() => {
    getProductReviews(productId, sortStatus);
    getProductMeta(productId);
  }, [sortStatus, productId, getToggle]);

  return (
    <Container className="review-widget">
      <h5 className="reviews-title" ref={reviewsRef}>Ratings & Reviews</h5>
      <Row>
        <Col xs={4}>
          {(productReviews && productMeta) ? (
            <ReviewsBreakdown
              productMeta={productMeta}
              setProductRating={setProductRating}
              selectedRatings={selectedRatings}
              setSelectedRatings={setSelectedRatings}
              setRatingsLength={setRatingsLength}
            />
          ) : null}
        </Col>
        <Col>
          {(productReviews && productMeta) ? (
            <div style={{ overflowY: 'scroll', height: '950px' }}>
              <ReviewsList
                productReviews={productReviews}
                characteristics={productMeta.characteristics}
                sortStatus={sortStatus}
                handleSortChange={handleSortChange}
                renderToggle={renderToggle}
                setRenderToggle={setRenderToggle}
                selectedRatings={selectedRatings}
                ratingsLength={ratingsLength}
                productName={productName}
                productId={productId}
                setGetToggle={setGetToggle}
              />
            </div>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

Reviews.propTypes = {
  productId: PropTypes.number.isRequired,
  setProductRating: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  reviewsRef: PropTypes.object,
  productName: PropTypes.string.isRequired,
};

Reviews.defaultProps = {
  reviewsRef: {},
};

export default Reviews;
