import { request } from './agent';
import filterProperties from '../helpers/filter-properties';

function createProduct({
  category,
  description,
  extraData,
  name,
  tags
}, token) {
  const filteredData = filterProperties(extraData);

  console.log(filteredData);
  const data = {
    category,
    description,
    extraData: filteredData,
    name,
    tags,
    withdrawn: false
  };
  return request({
    method: 'POST',
    url: 'products',
    data,
    token
  });
}

function editProduct({
  category,
  description,
  extraData,
  name,
  id,
  tags
}, token) {
  const filteredData = filterProperties(extraData);

  console.log(filteredData);
  const data = {
    category,
    description,
    extraData: filteredData,
    name,
    tags,
    withdrawn: false
  };
  return request({
    method: 'PUT',
    url: `products/${id}`,
    data,
    token
  });
}


function getProducts({
  start,
  count,
  status,
  sort
}, token) {
  const params = {
    start: start || 0,
    count,
    status,
    sort,
    withDrawn: false
  };

  return request({
    method: 'GET',
    url: 'products',
    params,
    token
  });
}

function getAllProducts() {
  return new Promise(async (resolve, reject) => {
    const count = 50;
    let products = [];
    let start = 0;
    const status = 'all';
    const sort = 'name|asc';
    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const data = (await getProducts({
          start,
          count,
          sort,
          status
        })).data;
        products = products.concat(data.products);
        if (data.count > data.products.length) {
          break;
        }
        start += count;
      }
      resolve(products);
    } catch (err) {
      reject(err);
    }
  });
}

function getProduct(id) {
  return request({
    method: 'GET',
    url: `products/${id}`
  });
}


function removeProduct(id, token) {
  return request({
    method: 'DELETE',
    url: `products/${id}`,
    token
  });
}

const productsService = {
  createProduct,
  editProduct,
  getAllProducts,
  getProducts,
  getProduct,
  removeProduct
};

export default productsService;
