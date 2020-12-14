new Vue({
    el: "#main",
    data: {
        images: [],
    },
    mounted: function () {
        var self = this;
        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
            })
            .catch(function (error) {
                console.log("error: ", error);
            });
    }
});