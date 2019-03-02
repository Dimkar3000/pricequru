import { request } from './agent';

function createShop({
  address,
  lng,
  lat,
  name,
  tags
}, token) {
  const data = {
    name,
    tags,
    lat,
    lng,
    address,
    withdrawn: false
  };
  return request({
    method: 'POST',
    url: 'shops',
    data,
    token
  });
}

function getShop(id) {
  return request({
    url: `shops/${id}`,
    method: 'GET'
  });
}

function getShops({
  count,
  start
}) {
  const params = {
    start,
    count
  };
  return request({
    url: 'shops',
    method: 'GET',
    params
  });
}

function getAllShops() {
  return new Promise(async (resolve, reject) => {
    const count = 50;
    let shops = [];
    let start = 0;
    const status = 'active';
    const sort = 'name|asc';
    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const data = (await getShops({
          start,
          count,
          sort,
          status
        })).data;
        shops = shops.concat(data.shops);
        if (data.count > data.shops.length) {
          break;
        }
        start += count;
      }
      resolve(shops);
    } catch (err) {
      reject(err);
    }
  });
}

const shopsService = {
  createShop,
  getAllShops,
  getShops,
  getShop
};
export default shopsService;
