import { request } from './agent';

function createProduct({
  name,
  description,
  category,
  tags
}, token) {
  return request({
    method: 'POST',
    url: 'products',
    data: {
      name,
      description,
      category,
      tags,
      withdrawn: false
    },
    token
  });
}

function getProducts({
  start,
  count,
  status,
  sort
}, token) {
  return request({
    method: 'GET',
    url: 'products',
    params: {
      start: start || 0,
      count,
      status,
      sort,
      withDrawn: false
    },
    token
  });
}

function getProduct(id) {
  return request({
    method: 'GET',
    url: `products/${id}`
  });
}
const productsService = {
  createProduct,
  getProducts,
  getProduct
};

export default productsService;
