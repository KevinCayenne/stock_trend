const cors = 'https://cors-proxy-kevincay.herokuapp.com/';
const url = 'https://www.moneydj.com/Z/ZB/ZBA/CZBA1.DJBCD';
const stockTrendRequest = axios.create({
    baseURL: `${cors}${url}`,
    params: {
    },
});

// unit search api
const stockTrendSearch = data => stockTrendRequest.get('', data); 