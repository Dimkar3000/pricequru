import { request } from './agent';

function addPrice({
  price,
  dateFrom,
  dateTo,
  productId,
  shopId
}, token) {
  const data = {
    dateFrom,
    dateTo,
    price,
    productId,
    shopId
  };
  return request({
    url: 'prices',
    method: 'POST',
    data,
    token
  });
}
function getPricesForProduct({
  start,
  count,
  productId,
  lat,
  lng,
  sort,
  dist
}) {
  const params = {
    start,
    count,
    products: productId,
    sort
  };

  if (lat) {
    params.geoLat = lat;
  }
  if (lng) {
    params.lng = lng;
  }
  if (dist) {
    params.geoDist = dist;
  }

  return request({
    url: 'prices',
    method: 'GET',
    params
  });
}

function getPricesForShop({
  start,
  count,
  shopId
}) {
  const params = {
    start,
    count,
    shops: shopId
  };

  return request({
    url: 'prices',
    method: 'GET',
    params
  });
}

const pricesService = { addPrice, getPricesForProduct, getPricesForShop };

export default pricesService;
