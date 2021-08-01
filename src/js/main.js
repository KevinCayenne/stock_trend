
Vue.component('line-chart', {
    extends: VueChartJs.Line,
    props: {
        labels: [],
        datasets: [],
        options: {
            
        }
    },
    mounted () {
        this.renderChart({
            labels: this.labels,
            datasets: this.datasets,
            options: this.options
        }, 
        {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Custom Chart Title',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        })
    } 
});

var stockTrendApp = new Vue({
    el: '#stock-trend-block',
    delimiters: ["[[", "]]"],
    data: () => ({
        data_config_obj_ratio: {
            x: '', 
            master: '', 
            sub: '',
            data: '',
            config: {},
            label: '',
            borderColor: '',
            fill: false,
        },
        data_config_obj: {
            x: '', 
            master: '', 
            data: '',
            change_ratio: '',
            config: {},
            label: '',
            borderColor: '',
            fill: false,
        },

        stock_trend_result_ratio: [],
        stock_trend_result: [],
        chartOptions: {
            responsive: true,
            maintainAspectRatio: false
        }
    }),
    created: function(){

    },
    mounted: function(){
        loader.open();
        this.get_stock_trend_data('tsl')
            .then(resp => {
                loader.close();
            })
            .catch(err => {
                console.error(err);
            });
    },
    methods: {
        get_stock_trend_data(type){
            let api_filter_config = '';

            // choose data config
            if(type === 'tsl'){
                api_filter_config = tsl_category_id_list;
            }else if(type === 'otc'){
                api_filter_config = otc_category_id_list;
            }

            // get data
            try{
                let requests = this.create_api_requests(api_filter_config);
                return axios.all(requests).then(axios.spread((...responses) => {
                    this.stock_trend_result_ratio = this.arrange_row_data_from_api(responses, api_filter_config, this.data_config_obj_ratio);
                    this.stock_trend_result = this.arrange_row_data_from_api(responses, api_filter_config, this.data_config_obj);

                    return this.stock_trend_result;
                }))
                .catch(err => {
                    console.error(err);
                })
            }catch(err){
                console.error(err);
            }
        },

        create_api_requests(api_filter_config){
            let requests = [];
            for(let i = 0; i < api_filter_config.length; i++){
                const category_id = api_filter_config[i].id;
                const data = {
                    params: {
                        a: category_id
                    },
                };
                const temp_request = stockTrendSearch(data);
                requests.push(temp_request);
            }

            return requests;
        },
        arrange_row_data_from_api(responses, api_filter_config, data_config_obj){
            let iter = 0;
            let stock_trend_result = [];

            for(let i = 0; i < responses.length; i++){
                let data = responses[i].data.split(' ');
                let temp_subdata_arr = {};
                Object.assign(data_config_obj);
                let data_config_arr = Object.keys(data_config_obj);

                let iter_inside = 0;
                for(let j = 0; j < data.length; j++){
                    let temp_subdata = data[j].split(',');
                    temp_subdata_arr[data_config_arr[j]] = temp_subdata;
                    iter_inside = iter_inside + 1;
                }

                if(iter_inside == data.length){
                    temp_subdata_arr.config = api_filter_config[i];
                    temp_subdata_arr.label = api_filter_config[i].name;
                    temp_subdata_arr.borderColor = api_filter_config[i].color;
                    temp_subdata_arr.fill = api_filter_config[i].color;

                    stock_trend_result.push(temp_subdata_arr);
                    iter = iter + 1;
                }
            }

            if(iter == responses.length){
                return stock_trend_result;
            }
        },
    }
});