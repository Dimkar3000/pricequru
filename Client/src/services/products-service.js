import { request } from './agent';

function getAll(token) {
  return request({
    method: 'GET',
    url: 'products',
    token
  });
}
const productsService = {
  getAll
};

export default productsService;
