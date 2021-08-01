Vue.use(VueLoading);
    
let loader = new Vue({
    el: '#loader',
    data() {
        return {
            visible: false,
            loader: {}
        }
    },
    components: {
        Loading: VueLoading
    },
    methods: {
        open() {
            this.loader = this.$loading.show({
                loader: 'dots',
                color: '#429EFF',
                width: 74,
                height: 74,
                backgroundColor: '#ffffff',
            });
        },
        close() {
            this.loader.hide();
        },
        show() {
            // console.log('show was clicked, click to hide');
            // do AJAX here
            this.visible = true;
        },
        hide() {
            this.visible = false;
        }
    }
});