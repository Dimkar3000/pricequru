import { request } from './agent';

function createShop({
  address,
  lng,
  lat,
  name,
  tags
}, token) {
  return request({
    method: 'POST',
    url: 'shops',
    data: {
      name,
      tags,
      lat,
      lng,
      address,
      withdrawn: false
    },
    token
  });
}
function getShops({
  count,
  start
}) {
  return request({
    url: 'shops',
    method: 'GET',
    params: {
      start,
      count
    }
  });
}

function getShop(id) {
  return request({
    url: `shops/${id}`,
    method: 'GET'
  });
}

const shopsService = {
  createShop,
  getShops,
  getShop
};
export default shopsService;
