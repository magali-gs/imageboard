new Vue({
    el: "#main",
    data: {
        images: [],
    },
    // mounted is a lifecycle method that we can access
    mounted: function () {
        // console.log("my Vue component has mounted!");
        console.log("this before axios: ", this);
        var self = this;
        axios
            .get("/images")
            .then(function (response) {
                console.log("response.data: ", response.data);
                self.images = response.data;
            })
            .catch(function (error) {
                console.log("error: ", error);
            });
    },
    // methods: {
    //     methods: {
    //     petesMethod: function (city) {
    //         console.log("Pete's method :) :", city);
    //         console.log('this.cities: ',this.cities);
    //         // change the value of the name on data
    //         this.name = city;
    //     }
    // }
});