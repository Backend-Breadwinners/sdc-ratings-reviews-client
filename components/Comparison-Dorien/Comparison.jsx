import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Carousel from 'react-bootstrap/Carousel';

const Comparison = () => {

  const [products, setProducts] = useState([]);

  const getProducts = () => {
    let options = {
      method: 'get',
      url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products',
      headers: {
        'Authorization': config.TOKEN
      }
    }
    axios(options)
      .then((result) => {
        setProducts(result.data);
      })
      .then(() => {
        // getProductImg();
      })
      .catch((err) => {
        console.log(err);
      })

  };

  const [productImg, setProductImg] = useState({});

  const getProductImg = () => {
    let queryImgArray = []
    let obj = {};
    products.map((product) => (
      queryImgArray.push(product.id)
    ));

    queryImgArray.map((id) => {
      let options = {
        method: 'get',
        url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products/${id}/styles`,
        headers: {
          'Authorization': config.TOKEN
        }
      }
      axios(options)
        .then((result) => {
          obj[id] = result.data.results[0].photos[0].url;
          if (obj[id] === null) obj[id] = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22263%22%20height%3D%22160%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20263%20160%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_177e4e6d2c3%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2C%26quot%3BLiberation%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A13pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_177e4e6d2c3%22%3E%3Crect%20width%3D%22263%22%20height%3D%22160%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2297.25%22%20y%3D%2286.15%22%3E263x160%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
        })
        .catch((err) => {
          console.log(err);
        })
    })
    setProductImg(obj);
  }


  useEffect(() => {
    getProducts()
  }, []);



  return (
    <div>
      Comparison Widget
      {/* {console.log(productImg)} */}

      Related Products
      {productImg &&
      <CardGroup className="related-products-group">
        {products.map((item, index) => (
          <Card key={index} className="related-products" style={{ width: '5rem' }}>
            <Card.Img variant="top" src={productImg[item.id.toString()]} className="related-image" />
            <Card.Title>{item.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{item.category}</Card.Subtitle>

          </Card>))}

      </CardGroup>
      }
      <style>
        {`
          .related-image {
            height: 160px;
          }

          .related-products {
            margin: 10px;
            box-shadow: 0.5px 0.5px 0.5px 0.5px grey;
            border-color: grey;
          }
          .related-products-group {

          }
          `}
      </style>
    </div>
  );
};

export default Comparison;